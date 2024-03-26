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
