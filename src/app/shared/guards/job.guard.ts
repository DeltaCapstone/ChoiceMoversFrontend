import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JobsService } from '../services/jobs.service';
import { map, take } from 'rxjs';

export const jobGuard: CanActivateFn = (route, state) => {
    const jobsService = inject(JobsService);
    const router = inject(Router);

    const jobId = route.paramMap.get("jobId") ?? "";
    return jobsService.getJob(jobId).pipe(
        take(1),
        map(job => {
            if (job) {
                return true;
            }
            else {
                return router.parseUrl("dashboard/schedule");
            }
        })
    );
};
