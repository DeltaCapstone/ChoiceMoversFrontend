import { Injectable } from '@angular/core';
import { Employee, LoginRequest } from '../../models/user';
import { EmployeesService } from './employees.service';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
    user$: Observable<Employee | undefined> = of(undefined);
    apiUrl: string;
    
    constructor(private employeesService: EmployeesService, private http: HttpClient, private feature: FeatureService) {
        this.apiUrl = this.feature.getFeatureValue("api").url;
        // check if there is a stored token
        const token = sessionStorage.getItem("accessToken");
        const userName = sessionStorage.getItem("userName");
        
        // TODO: need to check for expiration
        if (token && userName) {
            this.user$ = this.employeesService.getProfile();
        }
    }

    setSessionValues(accessToken?: string, accessTokenExpiresAt?: string, refreshToken?: string, userName?: string){
        accessToken = accessToken ?? sessionStorage.getItem("accessToken") ?? "";
        accessTokenExpiresAt = accessTokenExpiresAt ?? sessionStorage.getItem("accessTokenExpiresAt") ?? "";
        refreshToken = refreshToken ?? sessionStorage.getItem("refreshToken") ?? "";
        userName = userName ?? sessionStorage.getItem("userName") ?? "";
        
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("userName", userName);
        sessionStorage.setItem("accessTokenExpiresAt", accessTokenExpiresAt)
        localStorage.setItem("refreshToken", refreshToken); 
    }

    isExpired(): boolean {
        const expirationDateString = sessionStorage.getItem("accessTokenExpiresAt");
        if (expirationDateString){
            const expirationDate = new Date(expirationDateString);
            return expirationDate < new Date();
        }
        else {
            return true;
        }
    }

    refresh(): Observable<boolean> {
        const refreshToken = sessionStorage.getItem("refreshToken");
        return this.http.post(`${this.apiUrl}/renewAccess`, {"refreshToken": refreshToken}).pipe(
            tap((res: any) => this.setSessionValues(res["accessToken"], res["accessTokenExpiresAt"])),
            map(_ => true),
            catchError(err => {
                console.error(err);
                this.setSessionValues("", "", "", "");
                return of(false);
            })
        )
    }

    login(userName: string, passwordPlain: string): Observable<boolean> {
        const loginRequest: LoginRequest = {
            userName: userName,
            passwordPlain: passwordPlain
        };
        return this.http.post<LoginRequest>(`${this.apiUrl}/portal/login`, loginRequest).pipe(
            switchMap((res: any) => {
                console.log(res);
                const accessToken = res["accessToken"];
                if (accessToken) {
                    return this.employeesService.getProfile().pipe(
                        tap(profile => {
                            this.user$ = of(profile);
                            this.setSessionValues(accessToken, userName, res["accessTokenExpiresAt"], res["refreshToken"]);
                        }),
                        map(_ => true),
                        catchError(err => {
                            console.error(err);
                            this.setSessionValues("", "", "", "");
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
        this.setSessionValues("", "", "", "");
        this.user$ = of(undefined);
    }

    getUser(): Observable<Employee | undefined> {
        return this.user$;
    }
}
