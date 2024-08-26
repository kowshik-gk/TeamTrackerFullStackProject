import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  userRole: string = localStorage.getItem('role') ?? '';

  goToLogIn() {
    debugger;
    if (this.userRole === 'employee') this.router.navigate(['/employee-dashboard']);
    else if (this.userRole === 'teamleader') this.router.navigate(['/team-leader-dashboard']);
    else if (this.userRole === 'manager') this.router.navigate(['/manager-dashboard']);
    else this.router.navigate(['/login']);
  }
}
