import { Injectable } from '@angular/core';
import { Employee } from '../../models/user';
import { EmployeesService } from './employees.service';
import { Observable, ReplaySubject, catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
    user$: Observable<Employee | undefined> = of(undefined);
    
    constructor(private employeesService: EmployeesService) {
        // check if there is a stored token
        const token = sessionStorage.getItem("accessToken");
        const userName = sessionStorage.getItem("userName");
        
        // TODO: need to check for expiration
        if (token && userName) {
            this.user$ = this.employeesService.getProfile();
        }
    }
    
    login(userName: string, passwordPlain: string): Observable<boolean> {
        return this.employeesService.requestLogin(userName, passwordPlain).pipe(
            switchMap((res: any) => {
                const accessToken = res["accessToken"];
                if (accessToken) {
                    sessionStorage.setItem("accessToken", accessToken);
                    sessionStorage.setItem("userName", userName);
                    // If refreshToken is needed, uncomment the next line
                    // localStorage.setItem("refreshToken", res["refreshToken"]); 
                    return this.employeesService.getProfile().pipe(
                        tap(profile => {
                            console.log(profile);
                            this.user$ = of(profile);
                        }),
                        map(() => true),
                        catchError(err => {
                            console.error(err);
                            sessionStorage.setItem("accessToken", "");
                            // localStorage.setItem("refreshToken", "");
                            sessionStorage.setItem("userName", ""); 
                            return of(false)
                        }) 
                    );
                }
                else {
                    // If no accessToken, immediately return false
                    return of(false);
                }
            }),
            // Catch any error that occurs during the requestLogin or if switchMap fails
            catchError(() => of(false))
        );
    }
    logout() {
        sessionStorage.setItem("accessToken", "");
        // localStorage.setItem("refreshToken", "");
        sessionStorage.setItem("userName", "");         
        this.user$ = of(undefined);
    }

    getUser(): Observable<Employee | undefined> {
        return this.user$;
    }
}
