import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '../base-component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../../services/jobs.service';
import { Observable, Subscription, of, tap } from 'rxjs';
import { Job } from '../../../models/job.model';
import { TuiFieldErrorPipeModule, TuiInputDateModule, TuiInputModule, TuiTabsModule } from '@taiga-ui/kit';
import { TuiErrorModule, TuiSvgModule } from '@taiga-ui/core';
import { CommonModule, Location } from '@angular/common';
import { TUI_DATE_FORMAT, TUI_DATE_SEPARATOR, TuiDay } from '@taiga-ui/cdk';

@Component({
    selector: 'app-job-info',
    standalone: true,
    imports: [ReactiveFormsModule, TuiInputModule, CommonModule, TuiInputDateModule,
        TuiErrorModule, TuiFieldErrorPipeModule, TuiTabsModule, TuiSvgModule],
    templateUrl: './job-info.component.html',
    styleUrl: './job-info.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: TUI_DATE_FORMAT, useValue: 'YMD' },
        { provide: TUI_DATE_SEPARATOR, useValue: '/' },
    ]
})
export class JobInfoComponent extends BaseComponent {
    subscriptions: Subscription[] = [];
    form = new FormGroup({
        jobId: new FormControl(""),
        startTime: new FormControl(TuiDay.currentLocal()),
        endTime: new FormControl(TuiDay.currentLocal())
    });
    job$: Observable<Job | undefined>;
    activeItemIndex: number = 0;

    ngOnInit() {
        const jobId: string | null = this.route.snapshot.paramMap.get("jobId");
        if (jobId) {
            this.job$ = this.jobsService.getJob(jobId);
            const jobSub = this.job$.subscribe(job => {
                console.log(job);
                if (!job)
                    this.router.navigate(["dashboard/schedule"]);

                this.form.patchValue({
                    jobId: job?.jobId ?? "",
                    startTime: job?.startTime ? TuiDay.fromUtcNativeDate(new Date(job.startTime)) : TuiDay.currentLocal(),
                    endTime: job?.endTime ? TuiDay.fromUtcNativeDate(new Date(job.startTime)) : TuiDay.currentLocal(),
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
