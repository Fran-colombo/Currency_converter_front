import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IUser } from '../interfaces/iuser';
import { IUpdateUserSub } from '../interfaces/iupdate-user-sub';
import { IUserToShow } from '../interfaces/iuser-to-show';
import { ISignUp } from '../interfaces/isign-up';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 users: IUser [] = []
 user: IUserToShow[] = []

 userData: any = null; // Almacenamos los datos del usuario aquí

 

  
   async loadData() {
    await this.getAllUsers();
  }

 

  async getAllUsers(): Promise<IUserToShow[] | undefined> {
    try {
      const res = await fetch(`${environment.API_URL}User`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
  
      if (res.status !== 200) {
        console.error('Error al obtener usuarios:', res.statusText);
        return;
      }

      const resText: IUserToShow[] = await res.json();
      this.user = resText;
      return this.user;
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      return;
    }
  }
  
  async signUp(signUpData: ISignUp): Promise<boolean> {
    try {
      const response = await fetch(`${environment.API_URL}User`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpData),
      });

      if (response.status === 200) {
        console.log('Usuario registrado exitosamente.');
        this.loadData();
        return true;
      } else {
        console.error('Error al registrar usuario.');
        return false;
      }
    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      return false;
    }
  }
  

  async updateUserSub(updateData: IUpdateUserSub) {
    const res = await fetch(environment.API_URL+"User/"+ updateData.username , {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      },
      body: JSON.stringify(updateData.subId)
    });
    
    if (res.status === 200) {
      console.log("User subscription updated successfully");
      this.loadData();
    } else {
      console.error("Error updating user subscription");
    }
    return res;
  }

  async deleteUser(username: string){
    const res = await fetch(environment.API_URL+"User/"+ username,{
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      },     
      body: JSON.stringify(username)
      });

      if(res?.status !== 200) return;
      else{
        console.log("User has been deleted successfully");
        this.loadData();
      }
      return res
    }

    // async getUserByUsername(username: string){
    //   const res = await fetch(environment.API_URL+"User/"+ username,{
    //     method: "GET",
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    //     },     
    //     // body: JSON.stringify(username)
    //     });
    //     if(res?.status !== 200) return;
    //     else{
    //       const resText: IUserToShow[] = await res.json();
    //       console.log(resText)
    //       // return this.user = resText;
    //     }
    //     return res
    //   }
    // }
    async getUserByUsername(username: string): Promise<IUserToShow | null> {
      try {
        const res = await fetch(environment.API_URL + "User/" + username, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
          },
        });
    
        if (res.status !== 200) {
          console.error("Error al obtener usuario:", res.status);
          return null;
        }
    
        const userData: IUserToShow = await res.json();
        // this.loadData();
        return userData;
      } catch (error) {
        console.error("Error en la petición GET:", error);
        return null;
      }
    }
    
  }

  
  




