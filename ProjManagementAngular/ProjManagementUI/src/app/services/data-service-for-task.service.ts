import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentForDevelopement } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DataServiceForTaskService {
  private apiForTask = `${environmentForDevelopement.apiUrl}/Task`;

  constructor(private http: HttpClient) { }

  updateTaskCompletionStatus(taskId: number, token: string): Observable<string> {
    return this.http.put<string>(`${this.apiForTask}/Task-Completion`, { taskId }, { responseType: 'text' as 'json' });
  }

  
  postTask(task: any, token: any): Observable<string> {
    return this.http.post<string>(`${this.apiForTask}/Post-Task`, task, { responseType: 'text' as 'json' });
  }

  getTasksByTeamLeaderId(tlId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiForTask}/GetTasksAssignedByTL/${tlId}`
    );
  }

  getTasksByEmployeeId(employeeId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiForTask}/GetTasksAssignedForEmployee/${employeeId}`
    );
  }
}
