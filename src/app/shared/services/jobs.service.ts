import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, catchError, map, of, switchMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';
import { Job } from '../../models/job.model';

/**
 * Service that provides an interface for creating and updating jobs from the customer facing Moving page.
 */
@Injectable({
    providedIn: 'root'
})

export class JobsService {
    cacheStartDate: string;
    cacheEndDate: string;
    cache$ = new ReplaySubject<Map<string, Job>>(1);
    apiUrl: string = "";

    constructor(private http: HttpClient, private feature: FeatureService) {
        this.apiUrl = this.feature.getFeatureValue("api").url;
        this.cache$.next(new Map);
    }

    createJob(newJob: Job): Observable<Job> {
        this.cacheUpsert([newJob]);
        return this.http.post<Job>(`${this.apiUrl}/customer/job`, newJob);
    }

    getJobs(start: string, end: string): Observable<Job[]> {
        const needsRefresh = start != this.cacheStartDate || end != this.cacheEndDate;
        this.cacheStartDate = start;
        this.cacheEndDate = end;

        return this.cacheLookupWithFallback(
            cache => of(Array.from(cache.values())),
            () => this.http.get<Job[]>(`${this.apiUrl}/employee/jobs?start=${start}&end=${end}`).pipe(
                tap(jobs => this.cacheUpsert(jobs)),
                switchMap(() => this.cache$.pipe(
                    take(1),
                    map(cache => Array.from(cache.values()))
                )),
                catchError(error => {
                    if (error.status == 404) {
                        console.error("No jobs found in specified dates");
                    }
                    return of([]);
                })
            ),
            needsRefresh
        );
    }

    getJob(jobId: string): Observable<Job | undefined> {
        return this.cache$.pipe(map(cache => cache.get(jobId)));
    }

    private cacheLookupWithFallback(onHit: (cache: Map<string, Job>) => Observable<Job[]>, onMiss: () => Observable<Job[]>, forceMiss?: boolean): Observable<Job[]> {
        return this.cache$.pipe(
            take(1),
            switchMap(cache => {
                if (cache.size > 1 && !forceMiss) {
                    console.log("job cache hit");
                    return onHit(cache);
                }
                else {
                    console.log("job cache miss");
                    return onMiss();
                }
            }),
            catchError(error => {
                console.error(error);
                return of([]);
            })
        );
    }

    private cacheDelete(jobIds: string[]) {
        this.cache$.pipe(take(1)).subscribe(cache => {
            jobIds.forEach(jobIds => cache.delete(jobIds));
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
