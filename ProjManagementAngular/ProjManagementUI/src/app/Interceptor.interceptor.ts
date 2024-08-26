import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonSnackbarComponent } from './common-mat-component/common-snackbar/common-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private snackBar: MatSnackBar) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let message: string;

        if (error.status === 401) {
          message = 'Your session has expired. Please log in again.';
          localStorage.clear();
          this.router.navigate(['/login']);
        } else if (error.status === 400) {
          // // Handle specific error messages from your backend
          // message = error.error === 'UserName Exits Try Another UserName'
          //   ? 'Username already exists. Please try a different one.'
             'Bad Request. Please check your input and try again.';
        } else if (error.status === 500) {
          message = 'An error occurred on the server. Please try again later.';
        } else {
          message = 'An unexpected error occurred. Please try again later.';
        }
        return throwError(() => error);
      })
    );
  }

  private openSnackBar(message: string) {
    this.snackBar.openFromComponent(CommonSnackbarComponent, {
      data: { isSuccess: false, message },
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: ['error-snackbar'],
      duration: 5000
    });
  }
}
