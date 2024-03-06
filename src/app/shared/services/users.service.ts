import { Injectable } from '@angular/core';
import { CreateEmployeeRequest, Employee, LoginRequest } from '../../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';
import { SessionService } from './session.service';

/**
 * Service type that provides an interface for users stored in the database.
 */
@Injectable({
  providedIn: 'root'
})
export class UsersService {
    apiUrl: string = "";
    
    constructor(private http: HttpClient, private feature: FeatureService,) {
        this.apiUrl = this.feature.getFeatureValue("api").url;
    }

    requestLogin(userName: string, passwordPlain: string){
        const loginRequest: LoginRequest = {
            userName: userName,
            passwordPlain: passwordPlain
        };
        return this.http.post<LoginRequest>(`${this.apiUrl}/portal/login`, loginRequest);
    }

    createEmployee(newEmployee: CreateEmployeeRequest): Observable<CreateEmployeeRequest> {
        return this.http.post<CreateEmployeeRequest>(`${this.apiUrl}/manager/employee`, newEmployee);
    }

    getProfile(): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/employee/profile`, { observe: 'body' });
    }

    updateProfile(updatedEmployee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/employee/profile`, updatedEmployee);
    }
    
    getEmployee(userName: string): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/manager/employee/${userName}`, { observe: 'body' });
    }
    
    getEmployees(): Observable<Array<Employee>> {
        return this.http.get<Array<Employee>>(`${this.apiUrl}/manager/employee`, { observe: 'body' });
    }
    
    updateEmployee(updatedEmployee: Employee): Observable<Employee> {
        // TODO: route needs implemented
        return this.http.put<Employee>(`${this.apiUrl}/manager/employee`, updatedEmployee);
    }

    deleteEmployee(userName: string) {
        return this.http.delete<Employee>(`${this.apiUrl}/manager/employee/${userName}`);        
    }
}
