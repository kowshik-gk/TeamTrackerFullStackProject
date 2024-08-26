import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataServiceForProjectService } from '../../services/data-service-for-project.service';
import { ViewProfileComponent } from '../../common-mat-component/view-commom-profile/view-profile.component';
import { RouterOutlet, RouterModule } from '@angular/router';
import { PostProjectComponent } from '../../post-projects-tasks/post-project/post-project.component';
import { ManagerProjectsComponent } from '../../manager-tl-viewcomps/manager-projects/manager-projects.component';
import { ViewProjectsComponent } from '../../manager-tl-viewcomps/view-projects/view-projects.component';


@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
  standalone: true,
  imports: [PostProjectComponent,ViewProjectsComponent,PostProjectComponent,ManagerProjectsComponent, CommonModule, MatTabsModule, FormsModule, RouterOutlet, RouterModule, MatBadgeModule]
})
export class ManagerDashboardComponent {
  projects: any[] = [];
  managerName: string = '';
  pendingProjectCount: number = 0;
  completedProject: number = 0;
  activeLink:string='';

  hidden = false;
  hidden2 = false;

  constructor(
    private router: Router,
    private dataServiceForProject: DataServiceForProjectService,
    private dialogBox: MatDialog
  ) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  toggleBadgeVisibility() {
    this.hidden = true;
  }

  toggleBadgeVisibilityForView() {
    this.hidden2 = true;
  }

  ngOnInit(): void {
    this.managerName = localStorage.getItem('userName') || 'Default User'; 
    this.dataServiceForProject.getProjectsAssignedByManager(localStorage.getItem('userId')??'0').subscribe(data => {
      this.projects = data.map(project => ({
        ...project,
        status: this.calculateProjectStatus(project)
      }));
      this.pendingProjectCount = this.projects.filter(project => project.status === 'Not Completed').length;
      this.completedProject = this.projects.length - this.pendingProjectCount;
    });

    this.activeLink = this.router.url;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.urlAfterRedirects;
      }
    });

  }

  private calculateProjectStatus(project: any): string {
    return project.numberOfTasks === project.completedTasks ? 'Completed' : 'Not Completed';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  viewProfile() {
    this.dialogBox.open(ViewProfileComponent, {
      data: { completedTask: 0, pendingTask: 0, completedProj: this.completedProject, pendingProj: this.pendingProjectCount },
      width: '60%',
      disableClose: true
    });
  }
}
