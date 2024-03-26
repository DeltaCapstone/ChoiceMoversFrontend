import { Observable } from "rxjs";

export interface ISessionState {
    clear(): void;
}

export interface IScheduleSessionState {
    jobsStartDate: string;
    jobsEndDate: string;
    jobId: string;
}

export class ScheduleSessionState implements IScheduleSessionState, ISessionState {
    jobsStartDate = "";
    jobsEndDate = "";
    jobId = "";

    clear(): void {
        this.jobsStartDate = "";
        this.jobsEndDate = "";
        this.jobId = "";
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
