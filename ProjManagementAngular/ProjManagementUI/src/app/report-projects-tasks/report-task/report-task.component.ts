import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceForTaskService } from '../../services/data-service-for-task.service';
import { catchError, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CanComponentDeactivate } from '../../guards/can-deactivate.guard';
import { CommonSnackbarComponent } from '../../common-mat-component/common-snackbar/common-snackbar.component';

@Component({
  selector: 'app-report-task',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule, MatAutocompleteModule],
  templateUrl: './report-task.component.html',
  styleUrls: ['./report-task.component.css']
})
export class ReportTaskComponent implements OnInit {


  selectedTaskId: number = 0;  // Default to 0 or an appropriate default
  taskName: string = '';
  tasks: { taskId: number; taskName: string, createdTL: string }[] = [];
  createdTL: string = '';
  taskChanged: boolean = false;
  private employeeId: string=''; // Replace with actual employee ID retrieval

  isLoadingToSubmitForm: boolean = false;

  constructor(
    private dataServiceForTask: DataServiceForTaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // this.employeeId=this.dataServiceForView.userID.toString();
    this.employeeId  = localStorage.getItem('userId')??'0'
    this.fetchCurrentWorkingTask();


  }

  fetchCurrentWorkingTask() {
    if (this.employeeId) {
      this.dataServiceForTask.getTasksByEmployeeId(this.employeeId)
        .pipe(
          catchError(error => {
            console.error('Error fetching Task ID:', error);
            return throwError(() => new Error(error.message));
          })
        )
        .subscribe({
          next: (taskData) => {
            this.selectedTaskId = taskData.taskId;
            this.taskName = taskData.taskName;
            this.tasks = [{ taskId: taskData.taskId, taskName: taskData.taskName, createdTL: taskData.createdTL }];

            console.log("Fetched Task:", taskData);
          },
          error: (error) => {
            console.error('Error:', error);
          }
        });
    } else {
      console.error('No employee ID found in localStorage');
    }
  }

  onTaskChange(event: MatAutocompleteSelectedEvent) {

    const selectedTaskName: string = event.option.value;

    const selectedTask = this.tasks.find(task => task.taskName === selectedTaskName);
    this.selectedTaskId = selectedTask?.taskId ?? 0;
    if (selectedTask) {
      this.taskName = selectedTask.taskName;
      this.taskChanged = true;
    } else {
      console.error('Selected task not found');
    }
  }

  async onSubmit() {
    this.isLoadingToSubmitForm = true;
    try {
      const token = localStorage.getItem('authToken');

      if (token) {
        const response = await this.dataServiceForTask.updateTaskCompletionStatus(this.selectedTaskId, token).toPromise();

        this.openSnackBar(true, "Task " + this.taskName + " Completion Send To " + this.createdTL);

        await this.router.navigate(['employee-dashboard/view-projects']);
      } else {
        console.error('No token found in localStorage');
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);

    }
    this.isLoadingToSubmitForm = false;
  }
  canDeactivate(): boolean {
    if (!this.taskChanged) {
      this.openSnackBar(false, 'Invalid Form , Pls Fill Form to navigate');
      return false; // Prevent navigation
    }
    return true; // Allow navigation
  }

  private openSnackBar(isSuccess: boolean, message: string) {
    let currentClassForBackColor: string=isSuccess?'success-snackbar':'warning-snackbar';
    this.snackBar.openFromComponent(CommonSnackbarComponent, {
      data: { isSuccess, message },
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass:[currentClassForBackColor],
      duration:5000
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (!this.taskChanged)
      $event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  }
}

