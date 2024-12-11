import { Component, inject } from '@angular/core';
import { ConvertionsService } from '../../services/convertions.service';
import { AuthServicesService } from '../../services/auth-services.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-convertions',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './convertions.component.html',
  styleUrl: './convertions.component.scss'
})
export class ConvertionsComponent {
convertionService = inject(ConvertionsService)
authService = inject(AuthServicesService)
// userId: number = 0;
userId: number = 0; 


  async searchConvertions(): Promise<void> {
    if (this.userId > 0) {
      const success = await this.convertionService.getUserConvertions(this.userId);
      
      if (!success) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'User ID does not exist!',
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please enter a valid User ID!',
      });
    }
  }
}

