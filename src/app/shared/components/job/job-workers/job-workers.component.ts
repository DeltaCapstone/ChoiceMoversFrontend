import { Component } from '@angular/core';
import { Job } from '../../../../models/job.model';
import { Observable, Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
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
        this.workers$ = this.employeesService.getEmployees();
    }

    constructor(
        private session: SessionService,
        private employeesService: EmployeesService,
        private router: Router,
    ) {
        super();
    }

    openEmployee(userName: string = "") {
        this.session.guardWithAuth().subscribe(_ => this.router.navigate([`/dashboard/schedule/job/`, userName]));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
