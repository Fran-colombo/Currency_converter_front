import { Component, inject } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { ICurrency, ICurrencyUpdateReq } from '../../interfaces/icurrency';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ICurrencyToShow } from '../../interfaces/icurrency';
import { AuthServicesService } from '../../services/auth-services.service';
import { IUser } from '../../interfaces/iuser';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../enums/user-role';

@Component({
  selector: 'app-currencies',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './currencies.component.html',
  styleUrl: './currencies.component.scss'
})
export class CurrenciesComponent {
//  currencies: ICurrency[] = [];
 router = inject(Router)
  showForm = false;
  errorRegister = false;
  currencyService = inject(CurrencyService)
  authService = inject(AuthServicesService)
  currency: ICurrencyToShow [] = [];
  curr: ICurrency [] = [];
  


  async openCreateCurrencyModal() {
    const { value: formValues } = await Swal.fire({
      title: 'Create New Currency',
      html: `
        <input id="swal-code" class="swal2-input" placeholder="Enter code">
        <input id="swal-legend" class="swal2-input" placeholder="Enter legend">
        <input id="swal-symbol" class="swal2-input" placeholder="Enter symbol">
        <input type="number" id="swal-conversionIndex" class="swal2-input" placeholder="Enter conversion index">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const Code = (document.getElementById('swal-code') as HTMLInputElement).value;
        const Legend = (document.getElementById('swal-legend') as HTMLInputElement).value;
        const Symbol = (document.getElementById('swal-symbol') as HTMLInputElement).value;
        const ConvertionIndex = (document.getElementById('swal-conversionIndex') as HTMLInputElement).value;
  
        if (!Code || !Legend || !Symbol || !ConvertionIndex) {
          Swal.showValidationMessage('All fields are required');
          return null;
        }
  
        if (isNaN(Number(ConvertionIndex)) || Number(ConvertionIndex) <= 0) {
          Swal.showValidationMessage('Conversion index must be a positive number');
          return null;
        }
  
        return { Code, Legend, Symbol, ConvertionIndex: Number(ConvertionIndex) };
      },
    });
  
    if (formValues) {
      const fakeForm: any = { value: formValues, invalid: false };
      await this.createCurrency(fakeForm);
    }
  }
  

  async createCurrency(registerCurrencyForm: NgForm) {
    const { Code, Legend, Symbol, ConvertionIndex } = registerCurrencyForm.value;
    const registerCurrencyData = { Code, Legend, Symbol, ConvertionIndex };
  
    const res = await this.currencyService.createCurrency(registerCurrencyData);
  
    if (res?.status === 200) {
      Swal.fire('Currency created successfully', '', 'success');
    } else {
      Swal.fire('We couldn\'t create the currency', '', 'error');
    }
  }
  
  
  async updateCurrency(curUpd: ICurrencyUpdateReq) {
    if(this.authService.user?.role === "Admin"){
    const { value: formValues } = await Swal.fire({
      
      title: `Update Conversion Index for ${curUpd.code}`,
      html: `
        <label for="convertionIndex">New Conversion Index:</label>
        <input id="convertionIndex" class="swal2-input" type="number" value="${curUpd.convertionIndex}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const convertionIndex = parseFloat((document.getElementById('convertionIndex') as HTMLInputElement)?.value);
        return { convertionIndex }; 
      }
    });
    if (formValues) {
      const updatedCurrencyData = {
        code: curUpd.code, 
        convertionIndex: formValues.convertionIndex
      };
  
      try {
        const res = await this.currencyService.updateCurrencyByCode(updatedCurrencyData); // Llamada al servicio
        if (res?.status === 200) {
          Swal.fire('Success', 'Currency updated successfully!', 'success');
        } else {
          Swal.fire( 'Unexpected error', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Error updating currency. Please try again later.', 'error');
        console.error('Detailed error:', error);
      }
    }
  }
  }

  

  DeleteCurrency(code: string) {
    if(this.authService.user?.role === "Admin"){
    Swal.fire({
      title: "delete currency?",
      text: "You are not going to undo this action!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      denyButtonText: "Cancel",
      background: '#1a1a1a', 
      color: '#ffffff', 
      customClass: {
        popup: 'futurista-modal' 
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.currencyService.deleteCurrency(code);
        Swal.fire({
        title: "¡Deleted!", 
        text: "The currency has been deleted.", 
        icon: "success",
        background: '#1a1a1a', 
        color: '#ffffff', 
        confirmButtonColor: "#3085d6"
      });
      } else if (result.isDenied) {
        Swal.fire("Cambios no guardados", "", "info");
      }
    })}};
  }

