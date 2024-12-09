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


async openCreateUserModal() {
  const { value: formValues } = await Swal.fire({
    title: 'Create User',
    html: `
      <input id="swal-username" class="swal2-input" placeholder="Username">
      <input type="password" id="swal-password" class="swal2-input" placeholder="Password">
      <input type="password" id="swal-confirmPassword" class="swal2-input" placeholder="Confirm Password">
      <input type="email" id="swal-email" class="swal2-input" placeholder="Email">
      <select id="swal-subscription" class="swal2-select">
        <option value="">Select Subscription</option>
        <option value="Free">Free</option>
        <option value="Trial">Trial</option>
        <option value="Pro">Pro</option>
      </select>
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const username = (document.getElementById('swal-username') as HTMLInputElement).value;
      const password = (document.getElementById('swal-password') as HTMLInputElement).value;
      const confirmPassword = (document.getElementById('swal-confirmPassword') as HTMLInputElement).value;
      const email = (document.getElementById('swal-email') as HTMLInputElement).value;
      const subscription = (document.getElementById('swal-subscription') as HTMLSelectElement).value;

      if (!username || !password || !confirmPassword || !email || !subscription) {
        Swal.showValidationMessage('All fields are required');
        return null;
      }

      return { username, password, confirmPassword, email, subscription };
    },
  });

  if (formValues) {
    // Llama al método register con los valores del modal
    const fakeForm: any = { value: formValues, invalid: false };
    await this.register(fakeForm);
  }
}

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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong signing up',
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
    confirmButtonText: "Delete",
    denyButtonText: "Cancel",
    background: '#1a1a1a', 
    color: '#ffffff', 
    customClass: {
      popup: 'futurista-modal' 
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      await this.userService.deleteUser(username);
      Swal.fire({
      title: "Deleted!", 
      text: "The user has been deleted.", 
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
