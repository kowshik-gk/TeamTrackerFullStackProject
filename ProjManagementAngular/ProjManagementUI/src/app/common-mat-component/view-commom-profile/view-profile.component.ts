import { Component, OnInit } from '@angular/core';
import { DataServiceForLoginService } from '../../services/data-service-for-login.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  userRole: string = '';
  userName: string = '';

  completedTask: number = 0;
  pendingTask: number = 0;

  completedProj: number = 0;
  pendingProj: number = 0;

  showPassword: boolean = false;

  private subscriptions = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { completedTask: number; pendingTask: number; completedProj: number; pendingProj: number },
    private dataService: DataServiceForLoginService, private dialogRef: MatDialogRef<ViewProfileComponent>
  ) {
    this.completedTask = data.completedTask;
    this.pendingTask = data.pendingTask;
    this.completedProj = data.completedProj;
    this.pendingProj = data.pendingProj;
  }

  ngOnInit() {

    this.subscriptions.add(
      this.dataService.userCredentials$.subscribe(credentials => {
      
          this.userName = credentials?.username ?? localStorage.getItem('userName') ??'NotFound';
          this.userRole = localStorage.getItem('role') ?? 'Not Found';
        
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();  // Clean up subscriptions
  }

  onClose(): void {
    this.dialogRef.close();  // Close the dialog
  }

}
