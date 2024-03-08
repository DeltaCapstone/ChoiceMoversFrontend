import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TuiTableFiltersModule, TuiTableModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiInputModule, TuiTagModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { PageComponent } from '../../../shared/components/page-component';
import { PageService } from '../../../shared/services/page.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from '../../../shared/components/profile/profile.component';
import { Employee } from '../../../models/user';
import { EmployeesService } from '../../../shared/services/employees.service';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, startWith, debounceTime, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employees',
    standalone: true,
    imports: [TuiTableModule, TuiTagModule, NgIf, NgFor,
        TuiInputModule, TuiTableFiltersModule, TuiButtonModule,
        TuiLetModule, TuiButtonModule, TuiSvgModule, ProfileComponent,
        ReactiveFormsModule, CommonModule, TuiTextfieldControllerModule],
    templateUrl: './employees.component.html',
    styleUrl: './employees.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesComponent extends PageComponent {
    subscriptions: Subscription[] = [];
    employees$: Observable<Employee[]>;
    filteredEmployees$: Observable<Employee[]> = new Observable<Employee[]>;

    ngOnInit() {
        this.setTitle("Employees");
        // Fetch all employees once
        this.employees$ = this.employeesService.getEmployees();

        this.filteredEmployees$ = combineLatest([this.employees$, this.searchInput.valueChanges.pipe(startWith(''))]).pipe(
            debounceTime(100),
            map(([employees, filterValue]) => employees.filter(employee => {
                filterValue = (filterValue ?? "").toLowerCase();
                
                const fullName = `${employee.firstName} ${employee.lastName}`;
                return fullName.toLowerCase().includes(filterValue) ||
                    employee.email.toLowerCase().includes(filterValue) ||
                    employee.employeeType.toLowerCase().includes(filterValue)
            }))
        );
    }

    constructor(pageService: PageService, private employeesService: EmployeesService, private router: Router) {
        super(pageService);
    }

    /** Opens the profile of the employee with the given username. If empty, it opens new employee view.**/
    openEmployee(userName: string = "") {
        this.router.navigate(["/dashboard/employees/employee", userName])
    }

    searchInput = new FormControl('');

    readonly columns = ["name", "email", "employeeType"];

    ngOnDestroy(){
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
