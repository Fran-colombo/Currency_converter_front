import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthServicesService } from '../../services/auth-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  authService = inject(AuthServicesService);
  router = inject(Router);

  
  errorLogin = false;

  async login(loginForm: NgForm) {
    const { Username, Password } = loginForm.value;
    const loginData = { Username, Password };

    try {
      await this.authService.login(loginData);
      this.router.navigate(['/converter']);
    } catch (error) {
      this.errorLogin = true;
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: 'Invalid username or password',
        timer: 3000,
      });
    }
  }
}
