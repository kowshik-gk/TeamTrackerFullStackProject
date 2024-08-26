import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonSnackbarComponent } from '../common-mat-component/common-snackbar/common-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router,private snackBar:MatSnackBar) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role'); // Extract the role from local storage
    const requiredRole = route.data['role'] as string; // Use bracket notation to access role

    if (token) {
      if (role === requiredRole) {
        return true;
      } else {
        localStorage.clear();
        this.openSnackBar("You are not authorized to access this page.");
        this.router.navigate(['/login']); // Redirect to the correct dashboard based on the role
        return false;
      }
    } else {
      this.openSnackBar("You need to be logged in to access this page.");
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  }

  private openSnackBar(message: string) {
    let isSuccess: boolean | null = null; // Explicitly define the type to include null
    this.snackBar.openFromComponent(CommonSnackbarComponent, {
      data: { isSuccess, message },
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: ['error-snackbar'], 
      duration:5000
    });
  }

}
