import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
// import { AuthServicesService } from '../../services/auth-services.service';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { AuthServicesService } from '../../services/auth-services.service';
import { UserRole } from '../../enums/user-role';
import { SubscriptionService } from '../../services/subscription.service';
// import { IUserToShow } from '../../interfaces/iuser-to-show';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.scss'
})
export class UserManageComponent {
   errorRegister = false;
   userService = inject(UserService)
   authService = inject(AuthServicesService)
   subService = inject(SubscriptionService)
   router = inject(Router)
   showCreateForm = false;
   showUpdateForm = false;
   errorSignUp = false;


    
  errorLogin = false
  
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
    
    const {username, password, confirmPassword, email, subscription} = registerForm.value;
  
  
    if (password !== confirmPassword) {
      console.log(password, confirmPassword)
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Por favor, asegúrate de que ambas contraseñas sean iguales.',
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
  
    const registerData = {
      username,
      password,
      email,
      confirmPassword,
      subscription,
    };
  
    
    const response = await this.userService.signUp(registerData);
  
    if (response) {
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        timer: 3000,
      });
      registerForm.reset(); 
      this.showCreateForm = false;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        timer: 3000,
      });
    }
  }

  async updateUser(username: string, subId: number) {
    const { value: formValues } = await Swal.fire({
      title: `Update Subscription Type for ${username}`,
      html: `
        <label for="subscriptionType">New Subscription Type:</label>
        <select id="subscriptionType" class="swal2-select">
          <option value="1" ${subId === 1 ? 'selected' : ''}>Free</option>
          <option value="2" ${subId === 2 ? 'selected' : ''}>Trial</option>
          <option value="3" ${subId === 3 ? 'selected' : ''}>Pro</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const selectElement = document.getElementById('subscriptionType') as HTMLSelectElement;
        const selectedValue = parseInt(selectElement?.value, 10);
  
        if (!selectedValue || isNaN(selectedValue)) {
          Swal.showValidationMessage('Please select a valid subscription type');
          return null;
        }
  
        return { subId: selectedValue };
      },
    });
  
    if (formValues) {
      const updatedUserData = {
        username: username,
        subId: formValues.subId,
      };
  
      try {
        const res = await this.userService.updateUserSub(updatedUserData);
        if (res?.ok) {
          Swal.fire('Success', 'Subscription updated successfully!', 'success');
        } else {
          Swal.fire('Error', 'Error updating subscription.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Error updating subscription. Please try again later.', 'error');
        console.error('Detailed error:', error);
      }
    }
  }

  

DeleteUser(username: string) {
  if(this.authService.user?.role === UserRole.Admin){
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
      await this.userService.deleteUser(username);
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


}
