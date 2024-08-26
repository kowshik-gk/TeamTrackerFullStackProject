import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-common-snackbar',
  templateUrl: './common-snackbar.component.html',
  styleUrls: ['./common-snackbar.component.css'],
  standalone: true,
  imports: [CommonModule] // Add CommonModule here
})
export class CommonSnackbarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<CommonSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { isSuccess: boolean | null, message: string }
  ) {}

  getBackgroundColor(): string {
    return this.data.isSuccess ? '#4caf50' : '#f44336'; 
  }

  getHeadingText(): string {
    return this.data.isSuccess ? 'SUCCESS' : 'WARNING';
  }


}



// import { Component, Inject } from '@angular/core';
// import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
// import { CommonModule } from '@angular/common'; // Import CommonModule

// @Component({
//   selector: 'app-common-snackbar',
//   templateUrl: './common-snackbar.component.html',
//   styleUrls: ['./common-snackbar.component.css'],
//   standalone: true,
//   imports: [CommonModule] // Add CommonModule here
// })
// export class CommonSnackbarComponent {
//   constructor(
//     public snackBarRef: MatSnackBarRef<CommonSnackbarComponent>,
//     @Inject(MAT_SNACK_BAR_DATA) public data: { isSuccess: boolean, message: string }
//   ) {}

//   getBackgroundColor(): string {
//     return this.data.isSuccess ? '#4caf50' : '#f44336'; 
//   }
// }
