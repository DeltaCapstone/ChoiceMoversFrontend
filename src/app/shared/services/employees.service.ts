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

    // TODO: integrate with the multi-step creation process
    createEmployee(newEmployee: EmployeeCreateRequest): Observable<EmployeeCreateRequest> {
        this.cacheUpsert([newEmployee]);
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
                        tap(employee => this.cacheUpsert([employee])),
                        switchMap(employee => this.cache$.pipe(
                            map(cache => cache.get(employee.userName)),
                            take(1)
                        ))
                    );
                }
            })
        );
    }

    updateProfile(updatedEmployee: EmployeeProfileUpdateRequest): Observable<Employee> {
        this.cacheUpsert([updatedEmployee]);
        return this.http.put<Employee>(`${this.apiUrl}/employee/profile`, updatedEmployee).pipe(
            tap(_ => this.cacheUpsert([updatedEmployee])),
            switchMap(_ => this.cache$.pipe(
                map(cache => cache.get(updatedEmployee.userName) as Employee),
                take(1)
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
                        tap(employee => this.cacheUpsert([employee])),
                        switchMap(_ => this.cache$.pipe(
                            map(cache => cache.get(userName)),
                            take(1)
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
                        tap(employees => this.cacheUpsert(employees)),
                        switchMap(_ => this.cache$.pipe(
                            map(cache => Array.from(cache.values())),
                            take(1)
                        ))
                    );
                }
            })
        );
    }
    
    updateEmployee(updatedEmployee: Employee): Observable<Employee> {
        this.cacheUpsert([updatedEmployee]);
        return this.http.put<Employee>(`${this.apiUrl}/manager/employee`, updatedEmployee);
    } 

    deleteEmployee(userName: string) {
        this.cacheDelete([userName]);
        return this.http.delete<Employee>(`${this.apiUrl}/manager/employee/${userName}`);        
    }

    private cacheDelete(employeeIds: string[]){
        this.cache$.pipe(take(1)).subscribe(cache => {
            employeeIds.forEach(employeeId => cache.delete(employeeId));
            this.cache$.next(cache);
        });
    }

    private cacheUpsert(employees: Partial<Employee>[]) {
        this.cache$.pipe(take(1)).subscribe(cache => {
            // Merge new employees into the cache
            employees.forEach(newEmployee => {
                const userName = newEmployee.userName as string;
                const employee = cache.get(userName) ?? new Employee();
                Object.assign(employee, newEmployee);
                cache.set(userName, employee);
            });
            this.cache$.next(cache);
        });
    }
}
