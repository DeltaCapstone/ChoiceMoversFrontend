import { Component, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, combineLatest, map, switchMap, take, tap } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseComponent } from '../../base-component';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';
import { AssignedEmployee, Employee, EmployeeType } from '../../../../models/employee';
import { SessionService } from '../../../services/session.service';
import { JobsService } from '../../../services/jobs.service';
import { EmployeesService } from '../../../services/employees.service';
import { TUI_PROMPT, TuiDataListWrapperModule, TuiPromptModule, TuiSelectModule, TuiTagModule } from '@taiga-ui/kit';
import { TuiIconModule } from '@taiga-ui/experimental';
import { TuiButtonModule, TuiDataListModule, TuiDialogModule, TuiDialogService, TuiSvgModule } from '@taiga-ui/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeSessionServiceToken } from '../../../../app.config';

@Component({
    selector: 'app-job-workers',
    standalone: true,
    imports: [TuiTableModule, NgIf, NgFor, TuiLetModule, TuiIconModule, TuiButtonModule, FormsModule, ReactiveFormsModule,
         TuiLetModule, CommonModule, RouterModule, TuiTagModule, TuiPromptModule, TuiDialogModule,
        TuiSvgModule, TuiSelectModule, TuiDataListModule, TuiDataListWrapperModule],
    templateUrl: './job-workers.component.html',
    styleUrl: './job-workers.component.css'
})
export class JobWorkersComponent extends BaseComponent {
    // general state
    subscriptions: Subscription[] = [];
    jobSessionState = this.session.scheduleSessionState.jobSessionState;
    jobId: string;
    isManager$: Observable<boolean>;
    // state for table
    columns$ = new BehaviorSubject<string[]>([]);
    maxWorkers$ = new BehaviorSubject<string>("0");
    workers$: Observable<AssignedEmployee[]>;
    isFull$ = new BehaviorSubject<boolean>(false);
    displayOverride$: Observable<boolean>;
    // dialog
    employeeUsernames$ = new BehaviorSubject<string[]>([]); 
    assignDialogOpen: boolean = false;
    userNameToAssign = new FormControl("")
    

    ngOnInit() {
        this.displayOverride$ = combineLatest([
            this.jobSessionState.employeeToBoot$,
            this.isFull$
        ]).pipe(
            map(([employeeToBoot, isFull]) => !!employeeToBoot && isFull)
        )

        this.isManager$ = this.session.getUser().pipe(
            map(user => user?.employeeType == EmployeeType.Manager)
        );

        const columns = ["email", "name", "employeeType", "managerAssigned"];
        const managerSub = this.isManager$.subscribe(isManager => {
            const newColumns = isManager ? [...columns, "unassign"] : columns;
            this.columns$.next(newColumns);
        });
        this.subscriptions.push(managerSub);
        
        this.jobId = this.route.parent?.snapshot?.paramMap?.get("jobId") ?? "";
        this.workers$ = this.jobsService.getJob(this.jobId).pipe(
            switchMap(job => {
                const maxWorkers = job?.numberWorkers ?? 0;
                this.maxWorkers$.next(String(maxWorkers));
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
                        this.isFull$.next(assignedEmps.length >= maxWorkers);

                        const nonAssignedEmployees = employees.filter(emp => 
                            !assignedEmployees.some(assignedEmp => assignedEmp.userName == emp.userName)
                        )
                        this.employeeUsernames$.next(nonAssignedEmployees.map(emp => emp.userName));
                        return assignedEmps;
                    })
                );
            })
        )        
    }

    constructor(
        @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
        @Inject(EmployeeSessionServiceToken) private session: SessionService<Employee>,
        private route: ActivatedRoute,
        private jobsService: JobsService,
        private employeesService: EmployeesService,
        private router: Router,
    ) {
        super();
    }

    openEmployee(userName: string = "") {
        this.session.isUserAuthorized().subscribe(isAuthorized => { 
            if (isAuthorized){       
                this.router.navigate([`/dashboard/schedule/job/`, userName])
            }
            else {
                this.session.redirectToLogin();
            }
        });
    }

    unassign(employee: AssignedEmployee){
        this.dialogs.open<boolean>(TUI_PROMPT, {
            label: 'Warning',
            data: {
              content: `Are you sure you want to unassign ${employee.firstName} ${employee.lastName}?`,
              yes: 'Yes',
              no: 'No',
            },
        }).subscribe(yes => {
            if (yes){
                this.jobsService.unassign(employee.userName, this.jobId).pipe(take(1)).subscribe(_ => 
                    this.session.refreshJobSessionState())
            }
        });
    }

    toggleAssignDialog() {
        this.assignDialogOpen = true;
    }
    
    assign(){
        const userName = this.userNameToAssign.value;
        if (userName){
            this.jobsService.assign(userName, this.jobId).pipe(take(1)).subscribe(_ =>
                this.session.refreshJobSessionState());
            this.userNameToAssign.patchValue("");
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
