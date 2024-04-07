import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { JobInfoComponent } from './job-info/job-info.component';
import { BaseComponent } from '../base-component';
import { TuiDialogService, TuiSvgModule } from '@taiga-ui/core';
import { TUI_PROMPT, TuiPromptModule, TuiTabsModule } from '@taiga-ui/kit';
import { SessionService } from '../../services/session.service';
import { AssignedEmployee, Employee } from '../../../models/employee';
import { JobsService } from '../../services/jobs.service';
import { BehaviorSubject, Observable, of, switchMap, take, tap } from 'rxjs';
import { Job } from '../../../models/job.model';
import { CommonModule, NgClass } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';
import { EmployeeSessionServiceToken } from '../../../app.config';

@Component({
    selector: 'app-job',
    standalone: true,
    imports: [JobInfoComponent, RouterOutlet, RouterModule, TuiLetModule, NgClass, 
        TuiSvgModule, TuiTabsModule, CommonModule, TuiPromptModule],
    templateUrl: './job.component.html',
    styleUrl: './job.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobComponent extends BaseComponent {
    job$: Observable<Job | undefined>;
    jobSessionState = this.session.scheduleSessionState.jobSessionState;
    assignmentAvailable$ = this.jobSessionState.assignmentAvailable$.asObservable(); 
    alreadyAssigned$ = this.jobSessionState.alreadyAssigned$.asObservable();
    employeeToBoot$ = this.jobSessionState.employeeToBoot$.asObservable();
    isFull$ = new BehaviorSubject<boolean>(false);

    warningDialogOpen = false;

    constructor(
        @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
        @Inject(EmployeeSessionServiceToken) private session: SessionService<Employee>,
        private jobsService: JobsService,
        private route: ActivatedRoute,
        private router: Router) {
        super();
    }

    ngOnInit() {
        const jobId = this.route.snapshot.paramMap.get("jobId") ?? "";
        this.job$ = this.jobsService.getJob(jobId);
        this.job$.subscribe(job => {
            console.log(job);
            if (job)
                this.isFull$.next((job.assignedEmployees?.length ?? 0) >= job.numberWorkers);
        });
        this.jobSessionState.jobId = jobId;

        this.navigateToTab(this.session.scheduleSessionState.tabIndex);
        this.session.refreshJobSessionState();
    }

    openWarningDialog(employeeToBoot: AssignedEmployee) {
        this.dialogs.open<boolean>(TUI_PROMPT, {
            label: 'Warning',
            data: {
              content: `This will boot ${employeeToBoot.firstName} ${employeeToBoot.lastName}`,
              yes: 'Ok',
              no: 'Cancel',
            },
        }).subscribe(yes => {
            if (yes){
                this.selfAssign();
            }
        });
	}

    selfAssign() {
        this.job$.pipe(
            take(1),
            switchMap(job => job ? 
                this.jobsService.selfAssign(job.jobId!) : 
                of(undefined))
        ).subscribe(_ => {
            this.job$.pipe(take(1)).subscribe(job => job ?
                this.session.refreshJobSessionState() : null)
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
                this.session.refreshJobSessionState() : null)
        });
    }

    setTabIndex(tabIndex: number){
        this.session.scheduleSessionState.tabIndex = tabIndex;
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
                tabRoute += "/contact";
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
