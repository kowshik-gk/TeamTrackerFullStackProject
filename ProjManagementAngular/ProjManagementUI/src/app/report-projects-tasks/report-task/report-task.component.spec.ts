// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { catchError, throwError } from 'rxjs';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-report-task',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './report-task.component.html',
//   styleUrls: ['./report-task.component.css']
// })
// export class ReportTaskComponent implements OnInit {
//   selectedTaskId: number = 8;  // Example hardcoded value
//   taskName: string = '';

//   private apiUrl = 'https://localhost:7031/api/ProjectView';
//   private taskCompletionUrl = 'https://localhost:7031/api/ProjectTaskCompletion/Task-Completion';
//   private employeeId = localStorage.getItem('userId'); // Replace with the actual employee ID or retrieve dynamically

//   constructor(private http: HttpClient, private router: Router) { }

//   ngOnInit() {
//     this.fetchCurrentWorkingTask();
//   }

//   fetchCurrentWorkingTask() {
//     this.http.get<any>(`${this.apiUrl}/GetTaskIdByEmpId?EmpId=${this.employeeId}`).subscribe({
//       next: (response) => {
//         const taskId = parseInt(response, 10);
//         this.selectedTaskId = isNaN(taskId) ? 0 : taskId;
//         console.log("Fetched TaskId:", this.selectedTaskId);
      
//       },
//       error: (error) => {
//         console.error('Error fetching Task ID:', error);
//       }
//     });
//   }
  
//   fetchTaskName(taskId: number) {
//     if (taskId <= 0) {
//       console.error('Invalid Task ID:', taskId);
//       return;
//     }

//     this.http.get<string>(`${this.apiUrl}/GetTaskNameById?TaskId=${taskId}`).subscribe({
//       next: (response) => {
//         this.taskName = response;
//         console.log("Fetched Task Name:", this.taskName);
//       },
//       error: (error) => {
//         console.error('Error fetching Task Name:', error);
//       }
//     });
//   }

//   async onSubmit() {
//     try {
//       const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

//       const headers = new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       });

//       const response = await this.http.post(this.taskCompletionUrl, { taskId: this.selectedTaskId }, { headers, responseType: 'text' as 'json' })
//         .pipe(
//           catchError((error: HttpErrorResponse) => {
//             console.error('There was a problem with the HTTP request:', error);
//             return throwError(() => new Error(error.message));
//           })
//         )
//         .toPromise();

//       // Navigate to another route after successful submission
//       await this.router.navigate(['/some-next-route']);
//     } catch (error) {
//       console.error('There was a problem with the fetch operation:', error);
//     }
//   }
// }
