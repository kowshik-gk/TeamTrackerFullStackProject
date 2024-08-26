import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataServiceForEmployeeService } from '../../services/data-service-for-employee.service';
import { DataServiceForManagerService } from '../../services/data-service-for-manager.service';
import { DataServiceForTeamleaderService } from '../../services/data-service-for-teamleader.service';
import { DataServiceForLoginService } from '../../services/data-service-for-login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonSnackbarComponent } from '../../common-mat-component/common-snackbar/common-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  userNameForLogin: string = '';
  userPasswordForLogin: string = '';
  userName: string = '';
  userPassword: string = '';
  confirmPassword: string = '';
  isLoadingSpinner: boolean = false;
  isSignUp: boolean = false; // Track whether in sign-up mode or not
  isEmployee: boolean = true; // Default role
  currentRole: string = 'Employee';
  validationErrors: { [key: string]: string | null } = {};

  loginForm: FormGroup;
  signUpForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataServiceForManager: DataServiceForManagerService,
    private dataServiceForLogin: DataServiceForLoginService,
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataServiceForTeamLeader: DataServiceForTeamleaderService,
    private dataServiceForEmployee: DataServiceForEmployeeService
  ) {
    this.loginForm = this._formBuilder.group({
      userNameForLogin: ['', Validators.required],
      passwordForLogin: ['', Validators.required],
    });

    this.signUpForm = this._formBuilder.group(
      {
        userName: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(15),
            Validators.pattern(/[\W_]/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  handleUserLogin() {
    this.loginForm.markAllAsTouched();
    this.userNameForLogin = this.loginForm.get('userNameForLogin')?.value;
    this.userPasswordForLogin = this.loginForm.get('passwordForLogin')?.value;

    this.validateField('userNameForLogin', this.userNameForLogin);
    this.validateField('passwordForLogin', this.userPasswordForLogin);
    if (this.loginForm.valid) {
      this.isLoadingSpinner = true;
      this.dataServiceForLogin
        .userLogin(this.userNameForLogin, this.userPasswordForLogin)
        .subscribe(
          (data: any) => {
            if (data) {
              if (data.token === 'NotFound') {
                this.snackBar.openFromComponent(CommonSnackbarComponent, {
                  data: {
                    isSuccess: false,
                    message: 'Invalid UserName Or Password',
                  },
                  verticalPosition: 'top',
                  horizontalPosition: 'end',
                  panelClass: ['error-snackbar'],
                  duration: 5000,
                });

                this.isLoadingSpinner = false;
              } else {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('userName', data.userName);
                localStorage.setItem('userId', data.userId);
                // this.dataServiceForView.userID = data.userId;
                this.dataServiceForLogin.userCredentialsSubject.next({
                  username: this.userNameForLogin,
                  password: this.userPasswordForLogin,
                });

                switch (data.role) {
                  case 'manager':
                    this.router.navigate([
                      '/manager-dashboard/manager-assigned-projects',
                    ]);
                    break;
                  case 'teamleader':
                    this.router.navigate([
                      '/team-leader-dashboard/teamLead-assigned-tasks',
                    ]);
                    break;
                  case 'employee':
                    this.router.navigate(['/employee-dashboard/report-task']);
                    break;
                  default:
                    console.error('Unknown role:', data.role);
                    this.router.navigate(['/view-projects']);
                }
              }
            }
          },
          (error) => {
            console.error('Error fetching data:', error);
            this.isLoadingSpinner = false;
          }
        );
    }
  }

  handleSignUp() {
    this.signUpForm.markAllAsTouched();

    this.userName = this.signUpForm.get('userName')?.value;
    this.userPassword = this.signUpForm.get('password')?.value;
    this.confirmPassword = this.signUpForm.get('confirmPassword')?.value;

    this.validateField('userName', this.userName);
    this.validateField('password', this.userPassword);
    this.validateField('confirmPassword', this.confirmPassword);

    this.isLoadingSpinner = true;
    let signUpObservable: Observable<any>;

    if (this.currentRole === 'Employee') {
      signUpObservable = this.dataServiceForEmployee.signUpForEmployee(
        this.userName,
        this.userPassword
      );
    } else if (this.currentRole === 'Teamleader') {
      signUpObservable = this.dataServiceForTeamLeader.signUpForTeamLead(
        this.userName,
        this.userPassword
      );
    } else if (this.currentRole === 'Manager') {
      signUpObservable = this.dataServiceForManager.signUpForManager(
        this.userName,
        this.userPassword
      );
    } else {
      console.error('Invalid role for sign-up');
      this.isLoadingSpinner = false;
      return;
    }
    //this.isLoadingSpinner = false;
    signUpObservable.subscribe(
      (response) => {
        if (response.warning) {
          this.openSnackBar(true, response.resultData);
          this.router.navigate(['/login'], { replaceUrl: true });
          this.isLoadingSpinner = false;
        } else {
          this.openSnackBar(false, response.resultData);
          this.isLoadingSpinner = false;
        }
        this.isLoadingSpinner = false;
      },
      (error) => {
        this.openSnackBar(false, 'An error occurred. Please try again.');

        this.isLoadingSpinner = false;
      }
    );
  }

  toggleSignUpLogin() {
    this.isSignUp = !this.isSignUp;
  }

  setRole(role: string) {
    this.currentRole = role;
    this.isEmployee = role === 'Employee';
  }

  clearHistory() {
    window.history.replaceState({}, document.title, '/login');
  }

  validateField(field: string, value: any) {
    switch (field) {
      case 'userNameForLogin':
        this.validationErrors['userNameForLogin'] =
          this.validateUserName(value);
        break;
      case 'passwordForLogin':
        this.validationErrors['passwordForLogin'] =
          this.validatePassword(value);
        break;
      case 'userName':
        this.validationErrors['userName'] = this.validateUserName(value);
        break;
      case 'password':
        this.validationErrors['password'] = this.validatePassword(value);
        break;
      case 'confirmPassword':
        this.validationErrors['confirmPassword'] = this.validatePassword(value);
        break;
    }
  }

  validateUserName(value: string): string | null {
    if (!value) {
      return 'Username is required';
    }
    // if (value.length < 15) {
    //   return 'UserName must be at least 15 characters long';
    // }
    // if (!/^[a-zA-Z0-9]*$/.test(value)) {
    //   return 'Username must only contain letters and numbers';
    // }
    return null;
  }

  validatePassword(value: string): string | null {
    if (!value) {
      return 'Password is required';
    }
    // if (value.length < 15) {
    //   return 'Password must be at least 15 characters long';
    // }
    // if (!/[A-Z]/.test(value)) {
    //   return 'Password must contain at least one uppercase letter';
    // }
    // if (!/[a-z]/.test(value)) {
    //   return 'Password must contain at least one lowercase letter';
    // }
    // if (!/[0-9]/.test(value)) {
    //   return 'Password must contain at least one digit';
    // }
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    //   return 'Password must contain at least one special character';
    // }
    return null;
  }

  showError(message: string) {
    this.openSnackBar(false, message);
  }

  openSnackBar(isSuccess: boolean, message: string) {
    const snackbarClass = isSuccess ? 'success-snackbar' : 'warning-snackbar';

    this.snackBar.openFromComponent(CommonSnackbarComponent, {
      data: { isSuccess, message },
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: [snackbarClass],
      duration: 5000,
    });
  }
}
