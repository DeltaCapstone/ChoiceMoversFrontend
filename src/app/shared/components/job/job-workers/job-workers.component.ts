import { Component, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, map, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseComponent } from '../../base-component';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';
import { AssignedEmployee, Employee } from '../../../../models/employee';
import { SessionService } from '../../../services/session.service';
import { JobsService } from '../../../services/jobs.service';
import { SessionType } from '../../../../models/session.model';
import { EmployeesService } from '../../../services/employees.service';
import { TuiTagModule } from '@taiga-ui/kit';

@Component({
    selector: 'app-job-workers',
    standalone: true,
    imports: [TuiTableModule, NgIf, NgFor, TuiLetModule, 
        TuiLetModule, CommonModule, RouterModule, TuiTagModule],
    templateUrl: './job-workers.component.html',
    styleUrl: './job-workers.component.css'
})
export class JobWorkersComponent extends BaseComponent {
    maxWorkers$ = new BehaviorSubject<string>("0");
    workers$: Observable<AssignedEmployee[]>;
    canOverride$: Observable<boolean>;
    readonly columns = ["name", "email", "employeeType"];
    subscriptions: Subscription[] = [];

    ngOnInit() {        
        this.canOverride$ = this.session.scheduleSessionState.jobSessionState.employeeToBoot$.asObservable().pipe(
            map(emp => !!emp)
        );
        
        const jobId = this.route.parent?.snapshot?.paramMap?.get("jobId") ?? "";
        this.workers$ = this.jobsService.getJob(jobId).pipe(
            switchMap(job => {
                this.maxWorkers$.next(String(job?.numberWorkers) ?? "0");
                const assignedEmployees = job?.assignedEmployees ?? [];

                return this.employeesService.getEmployees().pipe(
                    map(employees => {
                        const assignedEmps = [];
                        for (const emp of employees){
                            const assignedEmp = assignedEmployees.find(assignedEmp => emp.userName == assignedEmp.userName);
                            if (assignedEmp){
                                Object.assign(assignedEmp, emp);
                                assignedEmps.push(assignedEmp);
                            }
                        }
                        return assignedEmps;
                    })
                );
            })
        )
    }

    constructor(
        @Inject(SessionType.Employee) private session: SessionService<Employee>,
        private route: ActivatedRoute,
        private jobsService: JobsService,
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
