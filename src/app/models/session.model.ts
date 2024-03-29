import { Observable } from "rxjs";
import { CreateJobEstimate } from "./create-job-estimate.model";
import { Customer } from "./customer.model";

export interface ISessionState {
    clear(): void;
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
    jobsStartDate: string;
    jobsEndDate: string;
    jobId: string;
    tabIndex: number;
}

export class ScheduleSessionState implements IScheduleSessionState, ISessionState {
    jobsStartDate = "";
    jobsEndDate = "";
    jobId = "";
    tabIndex = 0;

    clear(): void {
        this.jobsStartDate = "";
        this.jobsEndDate = "";
        this.jobId = "";
        this.tabIndex = 0;
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
    constructor(getUser: () => Observable<T | undefined>, loginRoute: string, type: SessionType) {
        this.type = type;
        this.getUser = getUser;
        this.loginRoute = loginRoute;
    }
}
