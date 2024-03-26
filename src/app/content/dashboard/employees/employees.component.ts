import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TuiTableFiltersModule, TuiTableModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiInputModule, TuiTagModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { PageComponent } from '../../../shared/components/page-component';
import { PageService } from '../../../shared/services/page.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from '../../../shared/components/profile/profile.component';
import { Employee } from '../../../models/employee';
import { EmployeesService } from '../../../shared/services/employees.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { SessionType } from '../../../models/session.model';

@Component({
    selector: 'app-employees',
    standalone: true,
    imports: [TuiTableModule, TuiTagModule, NgIf, NgFor, SearchComponent,
        TuiInputModule, TuiTableFiltersModule, TuiButtonModule,
        TuiLetModule, TuiButtonModule, TuiSvgModule, ProfileComponent,
        ReactiveFormsModule, CommonModule, TuiTextfieldControllerModule],
    templateUrl: './employees.component.html',
    styleUrl: './employees.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesComponent extends PageComponent {
    @ViewChild(SearchComponent) searchComponent!: SearchComponent<Employee>;
    subscriptions: Subscription[] = [];
    readonly columns = ["name", "email", "employeeType"];
    searchInput = new FormControl('');
    employees$: Observable<Employee[]>;
    filteredEmployees$: Observable<Employee[]>;

    ngAfterViewInit() {
        this.filteredEmployees$ = this.searchComponent.filteredItems$;
    }

    ngOnInit() {
        this.setTitle("Employees");
        this.employees$ = this.employeesService.getEmployees();
    }

    constructor(pageService: PageService, private employeesService: EmployeesService, 
        private router: Router, 
        @Inject(SessionType.Employee) private session: SessionService<Employee>) {
        super(pageService);
    }

    /** Opens the profile of the employee with the given username. If empty, it opens new employee view.**/
    openEmployee(userName: string = "") {
        this.session.guardWithAuth().subscribe(_ => {
            this.router.navigate(["/dashboard/employees/employee", userName]);
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    filterEmployees(employee: Employee, searchValue: string) {
        const fullName = `${employee.firstName} ${employee.lastName}`;
        return fullName.toLowerCase().includes(searchValue) ||
            employee.email.toLowerCase().includes(searchValue) ||
            employee.employeeType.toLowerCase().includes(searchValue)
    }
}
