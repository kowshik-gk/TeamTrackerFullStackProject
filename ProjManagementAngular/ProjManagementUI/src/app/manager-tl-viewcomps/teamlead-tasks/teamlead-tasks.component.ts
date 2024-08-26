import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataServiceForTaskService } from '../../services/data-service-for-task.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-teamlead-tasks',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './teamlead-tasks.component.html',
  styleUrls: ['./teamlead-tasks.component.css'],
})
export class TeamleadTasksComponent implements OnInit {
  tasks: any[] = [];
  pendingTasks: any[] = [];
  completedTasks: any[] = [];

  isLoading: boolean = true;

  constructor(
    private dataServiceForTask: DataServiceForTaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchTasks();
    this.isLoading = false;
  }

  async fetchTasks() {
    //const userId= this.dataServiceForView.userID??0;

    const userId = localStorage.getItem('userId') ?? '0';
    if (userId) {
      try {
        const tasks = await this.dataServiceForTask
          .getTasksByTeamLeaderId(userId)
          .toPromise();

        if (tasks) {
          this.tasks = tasks;
          this.pendingTasks = this.tasks.filter(
            (task) => task.taskStatus === 0
          );
          this.completedTasks = this.tasks.filter(
            (task) => task.taskStatus === 1
          );
        } else {
          console.error('Tasks data is undefined');
        }
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    } else {
      console.error('Invalid userId format');
    }
  }
}
