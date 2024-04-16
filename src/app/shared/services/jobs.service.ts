import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, catchError, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';
import { AssignmentConflictType, IJob, Job } from '../../models/job.model';
import { AssignedEmployee } from '../../models/employee';
import { CreateJobEstimate, ICreateJobEstimate } from '../../models/create-job-estimate.model';

/**
 * Service that provides an interface for creating and updating jobs from the customer facing Moving page.
 */
@Injectable({
    providedIn: 'root'
})

export class JobsService {
    // currently, the cache only works for read operations, which occur on the dashboard
    cache$ = new ReplaySubject<Map<string, Job>>(1);
    apiUrl: string = "";

    constructor(private http: HttpClient, private feature: FeatureService) {
        this.apiUrl = this.feature.getFeatureValue("api").url;
        this.cache$.next(new Map);
    }

    // -----------------------
    // CUSTOMER REQUESTS
    // -----------------------

    createCustomerEstimate(newJob: CreateJobEstimate): Observable<CreateJobEstimate> {
        return this.http.post<CreateJobEstimate>(`${this.apiUrl}/customer/estimate`, newJob);
    }

    createCustomerJob(newJobID: number) {
        return this.http.post<Object>(`${this.apiUrl}/customer/estimate/convert`, { estimateId: newJobID });
    }

    updateCustomerJob(updatedJob: Job): Observable<Job> {
        this.cacheUpsert([updatedJob]);
        return this.http.post<Job>(`${this.apiUrl}/manager/job/update`, updatedJob);
    }


    // -----------------------
    // EMPLOYEE REQUESTS
    // -----------------------

    checkAssignmentAvailability(jobId: string): Observable<AssignedEmployee | AssignmentConflictType | null> {
        return this.http.get<AssignedEmployee>(`${this.apiUrl}/employee/jobs/checkAssign?jobID=${jobId}`).pipe(
            catchError(err => {
                let errorType: AssignmentConflictType | null = null;

                switch (err.error) {
                    case AssignmentConflictType.JobFull:
                        errorType = AssignmentConflictType.JobFull;
                        break;
                    case AssignmentConflictType.ManagerAssigned:
                        errorType = AssignmentConflictType.ManagerAssigned;
                        break;
                    case AssignmentConflictType.AlreadyAssigned:
                        errorType = AssignmentConflictType.AlreadyAssigned;
                        break;
                    default:
                        return throwError(() => err);
                }

                return of(errorType);
            })
        );
    }

    selfAssign(jobId: string) {
        return this.http.post<AssignedEmployee[]>(`${this.apiUrl}/employee/jobs/selfAssign?jobID=${jobId}`, {}).pipe(
            tap(assignedEmployees => {
                const partialJob: Partial<Job> = {
                    jobId: jobId,
                    assignedEmployees: assignedEmployees
                };
                this.cacheUpsert([partialJob]);
            })
        );
    }

    selfRemove(jobId: string) {
        return this.http.post<AssignedEmployee[]>(`${this.apiUrl}/employee/jobs/selfRemove?jobID=${jobId}`, {}).pipe(
            tap(assignedEmployees => {
                const partialJob: Partial<Job> = {
                    jobId: jobId,
                    assignedEmployees: assignedEmployees
                };
                this.cacheUpsert([partialJob]);
            })
        );
    }

    unassign(userName: string, jobId: string) {
        return this.http.post<AssignedEmployee[]>(`${this.apiUrl}/manager/job/assign?jobID=${jobId}&toRemove=${userName}`, {}).pipe(
            tap(assignedEmployees => {
                const partialJob: Partial<Job> = {
                    jobId: jobId,
                    assignedEmployees: assignedEmployees
                };
                this.cacheUpsert([partialJob]);
            })
        );
    }

    assign(userName: string, jobId: string) {
        return this.http.post<AssignedEmployee[]>(`${this.apiUrl}/manager/job/assign?jobID=${jobId}&toAdd=${userName}`, {}).pipe(
            tap(assignedEmployees => {
                const partialJob: Partial<Job> = {
                    jobId: jobId,
                    assignedEmployees: assignedEmployees
                };
                this.cacheUpsert([partialJob]);
            })
        );
    }

    getEmployeeJobs(start: string, end: string): Observable<Job[]> {
        return this.cache$.pipe(
            take(1),
            switchMap(cache => {
                if (cache.size > 0) {
                    const cachedJobs = Array.from(cache.values());
                    const [earliestDate, latestDate] = this.getBoundaryDates(cachedJobs);

                    if (new Date(start) >= new Date(earliestDate) && new Date(end) <= new Date(latestDate)) {
                        // Return filtered jobs within the date range if cache covers the requested period
                        const filteredJobs = cachedJobs.filter(job =>
                            new Date(job.startTime) >= new Date(start) && new Date(job.endTime) <= new Date(end));
                        return of(filteredJobs);
                    }
                }

                return this.http.get<Job[]>(`${this.apiUrl}/employee/jobs?start=${start}&end=${end}`).pipe(
                    tap(jobs => console.log(jobs)),
                    tap(jobs => this.cacheUpsert(jobs)),
                    switchMap(() => this.cache$.pipe(
                        take(1),
                        map(cache => Array.from(cache.values()))
                    )),
                    catchError(error => {
                        if (error.status === 404) {
                            console.error("No jobs found in specified dates");
                        }
                        return of([]);
                    })
                );
            }),
            catchError(error => {
                console.error(error);
                return of([]);
            })
        );
    }

    // -----------------------
    // GENERAL REQUESTS
    // -----------------------

    // currently only looks in the cache
    getJob(jobId: string): Observable<Job | undefined> {
        console.log("job cache hit");
        return this.cache$.pipe(map(cache => cache.get(jobId)));
    }

    // -----------------------
    // CACHE FUNCTIONS
    // -----------------------

    private getBoundaryDates(jobs: Job[]): [string, string] {
        const earliestDate = jobs.reduce((prev, curr) =>
            new Date(curr.startTime) < new Date(prev) ? curr.startTime : prev, jobs[0].startTime);
        const latestDate = jobs.reduce((prev, curr) =>
            new Date(curr.endTime) > new Date(prev) ? curr.endTime : prev, jobs[0].endTime);
        return [earliestDate, latestDate];
    }

    private cacheDelete(jobIds: string[]) {
        this.cache$.pipe(take(1)).subscribe(cache => {
            jobIds.forEach(jobId => {
                cache.delete(jobId)
            });
            this.cache$.next(cache);
        });
    }

    private cacheUpsert(jobs: Partial<Job>[]) {
        this.cache$.pipe(take(1)).subscribe(cache => {
            // Merge new employees into the cache
            jobs.forEach(newJob => {
                const jobId = String(newJob.jobId);
                const job = cache.get(jobId) ?? new Job();
                Object.assign(job, newJob);
                cache.set(jobId, job);
            });
            this.cache$.next(cache);
        });
    }
}
