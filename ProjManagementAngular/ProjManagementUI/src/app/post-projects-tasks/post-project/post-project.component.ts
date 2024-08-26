import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DataServiceForProjectService } from '../../services/data-service-for-project.service';
import { DataServiceForTeamleaderService } from '../../services/data-service-for-teamleader.service';
import { CommonSnackbarComponent } from '../../common-mat-component/common-snackbar/common-snackbar.component';

@Component({
  selector: 'app-post-project',
  templateUrl: './post-project.component.html',
  styleUrls: ['./post-project.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
})
export class PostProjectComponent implements OnInit {
  managerForm: FormGroup;
  name: string = '';
  description: string = '';
  nooftask: string = '';
  completedTask: string = '';
  assigningTeamLeaderId: string = '';
  createdManagerId: string = ''; // Initialize later
  TlId: number = 0;
  TeamLeadName: string = '';
  nonworkingtl: any[] = [];

  isLoadingForRetriveData: boolean = true;
  isLoadingToSubmitForm: boolean = false;

  constructor(
    private dataServiceForProject: DataServiceForProjectService,
    private dataServiceForTeamLead: DataServiceForTeamleaderService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.managerForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      descriptions: this.fb.array([]),
      nooftask: ['', Validators.required],
      completedTask: ['', Validators.required],
      dueDate: ['', Validators.required],
      assigningTeamLeaderId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchNonWorkingTL(); // Fetch non-working team leaders on component initialization
    this.createdManagerId = localStorage.getItem('userId') ?? '0';
    this.isLoadingForRetriveData = false;
  }

  get descriptions(): FormArray {
    return this.managerForm.get('descriptions') as FormArray;
  }

  addDescription(): void {
    this.descriptions.push(this.fb.control(''));
  }

  removeDescription(index: number): void {
    this.descriptions.removeAt(index);
  }

  async onSubmit() {
    this.isLoadingToSubmitForm = true;
    if (this.managerForm.valid) {
      console.log(this.managerForm.value);
      const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      // Extract form values
      const formValue = this.managerForm.value;
      // Use the form values to construct the request body
      const body = {
        name: formValue.name,
        description: formValue.description,
        numberOfTasks: formValue.nooftask,
        completedTasks: formValue.completedTask,
        assigningTeamLeaderId: this.getTeamLeadIdFromName(this.TeamLeadName),
        dueDate: formValue.dueDate,
        createdManager: this.createdManagerId,
      };

      console.log('Body of post-proj', body);
      this.dataServiceForProject.postProject(body, token).subscribe({
        next: (responseText) => {
          this.openSnackBar(
            true,
            `Project ${body.name} For ${this.TeamLeadName} Added`
          );
          this.router.navigate(['manager-dashboard/view-projects']);
          this.isLoadingToSubmitForm = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('There was a problem with the HTTP request:', error);
          this.isLoadingToSubmitForm = false;
        },
      });
    } else {
      alert('Invalid Form Values');
      this.isLoadingToSubmitForm = false;
    }
  }

  private fetchNonWorkingTL() {
    this.dataServiceForTeamLead.getNonWorkingTeamLeaders().subscribe(
      (data) => {
        console.log(data);
        this.nonworkingtl = data; // Assign the fetched data to the non-working team leaders array
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching non-working team leaders:', error);
      }
    );
  }

  private getTeamLeadIdFromName(name: string): number {
    const teamLead = this.nonworkingtl.find((tl) => tl.tlName === name);
    return teamLead ? teamLead.teamLeadId : 0; // Return the ID or 0 if not found
  }

  onTeamLeadChange(event: MatAutocompleteSelectedEvent) {
    this.TeamLeadName = event.option.value;
    const selectedTeamLeader = this.nonworkingtl.find(
      (tl) => tl.tlName === this.TeamLeadName
    );

    if (selectedTeamLeader) {
      this.managerForm.patchValue({
        assigningTeamLeaderId: selectedTeamLeader.teamLeadId,
      });
    }
  }

  canDeactivate(): boolean | Promise<boolean> {
    console.log('canDeactivate called');
    if (this.managerForm.invalid) {
      this.openSnackBar(false, 'Invalid Form , Pls Fill Form to navigate');
      return Promise.resolve(false); // Return a promise with the boolean value
    } else {
      return Promise.resolve(true); // Return a promise with the boolean value
    }
  }

  private openSnackBar(isSuccess: boolean, message: string) {
    const snackbarClass = isSuccess ? 'success-snackbar' : 'warning-snackbar';

    this.snackBar.openFromComponent(CommonSnackbarComponent, {
      data: { isSuccess, message },
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: [snackbarClass], // Apply the correct class based on the success state
      duration: 5000,
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.managerForm.dirty || this.managerForm.invalid) {
      $event.returnValue =
        'You have unsaved changes. Are you sure you want to leave?';
    }
  }
}
