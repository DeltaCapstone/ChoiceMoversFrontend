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
import { User } from '../../../models/user';
import { UsersService } from '../../../shared/services/users.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';

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
    employees$ = new BehaviorSubject<User[]>([]);
    filteredEmployees$ = new Observable<User[]>;
    openedEmployee: User | null = null;
    
    ngOnInit() {
        this.setTitle("Employees");
        // Fetch all employees once
        this.usersService.getEmployees().subscribe(employees => this.employees$.next(employees));
        
        this.filteredEmployees$ = combineLatest([this.employees$, this.searchInput.valueChanges.pipe(startWith(''))]).pipe(
            debounceTime(100),
            map(([employees, filterValue]) => employees.filter(employee =>
                (`${employee.firstName} ${employee.lastName}`).toLowerCase().includes((filterValue ?? "").toLowerCase()) ||
                employee.email.toLowerCase().includes((filterValue ?? "").toLowerCase())
            ))
        );
    }

    constructor(pageService: PageService, private usersService: UsersService) {
        super(pageService);
    }

    openEmployee(i: number){
        this.employees$.pipe(
            map(employees => employees[i])
        ).subscribe(employee => this.openedEmployee = employee);
    }

    searchInput = new FormControl('');

    readonly columns = ["name", "email"];
}
