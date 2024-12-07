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
  


  async createCurrency(RegisterCurrencyForm: NgForm) {
    const {Code, Legend, Symbol, ConvertionIndex} = RegisterCurrencyForm.value;
    const registerCurrencyData = {Code, Legend, Symbol, ConvertionIndex};

    const res = await this.currencyService.createCurrency(registerCurrencyData)

    if(res?.status === 200){
      Swal.fire("Registro exitoso", "", "success");
      RegisterCurrencyForm.reset(); 
      this.showForm = false;
    }
    else{
       this.errorRegister = true
    }
  }
  
  async updateCurrency(curUpd: ICurrencyUpdateReq) {
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

  

  DeleteCurrency(code: string) {
    Swal.fire({
      title: "delete user?",
      text: "You are not going to undo this action!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      denyButtonText: "Cancelar",
      background: '#1a1a1a', 
      color: '#ffffff', 
      customClass: {
        popup: 'futurista-modal' 
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.currencyService.deleteCurrency(code);
        Swal.fire({
        title: "¡Borrada!", 
        text: "La cochera ha sido eliminada.", 
        icon: "success",
        background: '#1a1a1a', 
        color: '#ffffff', 
        confirmButtonColor: "#3085d6"
      });
      } else if (result.isDenied) {
        Swal.fire("Cambios no guardados", "", "info");
      }
    })};
  }

