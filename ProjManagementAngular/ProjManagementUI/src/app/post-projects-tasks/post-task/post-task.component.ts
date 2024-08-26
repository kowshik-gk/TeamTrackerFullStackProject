import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceForTaskService } from '../../services/data-service-for-task.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CanComponentDeactivate } from '../../guards/can-deactivate.guard';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { CommonSnackbarComponent } from '../../common-mat-component/common-snackbar/common-snackbar.component';
import { DataServiceForEmployeeService } from '../../services/data-service-for-employee.service';
import { DataServiceForProjectService } from '../../services/data-service-for-project.service';

@Component({
  selector: 'app-post-task',
  templateUrl: './post-task.component.html',
  styleUrls: ['./post-task.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
    MatProgressBarModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
  providers: [DatePipe],
})
export class PostTaskComponent implements OnInit {
  taskId: string = '0';
  taskName: string = '';
  taskStatus: number = 0;
  selectedProjectId: string = '0';
  selectedEmployeeId: string = '0';
  nonWorkingEmployees: {
    employeeId: string;
    employeeName: string;
    taskName: string;
    projectName: string;
  }[] = [];
  projects: {
    projectId: string;
    name: string;
    description: string;
    numberOfTasks: number;
    completedTasks: number;
    dueDate: string;
    assignedTeamLeader: string;
    createdManager: string;
  }[] = [];

  projName: string = '';
  empName: string = '';
  dueDate: string = '';

  isLoadingToRetriveData: boolean = true;
  isLoadingToSubmitForm: boolean = false;

  private teamLeadId!: string | null;

  constructor(
    private dataServiceForTask: DataServiceForTaskService,
    private router: Router,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private dataServiceForEmployee: DataServiceForEmployeeService,
    private dataServiceForProject:DataServiceForProjectService
  ) {}

  ngOnInit() {
    // this.teamLeadId  = this.dataServiceForEmployee.userID.toString();

    this.teamLeadId = localStorage.getItem('userId') ?? '0';
    this.fetchProjects();
    this.fetchNonWorkingEmployees();
  }

  fetchProjects() {
    if (this.teamLeadId) {
      this.dataServiceForProject
        .getProjectsByTeamLeadId(this.teamLeadId, true, false)
        .pipe(
          catchError((error) => {
            console.error('Error fetching projects:', error);
            return throwError(() => new Error(error.message));
          })
        )
        .subscribe({
          next: (projects) => {
            this.projects = projects;
          },
          error: (error) => {
            console.error('Error:', error);
          },
        });
    }
  }

  fetchNonWorkingEmployees() {
    this.dataServiceForEmployee
      .getNonWorkingEmployees()
      .pipe(
        catchError((error) => {
          console.error('Error fetching non-working employees:', error);
          return throwError(() => new Error(error.message));
        })
      )
      .subscribe({
        next: (employees) => {
          this.nonWorkingEmployees = employees;
          this.isLoadingToRetriveData = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.isLoadingToRetriveData = false;
        },
      });
  }

  onProjectChange(event: MatAutocompleteSelectedEvent) {
    this.projName = event.option.value;
    const selectedProject = this.projects.find(
      (project) => project.name === this.projName
    );
    if (selectedProject) {
      this.selectedProjectId = selectedProject.projectId;
    } else {
      console.warn('Project not found:', this.projName);
      this.selectedProjectId = '0';
    }
  }

  onEmployeeChange(event: MatAutocompleteSelectedEvent) {
    this.empName = event.option.value;
    const selectedEmployee = this.nonWorkingEmployees.find(
      (employee) => employee.employeeName === this.empName
    );
    if (selectedEmployee) {
      this.selectedEmployeeId = selectedEmployee.employeeId;
    } else {
      console.warn('Employee not found:', this.empName);
      this.selectedEmployeeId = '0';
    }
  }
  async onSubmit() {
    this.isLoadingToSubmitForm = true;
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
  
    if (!token) {
      console.error('No token found in localStorage');
      this.isLoadingToSubmitForm = false;
      return;
    }
  
    // Ensure dueDate is formatted correctly
    const formattedDueDate = this.dueDate
      ? new Date(this.dueDate).toISOString()
      : null;
  
    // Validate and fix taskId if necessary
    const taskId = this.taskId && this.taskId !== '0' ? this.taskId : null;
  
    const body = {
      taskId: this.taskId !== '0' ? this.taskId : undefined, // or null if server expects null
      taskName: this.taskName,
      taskStatus: this.taskStatus,
      projectId: this.selectedProjectId,
      assigningEmployeeId: this.selectedEmployeeId,
      createdTeamLeader: this.teamLeadId ?? '0',
      dueDate: formattedDueDate,
    };
    
  
    console.log('Request body:', body);
  
    this.dataServiceForTask
      .postTask(body, token)
      .pipe(
        catchError((error) => {
          console.error('There was a problem with the HTTP request:', error);
          return throwError(() => new Error(error.message));
        })
      )
      .subscribe({
        next: (responseText) => {
          this.openSnackBar(
            true,
            `Task ${this.taskName} For ${this.empName} Added`
          );
  
          this.router.navigate(['team-leader-dashboard/view-projects']);
          this.isLoadingToSubmitForm = false;
        },
        error: (error) => {
          console.error('There was a problem with the HTTP request:', error);
          this.isLoadingToSubmitForm = false;
        },
      });
  }
  

  canDeactivate(): boolean {
    if (
      !this.taskName ||
      !this.selectedProjectId ||
      !this.selectedEmployeeId ||
      !this.dueDate ||
      this.taskStatus < 0
    ) {
      this.openSnackBar(false, 'Invalid Form , Pls Fill Form to navigate');
      return false;
    }

    return true; // All checks passed, allow navigation
  }

  private openSnackBar(isSuccess: boolean, message: string) {
    let currentClassForBackColor: string = isSuccess
      ? 'success-snackbar'
      : 'warning-snackbar';
    this.snackBar.openFromComponent(CommonSnackbarComponent, {
      data: { isSuccess, message },
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: [currentClassForBackColor],
      duration: 5000,
    });
  }
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any): void {
  //   if (!this.taskName || !this.selectedProjectId || !this.selectedEmployeeId || !this.dueDate || this.taskStatus < 0) {
  //     $event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  //   }
  // }
}
