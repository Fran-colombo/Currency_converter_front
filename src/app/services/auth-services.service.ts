import { Injectable, inject } from '@angular/core';
import { IUser } from '../interfaces/iuser';
import { ILogin } from '../interfaces/ilogin';
import { ISignUp } from '../interfaces/isign-up';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { UserRole } from '../enums/user-role';

@Injectable({
  providedIn: 'root',
})
export class AuthServicesService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USERNAME_KEY = 'username';
  private readonly ROLE_KEY = 'role';

  user: IUser | undefined;
  router = inject(Router);

  constructor() {
    this.initializeUserFromStorage();
    // this.loadData();
  }


  
  //  async loadData() {
  //   // await this.signUp();
  // }
  
  private parseJwt(token: string): any {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
  }

  private saveToStorage(token: string, username: string, role: UserRole): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USERNAME_KEY, username);
    localStorage.setItem(this.ROLE_KEY, role);
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }

  private initializeUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const username = localStorage.getItem(this.USERNAME_KEY);
    const role = localStorage.getItem(this.ROLE_KEY) as UserRole | null;

    if (token && username && role) {
      this.user = { username, role, token };
      console.log('Usuario inicializado desde localStorage:', this.user);
    } else {
      console.log('No se encontró un usuario en el almacenamiento.');
    }
  }

  async login(loginData: ILogin): Promise<void> {
    try {
      const response = await fetch(`${environment.API_URL}Authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (response.status !== 200) {
        throw new Error('Error en la autenticación');
      }

      const token = await response.text();
      const parsedToken = this.parseJwt(token);

      this.user = {
        username: parsedToken.given_name,
        role: parsedToken.role,
        token,
      };

      this.saveToStorage(token, this.user.username, this.user.role);
      console.log('Usuario logueado:', this.user);

    } catch (error) {
      console.error('Error en el login:', error);
      throw error;
    }
  }

  async fetchUserDetails(): Promise<void> {
    if (!this.user?.token) {
      console.error('No hay token disponible para obtener detalles del usuario.');
      return;
    }

    try {
      const response = await fetch(`${environment.API_URL}User`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const userDetails = await response.json();
        this.user = { ...userDetails, token: this.user.token };
        console.log('Detalles del usuario actualizados:', this.user);
      } else {
        throw new Error('Token inválido o expirado');
      }
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
      this.logout();
    }
  }

  logout(): void {
    this.clearStorage();
    this.user = undefined;
    this.router.navigate(['/login']);
    console.log('Usuario deslogueado');
  }


  async validateSession(): Promise<void> {
    if (!this.user) {
      console.log('Intentando recuperar usuario desde almacenamiento...');
      this.initializeUserFromStorage();
    }

    if (this.user?.token) {
      console.log('Validando token...');
      await this.fetchUserDetails();
    }
  }
}
