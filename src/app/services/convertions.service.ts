import { Injectable } from '@angular/core';
import { IConvertions } from '../interfaces/iconvertions';
import { environment } from '../../environments/environment.development';
import { IConvertion } from '../interfaces/iconvertion';
import { IGetConvertions } from '../interfaces/iget-convertions';

@Injectable({
  providedIn: 'root'
})
export class ConvertionsService {

  convertions : IConvertions[] = []
  constructor() {
    this.loadData();
   }
  
   async loadData() {
    await this.getConvertions();
    // await this.getUserConvertionsByMonthForCurrentUser();
  }
  
  
  
    async getConvertions() {
      const res = await fetch(environment.API_URL+"Convertion", {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        },
      })
      if (res.status !== 200) return; 
      const resJson: IConvertions[] = await res.json();
      this.convertions = resJson.map(convertion => ({
        ...convertion,
        amount: convertion.amount > 1 ? parseFloat(convertion.amount.toFixed(1)) : parseFloat(convertion.amount.toFixed(3)) ,
      }));
      
    }

    // async getUserConvertionsByMonthForCurrentUser(month: number = new Date().getMonth() + 1) {
    //   const res = await fetch(`${environment.API_URL}Convertion?month=${month}`, {
    //     method: 'GET',
    //     headers: {
    //       Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    //     },
    //   });
    
    //   if (res.status === 200) {
    //     const resJson: IConvertions[] = await res.json();
    //     this.convertions = resJson.map(convertion => ({
    //       ...convertion,
    //       amount: convertion.amount > 1
    //         ? parseFloat(convertion.amount.toFixed(1))
    //         : parseFloat(convertion.amount.toFixed(3)),
    //     }));
    //     return true;
    //   }
    
    //   console.error('Failed to fetch monthly conversions');
    //   return false;
    // }
    
    

    async getUserConvertions(id : number){
      const res = await fetch(environment.API_URL+"Convertion/" + id, {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        },
      })
      const resJson: IConvertions[] = await res.json();
      this.convertions = resJson;

      this.convertions = resJson.map(convertion => ({
        ...convertion,
        amount: convertion.amount > 1 ? parseFloat(convertion.amount.toFixed(1)) : parseFloat(convertion.amount.toFixed(3)) ,
      }));
   
      
      if (res.status === 200){ return  true;}
      if(res.status === 401) return;
      return false;
    }

    // async getUserConvertionsByMonth(formGetConvData: IGetConvertions) {
    //   const { username, month } = formGetConvData;
    //   const res = await fetch(`${environment.API_URL}Convertion/user/${username}?month=${month}`, {
    //     method: "GET",
    //     headers: {
    //       Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    //     },
    //   });
    
    //   if (res.status === 200) {
    //     const resJson: IConvertions[] = await res.json();
    //     this.convertions = resJson.map(convertion => ({
    //       ...convertion,
    //       amount: convertion.amount > 1
    //         ? parseFloat(convertion.amount.toFixed(1))
    //         : parseFloat(convertion.amount.toFixed(3)),
    //     }));
    //     return true;
    //   }
    
    //   if (res.status === 401) {
    //     console.error('Unauthorized');
    //     return false;
    //   }    
    //   console.error('Failed to fetch user conversions');
    //   return false;
    // }
    async getUserConvertionsByMonthForCurrentUser(month: number = new Date().getMonth() + 1, year: number = new Date().getFullYear()) {
      const res = await fetch(`${environment.API_URL}Convertion?month=${month}&year=${year}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      });
    
      if (res.status === 200) {
        const resJson: IConvertions[] = await res.json();
        this.convertions = resJson.map(convertion => ({
          ...convertion,
          amount: convertion.amount > 1 ? parseFloat(convertion.amount.toFixed(1)) : parseFloat(convertion.amount.toFixed(3)),
        }));
        return true;
      }
    
      console.error('Failed to fetch monthly conversions');
      return false;
    }
    
    async getUserConvertionsByMonth(formGetConvData: IGetConvertions) {
      const { username, month, year } = formGetConvData;
      const res = await fetch(`${environment.API_URL}Convertion/user/${username}?month=${month}&year=${year}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      });
    
      if (res.status === 200) {
        const resJson: IConvertions[] = await res.json();
        this.convertions = resJson.map(convertion => ({
          ...convertion,
          amount: convertion.amount > 1 ? parseFloat(convertion.amount.toFixed(1)) : parseFloat(convertion.amount.toFixed(3)),
        }));
        return true;
      }
    
      console.error('Failed to fetch user conversions');
      return false;
    }
    
    

  async makeConvertion(formData: IConvertion) {
    try {
      const response = await fetch(`${environment.API_URL}Convertion/conv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(formData),
      });
  
      if (response.status === 200) {
        const resText = await response.text();
        let result;
  
        try {
          result = JSON.parse(resText); // Intenta parsear como JSON.
        } catch {
          result = resText; // Si falla, usa el texto como está.
        }
  
        this.loadData();
        console.log(result);
        return result;
      } else if (response.status === 204) {
        console.log(
          "You reached the top of convertions you can do, if you want to do more upgrade your sub type"
        );
        return null;
      } else {
        console.error('Conversion fallida');
        return false;
      }
    } catch (error) {
      console.error('Error en el proceso de conversión:', error);
      return false;
    }
  }
  
  }