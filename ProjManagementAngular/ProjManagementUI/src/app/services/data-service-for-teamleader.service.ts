import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentForDevelopement } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class DataServiceForTeamleaderService {

  private apiForTL = `${environmentForDevelopement.apiUrl}/TeamLeader`;

  constructor(private http: HttpClient) { }

  signUpForTeamLead(userName: string, userPassword: string): Observable<any> {
    const managerObj = { teamLeaderName: userName, teamLeaderPassword: userPassword };
    return this.http.post<any>(`${this.apiForTL}/SignUp-TL`, managerObj);
  }

  getWorkingTeamLeaders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiForTL}/Working-TL`);
  }

  getNonWorkingTeamLeaders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiForTL}/Non-Working-TL`);
  }
}
