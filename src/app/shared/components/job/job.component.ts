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
import { Observable, map, of, switchMap, take } from 'rxjs';
import { AssignmentConflictType, Job } from '../../../models/job.model';
import { CommonModule, NgClass } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';

@Component({
    selector: 'app-job',
    standalone: true,
    imports: [JobInfoComponent, RouterOutlet, RouterModule, TuiLetModule, NgClass, 
        TuiSvgModule, TuiTabsModule, CommonModule],
    templateUrl: './job.component.html',
    styleUrl: './job.component.css'
})
export class JobComponent extends BaseComponent {
    job$: Observable<Job | undefined>;
    conflictMessage$: Observable<string>;

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
        this.navigateToTab(this.session.scheduleSessionState.tabIndex);
        this.conflictMessage$ = this.getConflictMessage(jobId); 
    }

    selfAssign() {
        this.job$.pipe(
            take(1),
            switchMap(job => job ? 
                this.jobsService.selfAssign(job.jobId!) : 
                of(undefined))
        ).subscribe(_ => {
            this.job$.pipe(take(1)).subscribe(job => job ?
                this.conflictMessage$ = this.getConflictMessage(job.jobId) : null)
        });
    }

    setTabIndex(tabIndex: number){
        this.session.scheduleSessionState.tabIndex = tabIndex;
    }

    getConflictMessage(jobId: string): Observable<string> {
        return this.jobsService.checkAssignmentAvailability(jobId).pipe(
            map(res => {
                switch (res){
                    case AssignmentConflictType.AlreadyAssigned:
                        return "You are already assigned to this job";
                    case AssignmentConflictType.JobFull:
                        return "This job is full, and there is no one you can override";
                    default:
                        return "";
                }
            })
        )
    }

    private navigateToTab(tabIndex: number){
        const jobId = this.route.snapshot.paramMap.get("jobId") ?? "";

        let tabRoute = `dashboard/schedule/job/${jobId}`;
        switch (tabIndex){
            case 0:
                tabRoute += "/info";
                break;
            case 1:
                tabRoute += "/workers";
                break;
            case 2:
                // TODO
                tabRoute += "/workers";
                break;
        }
        this.router.navigate([tabRoute]);
    }

    back() {
        this.session.scheduleSessionState.tabIndex = 0;
        this.session.scheduleSessionState.jobId = "";
        this.router.navigate(["/dashboard/schedule"]);
    }
}
