import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthServicesService } from '../../services/auth-services.service';
import { IUser } from '../../interfaces/iuser';
import { UserRole } from '../../enums/user-role';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // esAdmin = true;
  authService = inject(AuthServicesService);
  router = inject(Router);
  isSignoutMenuVisible: boolean = false; 


  user: IUser = {
    role: this.authService.user?.role || UserRole.User, 
    username: this.authService.user?.username || '',
    token: this.authService.user?.token || '' 
  };


  toggleSignoutMenu(): void {
    this.isSignoutMenuVisible = !this.isSignoutMenuVisible; 
  }

  cerrarSesion(){
    this.authService.logout();
    this.router.navigate(['/logIn']).then(() => {
      window.location.reload();
    });
  }

}
