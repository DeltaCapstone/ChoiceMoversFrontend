import { Component } from '@angular/core';
import { BaseComponent } from '../base-component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../../services/jobs.service';
import { Observable, Subscription, of, tap } from 'rxjs';
import { Job } from '../../../models/job.model';
import { TuiFieldErrorPipeModule, TuiInputModule, TuiTabsModule } from '@taiga-ui/kit';
import { TuiErrorModule, TuiSvgModule } from '@taiga-ui/core';
import { CommonModule, Location } from '@angular/common';

@Component({
    selector: 'app-job-info',
    standalone: true,
    imports: [ReactiveFormsModule, TuiInputModule, CommonModule,
        TuiErrorModule, TuiFieldErrorPipeModule, TuiTabsModule,
        TuiSvgModule],
    templateUrl: './job-info.component.html',
    styleUrl: './job-info.component.css'
})
export class JobInfoComponent extends BaseComponent {
    subscriptions: Subscription[] = [];
    readonly form = new FormGroup({
        jobId: new FormControl(""),
    });
    job$: Observable<Job | undefined>;
    activeItemIndex: number = 0;

    ngOnInit() {
        const jobId: string | null = this.route.snapshot.paramMap.get("jobId");
        if (jobId) {
            this.job$ = this.jobsService.getJob(jobId);

            const jobSub = this.job$.subscribe(job => {
                if (!job)
                    this.router.navigate(["dashboard/schedule"]);

                this.form.patchValue({
                    jobId: job?.jobId ?? ""
                });
            });
            this.subscriptions.push(jobSub);
        }
    }

    back() {
        this.location.back();
    }

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private jobsService: JobsService) {
        super();
    }


    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
