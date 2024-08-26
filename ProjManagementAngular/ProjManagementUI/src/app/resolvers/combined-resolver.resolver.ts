import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { DataServiceForEmployeeService } from '../services/data-service-for-employee.service';
import { DataServiceForTeamleaderService } from '../services/data-service-for-teamleader.service';
import { DataServiceForProjectService } from '../services/data-service-for-project.service';

@Injectable({
  providedIn: 'root',
})
export class CombinedResolver implements Resolve<any> {
  constructor(
    private dataServiceForProject: DataServiceForProjectService,
    private dataServiceForTeamLead: DataServiceForTeamleaderService,
    private dataServiceForEmployee: DataServiceForEmployeeService
  ) {}

  resolve(): Observable<any> {
    return forkJoin({
      completedProjects: this.dataServiceForProject.getCompletedProjects(),
      currentProjects: this.dataServiceForProject.getCurrentProjects(),
      workingEmployees: this.dataServiceForEmployee.getWorkingEmployees(),
      nonWorkingEmployees: this.dataServiceForEmployee.getNonWorkingEmployees(),
      workingTeamLeaders: this.dataServiceForTeamLead.getWorkingTeamLeaders(),
      nonWorkingTeamLeaders:
        this.dataServiceForTeamLead.getNonWorkingTeamLeaders(),
    });
  }
}
