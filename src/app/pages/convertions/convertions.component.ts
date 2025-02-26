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
isLoading: boolean = false; 
currentYear = new Date().getFullYear();
availableYears = Array.from(
  new Set(Array.from({ length: 25 }, (_, i) => this.currentYear - i))
);
formGetConvData: IGetConvertions = { username: "", month: 1 ,year : this.currentYear};

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
  
  // async searchConvertionsForUser(month: number): Promise<void> {
  //   if (month > 0 && month <= 12) {
  //     this.isLoading = true; // Comienza el estado de carga
  //     try {
  //       const success = await this.convertionService.getUserConvertionsByMonthForCurrentUser(month);
        
  //       if (!success) {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Error',
  //           text: 'No conversions found for the selected month!',
  //         });
  //       }
  //     } catch (error) {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Unexpected Error',
  //         text: 'Something went wrong. Please try again!',
  //       });
  //       console.error(error);
  //     } finally {
  //       this.isLoading = false; // Finaliza el estado de carga
  //     }
  //   } else {
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'Warning',
  //       text: 'Please select a valid month!',
  //     });
  //   }
  // }
  async searchConvertionsForUser(month: number, year: number): Promise<void> {
    if (month > 0 && month <= 12) {
      this.isLoading = true;
      try {
        const success = await this.convertionService.getUserConvertionsByMonthForCurrentUser(month, year);
        if (!success) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No conversions found for the selected month and year!',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Unexpected Error',
          text: 'Something went wrong. Please try again!',
        });
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please select a valid month!',
      });
    }
  }
  

}

