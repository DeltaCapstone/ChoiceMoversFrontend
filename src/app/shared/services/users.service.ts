import { Injectable } from '@angular/core';
import { CreateEmployeeRequest, Employee } from '../../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';

/**
 * Service type that provides an interface for users stored in the database.
 */
@Injectable({
  providedIn: 'root'
})
export class UsersService {
    apiUrl: string = "";
    
    constructor(private http: HttpClient, private feature: FeatureService) {
        this.apiUrl = this.feature.getFeatureValue("api").url;
    }

    createEmployee(newEmployee: CreateEmployeeRequest): Observable<CreateEmployeeRequest> {
        return this.http.post<CreateEmployeeRequest>(`${this.apiUrl}/manager/employee`, newEmployee);        
    }

    getEmployee(userName: string): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/employee/${userName}`, { observe: 'body' });
    }
    
    getEmployees(): Observable<Array<Employee>> {
        return this.http.get<Array<Employee>>(`${this.apiUrl}/manager/employee`, { observe: 'body' });
    }
    
    updateEmployee(updatedEmployee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/employee/`, updatedEmployee);
    }

    deleteEmployee(userName: string) {
        return this.http.delete<Employee>(`${this.apiUrl}/manager/employee/${userName}`);        
    }
}
