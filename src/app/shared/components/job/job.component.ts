import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { JobInfoComponent } from './job-info/job-info.component';
import { BaseComponent } from '../base-component';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiTabsModule } from '@taiga-ui/kit';
import { SessionService } from '../../services/session.service';
import { JobSessionState, SessionType } from '../../../models/session.model';
import { Employee } from '../../../models/employee';
import { JobsService } from '../../services/jobs.service';
import { Observable, of, switchMap, take } from 'rxjs';
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
    isFull$: Observable<boolean>; 
    alreadyAssigned$: Observable<boolean>;
    jobSessionState = this.session.scheduleSessionState.jobSessionState;

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
        this.jobSessionState.jobId = jobId;

        this.navigateToTab(this.session.scheduleSessionState.tabIndex);
        this.checkAssignmentAvailability(jobId);

        this.isFull$ = this.jobSessionState.isFull$.asObservable();        
        this.alreadyAssigned$ = this.jobSessionState.alreadyAssigned$.asObservable();        
    }

    selfAssign() {
        this.job$.pipe(
            take(1),
            switchMap(job => job ? 
                this.jobsService.selfAssign(job.jobId!) : 
                of(undefined))
        ).subscribe(_ => {
            this.job$.pipe(take(1)).subscribe(job => job ?
                this.checkAssignmentAvailability(job.jobId) : null)
        });
    }

    selfRemove() {
        this.job$.pipe(
            take(1),
            switchMap(job => job ? 
                this.jobsService.selfRemove(job.jobId!) : 
                of(undefined))
        ).subscribe(_ => {
            this.job$.pipe(take(1)).subscribe(job => job ?
                this.checkAssignmentAvailability(job.jobId) : null)
        });
    }

    setTabIndex(tabIndex: number){
        this.session.scheduleSessionState.tabIndex = tabIndex;
    }

    checkAssignmentAvailability(jobId: string) {
        this.jobsService.checkAssignmentAvailability(jobId)
            .subscribe(res => {
                if (typeof res === 'string') {
                    switch (res) {
                        case AssignmentConflictType.AlreadyAssigned:
                            this.jobSessionState.alreadyAssigned$.next(true);
                            break;
                        case AssignmentConflictType.JobFull:
                            this.jobSessionState.isFull$.next(true);
                            break;
                    }
                    this.jobSessionState.employeeToBoot$.next(null);
                }
                else {
                    this.jobSessionState.alreadyAssigned$.next(false);
                    this.jobSessionState.isFull$.next(false);
                    this.jobSessionState.employeeToBoot$.next(res);
                }           
            })
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
        this.jobSessionState.clear();
        this.router.navigate(["/dashboard/schedule"]);
    }
}
