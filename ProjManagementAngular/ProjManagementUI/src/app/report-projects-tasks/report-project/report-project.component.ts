import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceForProjectService } from '../../services/data-service-for-project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { CanComponentDeactivate } from '../../guards/can-deactivate.guard';
import { CommonSnackbarComponent } from '../../common-mat-component/common-snackbar/common-snackbar.component';

@Component({
  selector: 'app-report-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  templateUrl: './report-project.component.html',
  styleUrls: ['./report-project.component.css'],
})
export class ReportProjectComponent implements OnInit {
  teamLeadId!: string | null;
  projects: {
    projectId: number;
    name: string;
    description: string;
    numberOfTasks: number;
    completedTasks: number;
    dueDate: string;
    assignedTeamLeader: string;
    createdManager: string;
  }[] = [];
  selectedProjectName: string = '';
  projectId: number = 0;

  isLoadingToRetriveData: boolean = true;
  isLoadingToSubmitForm: boolean = false;

  constructor(
    private router: Router,
    private dataServiceForProject: DataServiceForProjectService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //    this.teamLeadId=this.dataServiceForView.userID.toString();
    this.teamLeadId  = localStorage.getItem('userId')??'0'
    this.fetchProjects();
  }

  fetchProjects() {
    if (this.teamLeadId) {
      this.dataServiceForProject
        .getProjectsByTeamLeadId(this.teamLeadId, false, false)
        .pipe(
          catchError((error) => {
            console.error('Error fetching projects:', error);
            return throwError(() => new Error(error.message));
          })
        )
        .subscribe({
          next: (projects) => {
            this.projects = projects;
            this.isLoadingToRetriveData = false;
          },
          error: (error) => {
            console.error('Error:', error);
            this.isLoadingToRetriveData = false;
          },
        });
    }
  }

  onProjectChange(event: MatAutocompleteSelectedEvent) {
    const selectedName = event.option.value;
    const selectedProject = this.projects.find(
      (project) => project.name === selectedName
    );
    if (selectedProject) {
      this.projectId = selectedProject.projectId;
    } else {
      console.error('Selected project not found');
    }
  }

  async onSubmit() {
    this.isLoadingToSubmitForm = true;
    try {
      if (!this.projectId) {
        console.error('Project ID is not set');
        return;
      }

      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      const response = await this.dataServiceForProject
        .updateProjectCompletionStatus(this.projectId, token)
        .toPromise();
      console.log('Response Data:', response);

      this.openSnackBar(
        true,
        `Project ${this.selectedProjectName} Completion Send`
      );

      this.isLoadingToSubmitForm = false;
      await this.router.navigate(['team-leader-dashboard/view-projects']);
    } catch (error) {
      console.error('There was a problem with the HTTP request:', error);
    }
  }
  canDeactivate(): boolean {
    if (!this.projectId) {
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

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (!this.projectId) {
      $event.returnValue =
        'You have unsaved changes. Are you sure you want to leave?';
    }
  }
}
