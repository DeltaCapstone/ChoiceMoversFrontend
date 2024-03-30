import { Observable, ReplaySubject, Subject } from "rxjs";
import { AssignedEmployee } from "./employee";
import { Inject } from "@angular/core";
import { JobsService } from "../shared/services/jobs.service";

export interface ISessionState {
    clear(): void;
}

export interface IJobSessionState {
    jobId: string;
    employeeToBoot$: ReplaySubject<AssignedEmployee | null>;
    alreadyAssigned$: ReplaySubject<boolean>;
    assignmentAvailable$: ReplaySubject<boolean>;
}

export interface IScheduleSessionState {
    jobSessionState: JobSessionState | null;
    jobsStartDate: string;
    jobsEndDate: string;
    tabIndex: number;
}

export class JobSessionState implements IJobSessionState, ISessionState {
    jobsService: JobsService;
    jobId = "";
    employeeToBoot$ = new ReplaySubject<AssignedEmployee | null>(1);
    alreadyAssigned$ = new ReplaySubject<boolean>(1);
    assignmentAvailable$ = new ReplaySubject<boolean>(1);

    constructor(jobId: string=""){
        this.jobId = jobId;
        this.employeeToBoot$.next(null);
        this.alreadyAssigned$.next(false);
        this.assignmentAvailable$.next(false);
        this.jobsService = Inject(JobsService);
    }

    clear(): void {
        this.jobId = "";
        this.employeeToBoot$.next(null);
        this.alreadyAssigned$.next(false);
        this.assignmentAvailable$.next(false);
    }
}

export class ScheduleSessionState implements IScheduleSessionState, ISessionState {
    jobsStartDate = "";
    jobsEndDate = "";
    tabIndex = 0;
    jobSessionState = new JobSessionState();

    clear(): void {
        this.jobsStartDate = "";
        this.jobsEndDate = "";
        this.tabIndex = 0;
        this.jobSessionState.clear();
    }
}

export enum SessionType {
    Employee = "EmployeeSessionService",
    Customer = "CustomerSessionService",
}

export interface ISessionServiceConfig<T> {
    type: SessionType;
    getUser: () => Observable<T | undefined>;
    loginRoute: string;
}

export class SessionServiceConfig<T> implements ISessionServiceConfig<T> {
    type: SessionType;
    getUser: () => Observable<T | undefined>;
    loginRoute: string;
    constructor(getUser: () => Observable<T | undefined>, loginRoute: string, type: SessionType){
        this.type = type;
        this.getUser = getUser;
        this.loginRoute = loginRoute;
    }
}
