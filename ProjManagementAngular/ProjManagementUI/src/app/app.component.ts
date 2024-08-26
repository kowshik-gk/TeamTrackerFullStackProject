import { Component, OnInit } from '@angular/core';
import { Router,RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], //template: `<router-outlet></router-outlet>`,
  styleUrl: './app.component.css',templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  title="Heelloe";
  constructor(private router: Router) {}

  ngOnInit() {
    // Redirect to login page initially
   // this.router.navigate(['/login']);
  }
}