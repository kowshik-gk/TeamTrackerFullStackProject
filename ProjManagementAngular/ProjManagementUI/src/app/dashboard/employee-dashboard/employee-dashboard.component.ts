import { Component } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterModule,
  NavigationEnd,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ViewProfileComponent } from '../../common-mat-component/view-commom-profile/view-profile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { DataServiceForTaskService } from '../../services/data-service-for-task.service';
import { catchError, filter, throwError } from 'rxjs';
import { ViewProjectTaskComponent } from '../../common-mat-component/view-project-task/view-project-task.component';

@Component({
  standalone: true,
  selector: 'app-employee-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterModule,
    MatButtonModule,
    MatBadgeModule,
  ],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
})
export class EmployeeDashboardComponent {
  constructor(
    private router: Router,
    private dialogBox: MatDialog,
    private dataServiceForTask: DataServiceForTaskService
  ) {}

  currentView: string = 'reportTask'; // Default view
  employeeName: any = '';
  tasks: any[] = [];
  projects: any[] = [];
  employeeId: string = '';

  BadgeHiddenForNewTask: boolean = false;

  activeLink: string = '';

  ngOnInit() {
    this.employeeId = localStorage.getItem('userId') ?? '0';
    this.employeeName = localStorage.getItem('userName');
    this.fetchCurrentWorkingTask();

    // Initialize activeLink based on the current URL
    this.activeLink = this.router.url;

    // Subscribe to router events to detect navigation changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.urlAfterRedirects;
      }
    });
  }

  fetchCurrentWorkingTask() {
    if (this.employeeId) {
      this.dataServiceForTask
        .getTasksByEmployeeId(this.employeeId)
        .pipe(
          catchError((error) => {
            console.error('Error fetching Task ID:', error);
            return throwError(() => new Error(error.message));
          })
        )
        .subscribe({
          next: (taskData) => {
            this.tasks = [
              {
                taskId: taskData.taskId,
                taskName: taskData.taskName,
                createdTL: taskData.createdTL,
              },
            ];
            // Filter tasks with status 0
            this.tasks = this.tasks.filter((task) => task.taskStatus === 0);

            console.log('Fetched Task:', taskData);
          },
          error: (error) => {
            console.error('Error:', error);
          },
        });
    } else {
      console.error('No employee ID found in localStorage');
    }
  }

  showComponent(view: string) {
    this.currentView = view;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
  viewProfile() {
    this.dialogBox.open(ViewProfileComponent, {
      data: {
        completedTask: 0,
        pendingTask: 0,
        completedProj: 0,
        pendingProj: 0,
      },
      width: '60%',
      disableClose: true,
    });
  }
  viewPendingProject() {
    this.BadgeHiddenForNewTask = true;

    const dialogRef = this.dialogBox.open(ViewProjectTaskComponent, {
      data: { projects: this.projects, tasks: this.tasks },
      width: '60%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Task data received:', result);
      }
    });
  }
}
