import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environmentForDevelopement } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DataServiceForLoginService {
  private apiUrl = `${environmentForDevelopement.apiUrl}/JWTToken/Login`;

  public userCredentialsSubject = new BehaviorSubject<{ username: string, password: string } | null>(null);
  userCredentials$ = this.userCredentialsSubject.asObservable();

  constructor(private http: HttpClient) { }

  userLogin(userName: string, userPassword: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      username: userName,
      password: userPassword
    });
  }
}
