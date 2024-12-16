import { Component, inject } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { IConvertion } from '../../interfaces/iconvertion';
import { ICurrency } from '../../interfaces/icurrency';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ICurrencyToShow } from '../../interfaces/icurrency';
import { AuthServicesService } from '../../services/auth-services.service';
import { UserService } from '../../services/user.service';
import { IUserToShow } from '../../interfaces/iuser-to-show';
import { ConvertionsService } from '../../services/convertions.service';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent {

  code1: string | null = null;
  code2: string | null = null;
  amount: number = 0;
  result: number | null = null;
  conversionResult: number | null = null;
  currencies: ICurrency[] = [];
  router = inject(Router);
  currency: ICurrencyToShow[]  = [];  
  currencyService = inject(CurrencyService)
  convertion = inject(ConvertionsService)
  usertoshow: IUserToShow[] = [];
  usercomp = inject(AuthServicesService)
  userService = inject(UserService)
  userData: any = null;
  convLeft: number | null = null;
  
  
  constructor() {
    this.currency = this.currencyService.currency
  }
  
  ngOnInit() {
    this.getUserDetail();
  }

  async getUserDetail() {
    const username = this.usercomp?.user?.username; 
    if (username) {
      try {
        const user = await this.userService.getUserByUsername(username);
        if (user) {
          this.userData = user; 
          console.log('Datos del usuario:', this.userData);
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    } else {
      console.error('No se encontró el username del usuario logueado');
    }
  }

    
  CurrencyName(currency: ICurrencyToShow) {
    return currency.code + ' - ' + currency.legend;
  }

  validateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(',', '.');
    if (!/^\d*\.?\d*$/.test(value)) {
      value = value.slice(0, -1);
    }
    input.value = value;
  }

  errorConversion = false;
  resultConversion: number | null = null;

  
  async ConverterFormData(converterForm: NgForm) {
    const { Code1, Code2, Amount } =
      converterForm.value;
    const converterData: IConvertion = {Code1, Code2, Amount};
    this.resultConversion = null;


    const res = await this.convertion.makeConvertion(converterData);
    const us = await this.userData.conversions + 1;

    if (res !== null) {
      this.resultConversion = res;
      this.userData.conversions = us;
      this.userService.loadData();
      this.currencyService.loadData();
    } else {
      console.log("You don´t have more convertions")
      this.showUpgradeMembershipAlert();
      
    
  }}


  showUpgradeMembershipAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Uy',
      text: 'You’ve reached your conversion limit!',
      showCancelButton: true, 
      confirmButtonText: 'Upgrade Membership', 
      cancelButtonText: 'Stay with Current Plan', 
      reverseButtons: true, 
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/user-manage']);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log('User chose to stay with the current plan.');
      }
    });
  }
}  

  

