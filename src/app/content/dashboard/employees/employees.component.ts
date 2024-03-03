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
import { UsersService } from '../../../shared/services/users.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, startWith, debounceTime, take } from 'rxjs/operators';
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
    employees$ = new BehaviorSubject<Employee[]>([]);
    filteredEmployees$ = new Observable<Employee[]>;
    
    ngOnInit() {
        this.setTitle("Employees");
        // Fetch all employees once
        this.usersService.getEmployees().subscribe(employees => {this.employees$.next(employees)});
        
        this.filteredEmployees$ = combineLatest([this.employees$, this.searchInput.valueChanges.pipe(startWith(''))]).pipe(
            debounceTime(100),
            map(([employees, filterValue]) => employees.filter(employee =>
                (`${employee.firstName} ${employee.lastName}`).toLowerCase().includes((filterValue ?? "").toLowerCase()) ||
                employee.email.toLowerCase().includes((filterValue ?? "").toLowerCase())
            ))
        );
    }

    constructor(pageService: PageService, private usersService: UsersService, private router: Router) {
        super(pageService);
    }

    openEmployee(i?: number){
        if (i){
            this.employees$.pipe(
                map(employees => employees[i])
            ).subscribe(employee => this.router.navigate(["/dashboard/employees/profile", employee.userName]));   
        }
        else {
            this.router.navigate(["/dashboard/employees/profile"]);
        }
    }

    searchInput = new FormControl('');

    readonly columns = ["name", "email", "employeeType"];
}
