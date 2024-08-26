import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceForProjectService } from '../../services/data-service-for-project.service';
import { CommonModule } from '@angular/common';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-manager-projects',
  templateUrl: './manager-projects.component.html',
  styleUrls: ['./manager-projects.component.css'],
  standalone: true,
  imports: [CommonModule,MatProgressSpinnerModule,MatPaginatorModule]
})
export class ManagerProjectsComponent implements OnInit {
  projects: any[] = [];
  pendingProjects: any[] = [];
  completedProjects: any[] = [];

  isLoading: boolean=true;

  constructor(private dataServiceForProject: DataServiceForProjectService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  private fetchProjects() {
   // const userId= this.dataServiceForProject.userID??0;
   const userId=localStorage.getItem('userId')??'0';
      if (userId) {
        this.dataServiceForProject.getProjectsAssignedByManager(userId).subscribe(
          data => {
            // Map data and calculate status
            this.projects = data.map(project => ({
              ...project,
              status: this.calculateProjectStatus(project)
            }));

            // Filter projects into pending and completed
            this.pendingProjects = this.projects.filter(project => project.status === 'Not Completed');
            this.completedProjects = this.projects.filter(project => project.status === 'Completed');
            this.isLoading=false;
          },
          error => {
            console.error('Error fetching projects', error);
          }
        );
      } else {
        console.error('Invalid userId format');
      }
    }

  private calculateProjectStatus(project: any): string {
    return project.numberOfTasks === project.completedTasks ? 'Completed' : 'Not Completed';
  }
}
