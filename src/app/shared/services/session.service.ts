import { Injectable } from '@angular/core';
import { Employee, LoginRequest } from '../../models/employee';
import { EmployeesService } from './employees.service';
import { Observable, catchError, map, of, switchMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    user$: Observable<Employee | undefined> = of(undefined);
    apiUrl: string;

    constructor(private employeesService: EmployeesService, private http: HttpClient, private feature: FeatureService, private router: Router) {
        this.apiUrl = this.feature.getFeatureValue("api").url;

        this.guardWithAuth(() => this.user$ = this.employeesService.getProfile());
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
                    return of(false);
                }
            }),
            // Catch any error that occurs during the requestLogin or if switchMap fails
            catchError(() => of(false))
        );
    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        this.user$ = of(undefined);
    }

    getUser(): Observable<Employee | undefined> {
        return this.user$;
    }

    guardWithAuth(onSuccess: () => any, onFailure: () => any = () => { this.router.navigate(["/login"]) }): Observable<any> {
        if (this.isActive()) {
            return of(onSuccess()).pipe(take(1));
        }
        else { // attempt a refresh
            return this.refresh().pipe(
                take(1),
                map(success => {
                    if (success) {
                        return onSuccess();
                    }
                    else {
                        return onFailure();
                    }
                })
            )
        }
    }

    private isActive(): boolean {
        const accessTokenExpiresAt = sessionStorage.getItem("accessTokenExpiresAt");
        const accessTokenExpirationDate = accessTokenExpiresAt ? new Date(accessTokenExpiresAt) : new Date(0);
        return accessTokenExpirationDate && accessTokenExpirationDate >= new Date();
    }

    private refresh(): Observable<boolean> {
        const refreshToken = sessionStorage.getItem("refreshToken");
        const refreshTokenExpiresAt = sessionStorage.getItem("refreshTokenExpiresAt");
        const refreshTokenExpirationDate = refreshTokenExpiresAt ? new Date(refreshTokenExpiresAt) : new Date(0);
        if (refreshTokenExpirationDate < new Date()) {
            this.logout();
            return of(false);
        }

        return this.http.post(`${this.apiUrl}/renewAccess`, { "refreshToken": refreshToken }).pipe(
            tap((res: any) => this.setSessionValues(res["accessToken"], res["accessTokenExpiresAt"])),
            map(_ => true),
            catchError(err => {
                console.error(err);
                this.logout();
                return of(false);
            })
        )
    }

    private setSessionValues(accessToken?: string, accessTokenExpiresAt?: string, refreshToken?: string, refreshTokenExpiresAt?: string, userName?: string) {
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
}
