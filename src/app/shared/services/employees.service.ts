import { Injectable } from '@angular/core';
import { EmployeeCreateRequest, Employee, EmployeeProfileUpdateRequest } from '../../models/user';
import { Observable, switchMap, tap, of, take, map, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';

/**
 * Service type that provides an interface for users stored in the database.
 */
@Injectable({
    providedIn: 'root'
})
export class EmployeesService {
    apiUrl = "";
    cache$ = new ReplaySubject<Map<string, Employee>>(1);

    constructor(private http: HttpClient, private feature: FeatureService) {
        this.apiUrl = this.feature.getFeatureValue("api").url;
        this.cache$.next(new Map);
    }

    createEmployee(newEmployee: EmployeeCreateRequest): Observable<EmployeeCreateRequest> {
        return this.http.post<EmployeeCreateRequest>(`${this.apiUrl}/manager/employee`, newEmployee);
    }

    getProfile(): Observable<Employee | undefined> {
        return this.cache$.pipe(
            take(1),
            switchMap(cache => {
                const userName = sessionStorage.getItem("userName") ?? "";
                if (cache.size > 1) {
                    return of(cache.get(userName));
                } else {
                    return this.http.get<Employee>(`${this.apiUrl}/employee/profile`, { observe: 'body' }).pipe(
                        tap(employee => this.updateCache([employee])),
                        switchMap(employee => this.cache$.pipe(
                            map(cache => cache.get(employee.userName))
                        ))
                    );
                }
            })
        );
    }

    updateProfile(updatedEmployee: EmployeeProfileUpdateRequest): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/employee/profile`, updatedEmployee).pipe(
            tap(_ => this.updateCache([updatedEmployee])),
            switchMap(_ => this.cache$.pipe(
                map(cache => cache.get(updatedEmployee.userName) as Employee)
            ))
        );
    }

    getEmployee(userName: string): Observable<Employee | undefined> {
        return this.cache$.pipe(
            take(1),
            switchMap(cache => {
                if (cache.size > 1){
                    return of(cache.get(userName));
                }
                else {
                    return this.http.get<Employee>(`${this.apiUrl}/manager/employee/${userName}`).pipe(
                        tap(employee => this.updateCache([employee])),
                        switchMap(_ => this.cache$.pipe(
                            map(cache => cache.get(userName))
                        ))
                    );
                }
            })
        )
    }

    getEmployees(): Observable<Employee[]> {
        return this.cache$.pipe(
            take(1),
            switchMap(cache => {
                if (cache.size > 1){
                    const employees = Array.from(cache.values());
                    return [employees];
                }
                else {
                    return this.http.get<Employee[]>(`${this.apiUrl}/manager/employee`).pipe(
                        tap(employees => this.updateCache(employees)),
                        switchMap(_ => this.cache$.pipe(
                            map(cache => Array.from(cache.values()))
                        ))
                    );
                }
            })
        );
    }
    
    updateEmployee(updatedEmployee: Employee): Observable<Employee> {
        // TODO: route needs implemented
        return this.http.put<Employee>(`${this.apiUrl}/manager/employee`, updatedEmployee);
    } 

    deleteEmployee(userName: string) {
        return this.http.delete<Employee>(`${this.apiUrl}/manager/employee/${userName}`);        
    }

    updateCache(employees: Partial<Employee>[]) {
        this.cache$.pipe(take(1)).subscribe(existingCache => {
            const newCache = new Map(existingCache);
            // Merge new employees into the cache
            employees.forEach(newEmployee => {
                const userName = newEmployee.userName as string;
                const employee = newCache.get(userName) ?? new Employee();
                Object.assign(employee, newEmployee);
                newCache.set(userName, employee);
            });
            this.cache$.next(newCache);
        });
    }
}
