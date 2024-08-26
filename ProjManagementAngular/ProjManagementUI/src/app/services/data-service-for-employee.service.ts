import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentForDevelopement } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class DataServiceForEmployeeService {

  private apiForEmployee = `${environmentForDevelopement.apiUrl}/Employee`;

  constructor(private http: HttpClient) { }


  signUpForEmployee(userName: string, userPassword: string): Observable<any> {
    const employeeObj = { employeeName: userName, employeePassword: userPassword };
    return this.http.post<any>(`${this.apiForEmployee}/SignUp-Employee`, employeeObj);
  }
  getWorkingEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiForEmployee}/Working-Employee`);
  }

  getNonWorkingEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiForEmployee}/Non-Working-Employee`);
  }
  getEmployeeByUserName(empName: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiForEmployee}/GetEmployeeByUserName/${empName}`
    );
  }
}
