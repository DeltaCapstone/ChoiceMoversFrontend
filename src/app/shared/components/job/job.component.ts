import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { JobInfoComponent } from './job-info/job-info.component';
import { BaseComponent } from '../base-component';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiTabsModule } from '@taiga-ui/kit';
import { SessionService } from '../../services/session.service';
import { SessionType } from '../../../models/session.model';
import { Employee } from '../../../models/employee';
import { JobsService } from '../../services/jobs.service';
import { Observable, of, switchMap, take } from 'rxjs';
import { Job } from '../../../models/job.model';

@Component({
    selector: 'app-job',
    standalone: true,
    imports: [JobInfoComponent, RouterOutlet, RouterModule, TuiSvgModule, TuiTabsModule],
    templateUrl: './job.component.html',
    styleUrl: './job.component.css'
})
export class JobComponent extends BaseComponent {
    job$: Observable<Job | undefined>;

    constructor(
        @Inject(SessionType.Employee) private session: SessionService<Employee>,
        private jobsService: JobsService,
        private route: ActivatedRoute,
        private router: Router) {
        super();
    }

    ngOnInit() {
        const jobId = this.route.snapshot.paramMap.get("jobId") ?? "";
        this.job$ = this.jobsService.getJob(jobId);
    }

    selfAssign() {
        this.job$.pipe(
            take(1),
            switchMap(job => job ? 
                this.jobsService.selfAssign(job.jobId!) : 
                of(undefined))
        ).subscribe(); 
    }

    back() {
        this.session.scheduleSessionState.jobId = "";
        this.router.navigate(["/dashboard/schedule"]);
    }
}
