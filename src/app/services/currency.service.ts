import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IConvertion } from '../interfaces/iconvertion';
import { ICurrency, ICurrencyToShow, ICurrencyUpdateReq } from '../interfaces/icurrency';
import { IUserToShow } from '../interfaces/iuser-to-show';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {


  currencies: ICurrency[] = [];
  currency: ICurrencyToShow [] = [];
  user: IUserToShow[] = [];


 constructor() {
  this.loadData();
 }

 async loadData() {
  await this.getAllCurrencies();
}



  async getAllCurrencies() {
    const res = await fetch(environment.API_URL+"Currency", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      },
    })
    if (res.status !== 200) return; 
    const resJson: ICurrencyToShow[] = await res.json();
    this.currency = resJson;
    // console.log(resJson);
   
  }


  async getCurrencyByCode(code: string) {
    const res = await fetch(environment.API_URL+"Currency/"+code, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
    if (res.status !== 200) {
      console.error("Error fetching currency");
      return null;
    }
    return await res.json();
  }

  async createCurrency(currency: ICurrency) {
    const res = await fetch(environment.API_URL+"Currency", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      },
      body: JSON.stringify(currency)
    });
    if (res.status !== 200) {
      console.error("Error creating currency");
    } else {
      console.log("Currency created successfully");
      this.loadData();
    }
    return res;
  }

  async updateCurrencyByCode(curUpd: ICurrencyUpdateReq) {
    const res = await fetch(environment.API_URL + "Currency", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      },
      body: JSON.stringify(curUpd)
    });
    if (res.status !== 200) {
      console.error("Error updating currency");
    } else {
      console.log("Currency updated successfully");
      this.loadData();
    }
    return res;
  }
  

  async deleteCurrency(code: string) {
    const res = await fetch(environment.API_URL+"Currency/"+code, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      },
      body: JSON.stringify( code )
    });
    if (res.status !== 200) {
      console.error("Error deleting currency");
    } else {
      console.log("Currency deleted successfully");
      this.loadData();
    }
  }
}
