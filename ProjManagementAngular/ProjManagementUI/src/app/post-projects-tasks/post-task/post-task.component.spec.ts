// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { DataServiceForPost } from '../services/data-service.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-post-task',
//   templateUrl: './post-task.component.html',
//   styleUrls: ['./post-task.component.css'],
//   standalone: true,
//   imports: [FormsModule, CommonModule]
// })
// export class PostTaskComponent implements OnInit {
//   taskId: number = 0;
//   taskName: string = '';
//   taskStatus: number = 0;
//   selectedProjectId: number = 0;
//   selectedEmployeeId: number = 0;
//   nonWorkingEmployees: any[] = [];

//   projName: any = '';
//   empName: any = '';

//   projects: any[] = [];
//   dueDate: any = '';

//   private teamLeadId = localStorage.getItem('userId') || ''; // Set this to the ID of the team lead

//   constructor(private dataService: DataServiceForPost , private router: Router) { }

//   ngOnInit() {
//     this.fetchProjects();
//     this.fetchNonWorkingEmployees();
//   }

//   fetchProjects() {
//     this.dataService.getProjectsByTeamLeadId(this.teamLeadId)
//       .subscribe({
//         next: (projects) => {
//           this.projects = projects;
//         },
//         error: (error) => {
//           console.error('Error fetching projects:', error);
//         }
//       });
//   }

//   fetchNonWorkingEmployees() {
//     this.dataService.getNonWorkingEmployees()
//       .subscribe({
//         next: (employees) => {
//           this.nonWorkingEmployees = employees;
//         },
//         error: (error) => {
//           console.error('Error fetching non-working employees:', error);
//         }
//       });
//   }

//   onProjectChange(event: any) {
//     this.projName = event.target.value;
//     this.getProjectIdByName(this.projName);
//   }

//   getProjectIdByName(projectName: string) {
//     this.dataService.getProjectIdByName(projectName)
//       .subscribe({
//         next: (projectId) => {
//           this.selectedProjectId = projectId;
//         },
//         error: (error) => {
//           console.error('Error fetching project ID:', error);
//         }
//       });
//   }

//   onEmployeeChange(event: any) {
//     this.empName = event.target.value;
//     this.getEmployeeIdByName(this.empName);
//   }

//   getEmployeeIdByName(employeeName: string) {
//     this.dataService.getEmployeeIdByName(employeeName)
//       .subscribe({
//         next: (employeeId) => {
//           this.selectedEmployeeId = employeeId;
//         },
//         error: (error) => {
//           console.error('Error fetching employee ID:', error);
//         }
//       });
//   }

//   async onSubmit() {
//     const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

//     if (!token) {
//       console.error('No token found in localStorage');
//       return;
//     }

//     const body = {
//       taskId: this.taskId,
//       taskName: this.taskName,
//       taskStatus: this.taskStatus,
//       projectId: this.selectedProjectId,
//       assigningEmployeeId: this.selectedEmployeeId,
//       createdTeamLeader: this.teamLeadId,
//       dueDate: this.dueDate // Ensure dueDate is in correct format
//     };

//     try {
//       await this.dataService.postTask(body, token).toPromise();
//       alert('Task posted successfully');
//       this.router.navigate(['/view-tasks']);
//     } catch (error) {
//       console.error('Error in submission:', error);
//     }
//   }
// }
