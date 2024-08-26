import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterModule,
  NavigationEnd,
} from '@angular/router';
import { PostTaskComponent } from '../../post-projects-tasks/post-task/post-task.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportProjectComponent } from '../../report-projects-tasks/report-project/report-project.component';
import { HttpClient } from '@angular/common/http';
import { DataServiceForProjectService } from '../../services/data-service-for-project.service';
import { DataServiceForTaskService } from '../../services/data-service-for-task.service';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { ViewProjectTaskComponent } from '../../common-mat-component/view-project-task/view-project-task.component';
import { ViewProfileComponent } from '../../common-mat-component/view-commom-profile/view-profile.component';

@Component({
  standalone: true,
  selector: 'app-team-leader-dashboard',
  templateUrl: './team-leader-dashboard.component.html',
  imports: [
    PostTaskComponent,
    CommonModule,
    FormsModule,
    ReportProjectComponent,
    RouterOutlet,
    RouterModule,
    MatBadgeModule,
    MatButtonModule,
  ],
  styleUrls: ['./team-leader-dashboard.component.css'],
})
export class TeamLeaderDashboardComponent implements OnInit {
  teamLeadName: string = '';
  currentView: string = 'postTask';
  pendingTasksCount: number = 0;
  completedTaskCount: number = 0;
  projects: any[] = [];
  taskToCallViewPendingProj: any[] = [];
  isSidebarCollapsed = false;
  activeLink: string = '';
  teamLeadId: string = '0';
  BadgeHiddenForViewComp: boolean = false;
  BadgeHiddenForNewProject: boolean = false;
  BadgeHiddenForTaskAssigen:boolean=false;
  tasks: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataServiceForProject: DataServiceForProjectService,
    private dialogBox: MatDialog,
    private dataServiceForTask: DataServiceForTaskService
  ) {}

  ngOnInit(): void {
    this.initializeRouter();
    this.fetchTeamLeaderData();
    this.fetchTasksAndProjects();
  }

  private initializeRouter(): void {
    this.activeLink = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.urlAfterRedirects;
      }
    });
  }

  private fetchTeamLeaderData(): void {
    this.teamLeadId = localStorage.getItem('userId') ?? '0';
    this.teamLeadName = localStorage.getItem('userName') || 'Default User'; // Retrieve username from local storage
  }

  private fetchTasksAndProjects(): void {
    this.dataServiceForTask
      .getTasksByTeamLeaderId(this.teamLeadId)
      .toPromise()
      .then(tasks => {
        if (tasks) {
          this.tasks = tasks;
          this.pendingTasksCount = this.tasks.filter(task => task.taskStatus === 0).length;
          this.completedTaskCount = tasks.length - this.pendingTasksCount;
        }
      })
      .catch(error => console.error('Error fetching tasks:', error));

    if (this.teamLeadId) {
      this.dataServiceForProject
        .getProjectsByTeamLeadId(this.teamLeadId, false, true)
        .subscribe({
          next: (projects) => {
            this.projects = [...projects]
              .reverse()
              .filter((t) => t.completedTasks < t.numberOfTasks);
          },
          error: (error) => {
            console.error('Error fetching projects:', error);
          },
        });
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  showComponent(view: string): void {
    this.currentView = view;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }


  toggleBadgeVisibilityForView(): void {
       
  this.BadgeHiddenForViewComp = true;
  this.BadgeHiddenForNewProject  = false;
  this.BadgeHiddenForTaskAssigen=false;
  }

  viewProfile(): void {
    this.dialogBox.open(ViewProfileComponent, {
      data: {
        completedTask: this.completedTaskCount,
        pendingTask: this.pendingTasksCount,
        completedProj: 0,
        pendingProj: 0,
      },
      width: '60%',
      disableClose: true,
    });
  }

  viewPendingProject(): void {

    
  this.BadgeHiddenForViewComp = false;
  this.BadgeHiddenForNewProject  = true;
  this.BadgeHiddenForTaskAssigen=false;

    const dialogRef = this.dialogBox.open(ViewProjectTaskComponent, {
      data: { projects: this.projects, tasks: this.taskToCallViewPendingProj },

      disableClose: true,
      width: '50%',
      height: '50vh', // Set height to half of the viewport height
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Task data received:', result);
      }
    });
  }
  taskAssignedClicked():void{
        
  this.BadgeHiddenForViewComp = false;
  this.BadgeHiddenForNewProject  = false;
  this.BadgeHiddenForTaskAssigen=true;
  }
}
