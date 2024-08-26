import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentForDevelopement } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class DataServiceForManagerService {

  private apiForManager = `${environmentForDevelopement.apiUrl}/Manager`;

  constructor(private http: HttpClient) { }

  signUpForManager(userName: string, userPassword: string): Observable<any> {
    const managerObj = { managerName: userName, managerPassword: userPassword };
    return this.http.post<any>(`${this.apiForManager}/SignUp-Manager`, managerObj);
  }
  

}
