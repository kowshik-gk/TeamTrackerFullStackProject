import { Routes } from '@angular/router';
import { LoginComponent } from './login-dashboard/login/login.component';
import { ManagerDashboardComponent } from './dashboard/manager-dashboard/manager-dashboard.component';
import { TeamLeaderDashboardComponent } from './dashboard/team-leader-dashboard/team-leader-dashboard.component';
import { EmployeeDashboardComponent } from './dashboard/employee-dashboard/employee-dashboard.component';
import { ViewProjectsComponent } from './manager-tl-viewcomps/view-projects/view-projects.component';
import { PostProjectComponent } from './post-projects-tasks/post-project/post-project.component';
import { PostTaskComponent } from './post-projects-tasks/post-task/post-task.component';
import { ReportTaskComponent } from './report-projects-tasks/report-task/report-task.component';
import { ReportProjectComponent } from './report-projects-tasks/report-project/report-project.component';
import { RoleGuard } from './guards/role.guard';
import { ManagerProjectsComponent } from './manager-tl-viewcomps/manager-projects/manager-projects.component';
import { TeamleadTasksComponent } from './manager-tl-viewcomps/teamlead-tasks/teamlead-tasks.component';
import { CombinedResolver } from './resolvers/combined-resolver.resolver';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { NotFoundComponent } from './not-found/not-found/not-found.component';
import { EmployeeDetailsComponent } from './manager-tl-viewcomps/employee-details/employee-details.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path:'Form',component:EmployeeDetailsComponent},
  {
    path: 'employee-details/:employeeName',
    component: EmployeeDetailsComponent
  },
  {
    path: 'manager-dashboard',
    component: ManagerDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'manager' },
    children: [
      { path: 'post-project', component: PostProjectComponent, canDeactivate: [CanDeactivateGuard] },
      {
        path: 'view-projects',
        component: ViewProjectsComponent,
        resolve: { data: CombinedResolver },
        canDeactivate: [CanDeactivateGuard]
      },
      { path: 'manager-assigned-projects', component: ManagerProjectsComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  },
  {
    path: 'team-leader-dashboard',
    component: TeamLeaderDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'teamleader' },
    children: [
      { path: 'post-task', component: PostTaskComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'report-project', component: ReportProjectComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'teamLead-assigned-tasks', component: TeamleadTasksComponent },
      {
        path: 'view-projects',
        component: ViewProjectsComponent,
        resolve: { data: CombinedResolver }
      }
    ]
  },
  {
    path: 'employee-dashboard',
    component: EmployeeDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'employee' },
    children: [
      { path: 'report-task', component: ReportTaskComponent, canDeactivate: [CanDeactivateGuard] },
      {
        path: 'view-projects',
        component: ViewProjectsComponent,
        resolve: { data: CombinedResolver }
      }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];
