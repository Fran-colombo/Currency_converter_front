import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  errorRegister = false;
  userService = inject(UserService)
  router = inject(Router)

  // async register(registerForm: NgForm) {

  //   if (registerForm.invalid) {
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'Formulario inválido',
  //       text: 'Por favor, completa todos los campos correctamente.',
  //       timer: 3000,
  //     });
  //     return;
  //   }
    
  //   const {username, password, confirmPassword, email, subscription} = registerForm.value;
  
  
  //   if (password !== confirmPassword) {
  //     console.log(password, confirmPassword)
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Passwords do not match',
  //       text: 'Please, be sure that both passwords are equals.',
  //       timer: 3000,
  //     });
  //     return;
  //   }
  
  //   const subscriptionMap = { Free: 1, Trial: 2, Pro: 3 };

  //   const subscriptionId = subscriptionMap[subscription as keyof typeof subscriptionMap];
  //   if (!subscriptionId) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en la suscripción',
  //       text: 'Tipo de suscripción no válido.',
  //       timer: 3000,
  //     });
  //     return;
  //   }
  
  //   const registerData = {
  //     username,
  //     password,
  //     email,
  //     confirmPassword,
  //     subscription,
  //   };
  
    
  //   const response = await this.userService.signUp(registerData);
  
  //   if (response) {
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Registro exitoso',
  //       timer: 3000,
  //     });
  //     this.router.navigate(["/logIn"]);
  //   } else {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Something went wrong signing up',
  //       timer: 3000,
  //     });
  //   }
  // }
  async register(registerForm: NgForm) {
    if (registerForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos correctamente.',
        timer: 3000,
      });
      return;
    }
  
    const { username, password, confirmPassword, email, subscription } = registerForm.value;
    if(password.length <= 8){
      Swal.fire({
        icon: 'error',
        title: 'Password length should be longer than 7 characters',
        text: 'Please, be sure that the password is over the min value.',
        timer: 3000,
      });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Please, be sure that both passwords are equals.',
        timer: 3000,
      });
      return;
    }
  
    const subscriptionMap = { Free: 1, Trial: 2, Pro: 3 };
    const subscriptionId = subscriptionMap[subscription as keyof typeof subscriptionMap];
    
    if (!subscriptionId) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la suscripción',
        text: 'Tipo de suscripción no válido.',
        timer: 3000,
      });
      return;
    }
  
    const registerData = { username, password, email, confirmPassword, subscription };
    const response = await this.userService.signUp(registerData);
  

    if (response.success) {
      Swal.fire({
        icon: 'success',
        title: response.message,
        timer: 3000,
      });
      this.router.navigate(['/logIn']);
    } else {
      Swal.fire({
        icon: 'error',
        title: response.message,
        timer: 3000,
      });
    }
    
  }
}
