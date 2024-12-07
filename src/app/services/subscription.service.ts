import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ISubscription } from '../interfaces/isubscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
 subscription: ISubscription [] = []

  constructor() { }


  async GetAllSubscriptions(){
    const res = await fetch(environment.API_URL+"Subscription", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      },
    })
    if (res.status !== 200) return; 
    const resJson: ISubscription[] = await res.json();
    this.subscription = resJson;
    console.log(resJson);
  }

  async UpdateUserSub(username: string , subId: number ){
    const res = await fetch(environment.API_URL+"Subscription"+username, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      },
      body: JSON.stringify(subId)
    });
    
    if (res.status !== 200) {
      console.error("Error updating user subscription");
    } else {
      console.log("User subscription updated successfully");
    }
    return res;
  }
  }
