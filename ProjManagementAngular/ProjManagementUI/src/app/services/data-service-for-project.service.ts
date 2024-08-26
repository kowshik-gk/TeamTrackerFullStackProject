import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { environmentForDevelopement } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DataServiceForProjectService {
  private apiForProject = `${environmentForDevelopement.apiUrl}/Project`;

  constructor(private http: HttpClient) { }

  isFormFilled(form: FormGroup): boolean {
    return form.valid && form.dirty;
  }

  postProject(project: any, token: string): Observable<string> {
    return this.http.post<string>(`${this.apiForProject}/Post-Project`, project, { responseType: 'text' as 'json' });
  }
  updateProjectCompletionStatus(projectId: number, token: string): Observable<string> {
    return this.http.put<string>(`${this.apiForProject}/Project-Completion`, { projectId }, { responseType: 'text' as 'json' });
  }
  getCompletedProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiForProject}/Get-Completed-Projects`);
  }

  getCurrentProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiForProject}/Get-InCompleted-Projects`);
  }
  getProjectsAssignedByManager(userId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiForProject}/GetProjectsAssignedByManager/${userId}`
    );
  }
  getProjectsByTeamLeadId(
    tlId: string,
    state: boolean,
    isView: boolean
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiForProject}/GetProjectsAssignedForTeamLead/${tlId}?PostState=${state}&IsView=${isView}`
    );

   // https://localhost:7031/api/Project/GetProjectsAssignedForTeamLead/d2abe50f-9a49-4560-b845-26edf1b60f08?PostState=false&IsView=true
  }
}
