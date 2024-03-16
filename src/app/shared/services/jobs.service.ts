import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, take } from 'rxjs';
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
    cache$ = new ReplaySubject<Map<string, Job>>(1);
    apiUrl: string = "";

    constructor(private http: HttpClient, private feature: FeatureService) {
        this.apiUrl = this.feature.getFeatureValue("api").url;
        this.cache$.next(new Map);
    }

    getJobs(){
        const start = '2024-04-10 16:00:00';
        const end = '2024-04-25 19:00:00';
        this.http.get(`${this.apiUrl}/employee/jobs?start=${start}&end=${end}`).subscribe(res => {
            console.log(res); 
        });
    }

  
    private cacheDelete(jobIds: string[]){
        this.cache$.pipe(take(1)).subscribe(cache => {
            jobIds.forEach(jobIds => cache.delete(jobIds));
            this.cache$.next(cache);
        });
    }

    private cacheUpsert(jobs: Partial<Job>[]) {
        this.cache$.pipe(take(1)).subscribe(cache => {
            // Merge new employees into the cache
            jobs.forEach(newJob => {
                const jobId = newJob.jobId as string;
                const job = cache.get(jobId) ?? new Job();
                Object.assign(job, newJob);
                cache.set(jobId, job);
            });
            this.cache$.next(cache);
        });
    }
}
