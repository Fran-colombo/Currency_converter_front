import { Component, inject } from '@angular/core';
import { ConvertionsService } from '../../services/convertions.service';
import { AuthServicesService } from '../../services/auth-services.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { IGetConvertions } from '../../interfaces/iget-convertions';

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
userId: number = 0;
username: string = ""; 
formGetConvData: IGetConvertions = { username: "", month: 0 };


  // async searchConvertions(): Promise<void> {
  //   if (this.userId > 0) {
  //     const success = await this.convertionService.getUserConvertions(this.userId);
      
  //     if (!success) {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error',
  //         text: 'User ID does not exist!',
  //       });
  //     }
  //   } else {
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'Warning',
  //       text: 'Please enter a valid User ID!',
  //     });
  //   }
  // }

  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];
  
  async searchConvertions(formGetConvData: IGetConvertions): Promise<void> {
    if (formGetConvData.month > 0 && formGetConvData.month <= 12) {
      const success = await this.convertionService.getUserConvertionsByMonth(formGetConvData);
  
      if (!success) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No data found for the specified user!',
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please enter a valid User ID and Month!',
      });
    }
  }
  
}

