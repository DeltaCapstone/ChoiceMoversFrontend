import { Observable, ReplaySubject, Subject, of } from "rxjs";
import { AssignedEmployee } from "./employee";
import { Inject } from "@angular/core";
import { JobsService } from "../shared/services/jobs.service";
import { CreateJobEstimate } from "./create-job-estimate.model";
import { Customer } from "./customer.model";

export interface ISessionState {
    clear(): void;
}

export interface IJobSessionState {
    jobId: string;
    employeeToBoot$: ReplaySubject<AssignedEmployee | null>;
    alreadyAssigned$: ReplaySubject<boolean>;
    assignmentAvailable$: ReplaySubject<boolean>;
    directionsResults$: ReplaySubject<google.maps.DirectionsResult|undefined>;
}

export interface ICreateEstimateSessionState {
    currentJob: CreateJobEstimate;
    currentCustomer: Customer;
    activeStepIndex: number;
}

export class CreateEstimateSessionState implements ICreateEstimateSessionState, ISessionState {
    currentJob = new CreateJobEstimate();
    currentCustomer = new Customer();
    activeStepIndex = 0;

    clear(): void {
        this.currentJob = new CreateJobEstimate();
        this.currentCustomer = new Customer();
        this.activeStepIndex = 0;
    }
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
    directionsResults$ = new ReplaySubject<google.maps.DirectionsResult | undefined>(1);
    
    constructor(jobId: string=""){
        this.jobId = jobId;
        this.employeeToBoot$.next(null);
        this.alreadyAssigned$.next(false);
        this.assignmentAvailable$.next(false);
        this.directionsResults$.next(undefined);
        this.jobsService = Inject(JobsService);
    }

    clear(): void {
        this.jobId = "";
        this.employeeToBoot$.next(null);
        this.alreadyAssigned$.next(false);
        this.assignmentAvailable$.next(false);
        this.directionsResults$.next(undefined);
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
    Employee = "employee",
    Customer = "customer",
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
    constructor(getUser: () => Observable<T | undefined>, loginRoute: string, type: SessionType) {
        this.type = type;
        this.getUser = getUser;
        this.loginRoute = loginRoute;
    }
}
