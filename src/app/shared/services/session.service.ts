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

        if (this.isActive()){
            this.user$ = this.employeesService.getProfile();
        }
        else {
            this.refresh().subscribe(success => {
                if (success){
                    this.user$ = this.employeesService.getProfile();
                }
            })
        }
    }

    setSessionValues(accessToken?: string, accessTokenExpiresAt?: string, refreshToken?: string, refreshTokenExpiresAt?: string, userName?: string){
        accessToken = accessToken ?? sessionStorage.getItem("accessToken") ?? "";
        accessTokenExpiresAt = accessTokenExpiresAt ?? sessionStorage.getItem("accessTokenExpiresAt") ?? "";
        refreshToken = refreshToken ?? sessionStorage.getItem("refreshToken") ?? "";
        refreshTokenExpiresAt = refreshTokenExpiresAt ?? sessionStorage.getItem("refreshTokenExpiresAt") ?? "";
        userName = userName ?? sessionStorage.getItem("userName") ?? "";
        
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("userName", userName);
        sessionStorage.setItem("accessTokenExpiresAt", accessTokenExpiresAt)
        localStorage.setItem("refreshToken", refreshToken); 
        sessionStorage.setItem("refreshTokenExpiresAt", refreshTokenExpiresAt)
    }

    isActive(): boolean {
        const accessTokenExpiresAt = sessionStorage.getItem("accessTokenExpiresAt");
        const accessTokenExpirationDate = accessTokenExpiresAt ? new Date(accessTokenExpiresAt) : new Date(0);
        return accessTokenExpirationDate && accessTokenExpirationDate >= new Date();
    }

    refresh(): Observable<boolean> {
        const refreshToken = sessionStorage.getItem("refreshToken");
        const refreshTokenExpiresAt = sessionStorage.getItem("refreshTokenExpiresAt");
        const refreshTokenExpirationDate = refreshTokenExpiresAt ? new Date(refreshTokenExpiresAt) : new Date(0);
        if (refreshTokenExpirationDate < new Date()){
            this.logout();
            return of(false);
        }
        return this.http.post(`${this.apiUrl}/renewAccess`, {"refreshToken": refreshToken}).pipe(
            tap((res: any) => this.setSessionValues(res["accessToken"], res["accessTokenExpiresAt"])),
            map(_ => true),
            catchError(err => {
                console.error(err);
                this.logout();
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
                const accessToken = res["accessToken"];
                this.setSessionValues(accessToken, res["accessTokenExpiresAt"], res["refreshToken"], res["refreshTokenExpiresAt"], userName);
                if (accessToken) {
                    return this.employeesService.getProfile().pipe(
                        tap(profile => {
                            this.user$ = of(profile);
                        }),
                        map(_ => true),
                        catchError(err => {
                            console.error(err);
                            this.logout();
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
        this.setSessionValues("", "", "", "", "");
        this.user$ = of(undefined);
    }

    getUser(): Observable<Employee | undefined> {
        return this.user$;
    }
}
