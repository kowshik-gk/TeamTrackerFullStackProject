import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-project-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-project-task.component.html',
  styleUrls: ['./view-project-task.component.css']
})
export class ViewProjectTaskComponent {
  reversedProjects: any[] = []; 
  tasks: any[] = [];
  userRole: string = localStorage.getItem('role') ?? 'not found';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { projects: any[]; tasks: any[] },private dialogRef: MatDialogRef<ViewProjectTaskComponent>) {

    this.reversedProjects = this.data.projects.map(project => {
      return {
        ...project,
        assignedTeamLeader: localStorage.getItem('userName') ?? 'not found'
      };
    });

    if (this.userRole === 'employee') {
      this.tasks = this.data.tasks.map(task => ({
        taskId: task.taskId,
        taskName: task.taskName,
        createdTL: task.createdTL
      }));
    }
  }
  onClose(): void {
    this.dialogRef.close();  // Close the dialog
  }
}