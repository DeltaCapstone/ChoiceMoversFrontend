import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';
import { CreateEstimateSessionState, ScheduleSessionState, SessionServiceConfig, SessionType } from '../../models/session.model';
import { JobsService } from "../../shared/services/jobs.service";
import { AssignmentConflictType } from "../../models/job.model";
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/employee';

@Injectable({
    providedIn: 'root'
})
export class SessionService<T> {
    user$: BehaviorSubject<T | undefined>;
    apiUrl: string;
    scheduleSessionState = new ScheduleSessionState;
    movePlannerSessionState = new CreateEstimateSessionState;
    config: SessionServiceConfig<T>;

    constructor(
        private http: HttpClient,
        private feature: FeatureService,
        private router: Router,
        private jobsService: JobsService,
        config: SessionServiceConfig<T>) {
        this.apiUrl = this.feature.getFeatureValue("api").url;
        this.config = config;

        this.user$ = new BehaviorSubject<T | undefined>(undefined)

        this.isUserAuthorized().subscribe(isAuthorized => {
            if (isAuthorized) {
                this.config.getUser().subscribe(user => {
                    this.user$.next(user);
                });
            }
        });
    }

    login(userName: string, passwordPlain: string): Observable<boolean> {
        const loginRequest: LoginRequest = {
            userName: userName,
            passwordPlain: passwordPlain
        };
        return this.http.post<LoginRequest>(`${this.apiUrl}/${this.config.loginRoute}`, loginRequest).pipe(
            switchMap((res: any) => {
                const accessToken = res["accessToken"];
                this.setStorageValues(accessToken, res["accessTokenExpiresAt"], res["refreshToken"], res["refreshTokenExpiresAt"], userName);
                if (accessToken) {
                    return this.config.getUser().pipe(
                        tap(profile => {
                            this.user$.next(profile);
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

    getType(): SessionType {
        return this.config.type;
    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        this.scheduleSessionState.clear();
        this.user$.next(undefined);
    }

    getUser(): Observable<T | undefined> {
        return this.user$;
    }

    redirectToLogin() {
        this.router.navigate(["login", this.config.type]);
    }

    isUserAuthorized(): Observable<boolean> {
        if (this.isActive()) {
            return of(true).pipe(take(1));
        }
        else { // attempt a refresh
            return this.refresh().pipe(
                tap(isAuthorized => {
                    if (!isAuthorized)
                        this.logout();
                })
            );
        }
    }

    refreshJobSessionState() {
        const jobSessionState = this.scheduleSessionState.jobSessionState;
        this.jobsService.checkAssignmentAvailability(jobSessionState.jobId)
            .subscribe(res => {
                console.log(res);
                if (typeof res === 'string') {
                    switch (res) {
                        case AssignmentConflictType.AlreadyAssigned:
                            jobSessionState.alreadyAssigned$.next(true);
                            break;
                        case AssignmentConflictType.JobFull:
                            jobSessionState.assignmentAvailable$.next(false);
                            break;
                    }
                    jobSessionState.employeeToBoot$.next(null);
                }
                else {
                    jobSessionState.assignmentAvailable$.next(true);
                    jobSessionState.alreadyAssigned$.next(false);
                    jobSessionState.employeeToBoot$.next(res);
                }
            })
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
            tap((res: any) => this.setStorageValues(res["accessToken"], res["accessTokenExpiresAt"])),
            map(_ => true),
            catchError(err => {
                console.error(err);
                this.logout();
                return of(false);
            })
        )
    }

    setStorageValues(accessToken?: string, accessTokenExpiresAt?: string, refreshToken?: string, refreshTokenExpiresAt?: string, userName?: string) {
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
