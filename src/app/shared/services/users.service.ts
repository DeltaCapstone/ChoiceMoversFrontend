import { Injectable } from '@angular/core';
import { CreateEmployeeRequest, Employee, LoginRequest } from '../../models/user';
import { Observable, BehaviorSubject, pipe, switchMap, startWith, tap, of, take, map } from 'rxjs';
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
    cache: Map<string, Employee> = new Map();
    cache$: BehaviorSubject<Map<string, Employee>> = new BehaviorSubject(new Map());


    constructor(private http: HttpClient, private feature: FeatureService) {
        this.apiUrl = this.feature.getFeatureValue("api").url;
    }

    requestLogin(userName: string, passwordPlain: string) {
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
        const employee = this.cache.get(sessionStorage.getItem("userName") ?? "");
        if (employee) {
            return of(employee);
        }
        else {
            return this.http.get<Employee>(`${this.apiUrl}/employee/profile`, { observe: 'body' }).pipe(
                tap(employee => this.updateCache([employee])),
                switchMap(employee => this.cache$.pipe(
                    map(cache => cache.get(employee.userName) as Employee)
                )) 
            );
        }
    }

    updateProfile(updatedEmployee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/employee/profile`, updatedEmployee).pipe(
            tap(_ => this.updateCache([updatedEmployee])),
            switchMap(_ => this.cache$.pipe(
                map(cache => cache.get(updatedEmployee.userName) as Employee)
            ))
        );
    }

    getEmployee(userName: string): Observable<Employee> {
        const employee = this.cache.get(userName);
        if (employee) {
            return of(employee);
        } else {
            return this.http.get<Employee>(`${this.apiUrl}/manager/employee/${userName}`).pipe(
                tap(employee => this.updateCache([employee]))
            );
        }
    }

    getEmployees(): Observable<Employee[]> {
        if (this.cache.size > 1) {
            return of(Array.from(this.cache.values()));
        }
        else {
            console.log("http");
            return this.http.get<Employee[]>(`${this.apiUrl}/manager/employee`).pipe(
                tap(employees => this.updateCache(employees)),
                switchMap(_ => this.cache$.pipe(
                    map(cache => Object.values(cache))
                ))
            );
        }
    }
    
    updateEmployee(updatedEmployee: Employee): Observable<Employee> {
        // TODO: route needs implemented
        return this.http.put<Employee>(`${this.apiUrl}/manager/employee`, updatedEmployee);
    } 

    deleteEmployee(userName: string) {
        return this.http.delete<Employee>(`${this.apiUrl}/manager/employee/${userName}`);        
    }

    updateCache(employees: Employee[]): void {
        employees.forEach(employee => this.cache.set(employee.userName, employee))
        this.cache$.next(this.cache);
    }

}
