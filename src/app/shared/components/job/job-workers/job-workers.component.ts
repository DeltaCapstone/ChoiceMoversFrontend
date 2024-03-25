import { Component } from '@angular/core';
import { Job } from '../../../../models/job.model';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobsService } from '../../../services/jobs.service';
import { BaseComponent } from '../../base-component';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';
import { Employee } from '../../../../models/employee';
import { EmployeesService } from '../../../services/employees.service';
import { SessionService } from '../../../services/session.service';

@Component({
    selector: 'app-job-workers',
    standalone: true,
    imports: [TuiTableModule, NgIf, NgFor, TuiLetModule, CommonModule, RouterModule],
    templateUrl: './job-workers.component.html',
    styleUrl: './job-workers.component.css'
})
export class JobWorkersComponent extends BaseComponent {
    job$: Observable<Job | undefined>;
    workers$: Observable<Employee[]>;
    readonly columns = ["name", "email", "employeeType"];
    subscriptions: Subscription[] = [];

    ngOnInit() {
        const jobId = this.route.parent?.snapshot?.paramMap?.get("jobId");
        if (jobId) {
            this.job$ = this.jobsService.getJob(jobId);
        }

        const jobSub = this.job$.subscribe(job => {
            if (!job)
                this.router.navigate(["dashboard/schedule"]);

            // TODO: replace with get assigned employees for this job
            this.workers$ = this.employeesService.getEmployees();
        });
        this.subscriptions.push(jobSub);
    }

    constructor(
        private session: SessionService,
        private employeesService: EmployeesService,
        private router: Router,
        private jobsService: JobsService,
        private route: ActivatedRoute,
    ) {
        super();
    }

    openEmployee(userName: string = "") {
        this.session.guardWithAuth(() => this.router.navigate([`/dashboard/schedule/job/`, userName])).subscribe();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
