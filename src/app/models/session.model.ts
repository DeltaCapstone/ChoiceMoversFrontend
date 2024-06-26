import { BehaviorSubject, Observable, ReplaySubject, Subject, of } from "rxjs";
import { AssignedEmployee } from "./employee";
import { Inject } from "@angular/core";
import { JobsService } from "../shared/services/jobs.service";
import { CreateJobEstimate } from "./create-job-estimate.model";
import { Customer } from "./customer.model";

/**
 * Interface that describes the SessionState type
 */
export interface ISessionState {
    clear(): void;
}

/**
 * Interface that describes the JobSessionState type
 */
export interface IJobSessionState {
    jobId: string;
    employeeToBoot$: ReplaySubject<AssignedEmployee | null>;
    managerAssigned$: ReplaySubject<boolean>;
    alreadyAssigned$: ReplaySubject<boolean>;
    assignmentAvailable$: ReplaySubject<boolean>;
    directionsResults$: ReplaySubject<google.maps.DirectionsResult | undefined>;
}

/**
 * Interface that describes the CreateEstimateSessionState type
 */
export interface ICreateEstimateSessionState {
    currentJob: CreateJobEstimate;
    currentCustomer: BehaviorSubject<Customer | null>;
    activeStepIndex: number;
    estimateAmount: BehaviorSubject<number | null>;
    estimateID: BehaviorSubject<number | null>;
}

/**
 * Class that defines a CreateEstimateSessionState object and its properties and methods
 */
export class CreateEstimateSessionState implements ICreateEstimateSessionState, ISessionState {
    currentJob = new CreateJobEstimate();
    currentCustomer = new BehaviorSubject<Customer | null>(null);
    activeStepIndex = 0;
    estimateAmount = new BehaviorSubject<number | null>(null);
    estimateID = new BehaviorSubject<number | null>(null);

    clear(): void {
        this.currentJob = new CreateJobEstimate();
        this.currentCustomer.next(new Customer());
        this.activeStepIndex = 0;
        this.estimateAmount.next(null);
        this.estimateID.next(null);
    }
}

/**
 * Interface that describes the ScheduleSessionState type
 */
export interface IScheduleSessionState {
    jobSessionState: JobSessionState | null;
    jobsStartDate: string;
    jobsEndDate: string;
    tabIndex: number;
}

/**
 * Class that defines a JobSessionStateObject and its properties and methods
 */
export class JobSessionState implements IJobSessionState, ISessionState {
    jobsService: JobsService;
    jobId = "";
    employeeToBoot$ = new ReplaySubject<AssignedEmployee | null>(1);
    managerAssigned$ = new ReplaySubject<boolean>(1);
    alreadyAssigned$ = new ReplaySubject<boolean>(1);
    assignmentAvailable$ = new ReplaySubject<boolean>(1);
    directionsResults$ = new ReplaySubject<google.maps.DirectionsResult | undefined>(1);

    constructor(jobId: string = "") {
        this.jobId = jobId;
        this.employeeToBoot$.next(null);
        this.managerAssigned$.next(false);
        this.alreadyAssigned$.next(false);
        this.assignmentAvailable$.next(false);
        this.directionsResults$.next(undefined);
        this.jobsService = Inject(JobsService);
    }

    clear(): void {
        this.jobId = "";
        this.employeeToBoot$.next(null);
        this.managerAssigned$.next(false);
        this.alreadyAssigned$.next(false);
        this.assignmentAvailable$.next(false);
        this.directionsResults$.next(undefined);
    }
}

/**
 * Class that defines a ScheduleSessionStateObject and its properties and methods
 */
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

/**
 * Enum class that describes a SessionType
 */
export enum SessionType {
    Employee = "employee",
    Customer = "customer",
}

/**
 * Interface that describes the SessionServiceConfig generic type
 */
export interface ISessionServiceConfig<T> {
    type: SessionType;
    getUser: () => Observable<T | undefined>;
    loginRoute: string;
}

/**
 * Class that defines a SessionServiceConfig generic object and its properties and methods
 */
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
