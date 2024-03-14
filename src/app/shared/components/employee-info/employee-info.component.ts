import { Component, Input, } from '@angular/core';
import { BaseComponent } from '../base-component';
import { TuiAvatarModule, TuiDataListWrapperModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPhoneModule, TuiSelectModule, TuiTextareaModule } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { TuiDataListModule, TuiErrorModule } from '@taiga-ui/core';
import { EmployeeCreateRequest, Employee, EmployeeType } from '../../../models/user';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, map, of } from 'rxjs';
import { EmployeesService } from '../../services/employees.service';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-employee-info',
    standalone: true,
    imports: [TuiAvatarModule, ReactiveFormsModule, TuiInputModule, TuiTextareaModule, TuiDataListModule, TuiSelectModule, TuiDataListWrapperModule,
        CommonModule, TuiErrorModule, TuiFieldErrorPipeModule, TuiInputPhoneModule],
    templateUrl: './employee-info.component.html',
    styleUrl: './employee-info.component.css'
})
export class EmployeeInfoComponent extends BaseComponent {
    subscriptions: Subscription[] = [];
    employeeTypes: String[] = Object.values(EmployeeType);
    isNew = false;
    
    readonly form = new FormGroup({
        userName: new FormControl(""),
        firstName: new FormControl(""),
        lastName: new FormControl(""),
        email: new FormControl(""),
        employeeType: new FormControl(""),
        // phoneOther: new FormControl([]),
        phonePrimary: new FormControl(""),
        employeePriority: new FormControl(0),
    });
    user$: Observable<Employee | undefined>;

    ngOnInit() {
        const userName: string | null = this.route.snapshot.paramMap.get('userName');
        if (userName) { // get this employee and set the form values
            this.user$ = this.employeesService.getEmployee(userName);
            
            const userSub = this.user$.subscribe(user => {
                this.form.patchValue({
                    email: user?.email ?? "",
                    lastName: user?.lastName ?? "",
                    firstName: user?.firstName ?? "",
                    userName: user?.userName ?? "",
                    phonePrimary: user?.phonePrimary ?? "",
                    // phoneOther: user?.phoneOther ?? [],
                    employeeType: user?.employeeType ?? "",
                    employeePriority: user?.employeePriority ?? 0,
                });
            });
            this.subscriptions.push(userSub);
        }
        else { // no user, fill in default values
            this.form.patchValue({
                employeeType: EmployeeType.FullTime
            });
            this.user$ = of(new Employee);
            this.isNew = true;
        }
    }

    constructor(private location: Location,
                private route: ActivatedRoute,
                private session: SessionService,
                private employeesService: EmployeesService) {
        super();
    }

    save() {
        this.session.guardWithAuth(() => {
            const formValues = this.form.value;
            const saveSub = this.user$.pipe(
                map(user => ({
                    ...user,
                    email:  formValues.email ?? user?.email ?? "",
                    firstName: formValues.firstName ?? user?.firstName ?? "",
                    lastName: formValues.lastName ?? user?.lastName ?? "",
                    userName: formValues.userName ?? user?.userName ?? "",
                    phonePrimary: formValues.phonePrimary ?? user?.phonePrimary ?? "",
                    phoneOther: [],
                    employeeType: (formValues.employeeType ?? user?.employeeType ?? "") as EmployeeType,
                    employeePriority: formValues.employeePriority ?? user?.employeePriority ?? 0,
                }))
            ).subscribe(newUser => {
                if (this.isNew){ // CREATE NEW EMPLOYEE
                    const createEmployeeRequest: EmployeeCreateRequest = {
                        ...newUser,
                        phoneOther: [],
                        employeePriority: 0,
                        passwordPlain: "test1234"
                    };
                
                    this.employeesService.createEmployee(createEmployeeRequest).subscribe({
                        next: (response) => {
                            console.log('User created successfully', response);
                            this.back();
                        },
                        error: (error) => {
                            console.error('Error creating user', error);
                            this.back();
                        }
                    });                
                    this.isNew = false;
                }
                else { // UPDATE EXISTING EMPLOYEE
                    this.employeesService.updateEmployee(newUser).subscribe({
                        next: (response) => {
                            console.log('User updated successfully', response);
                            this.back();
                        },
                        error: (error) => {
                            console.error('Error updating user', error);
                            this.back();
                        }
                    });
                }
            });
            this.subscriptions.push(saveSub);
        }).subscribe();
    }

    delete() {
        this.session.guardWithAuth(() => {
            const userName: string | null = this.route.snapshot.paramMap.get('userName');
            if (!userName)
                return;
        
            this.employeesService.deleteEmployee(userName).subscribe({
                next: (response) => {
                    console.log('User deleted successfully', response);
                    this.back();
                },
                error: (error) => {
                    console.error('Error deleting user', error);
                    this.back();
                }
            });                
        }).subscribe();
    }

    back() {
        this.location.back();
    }

    ngOnDestroy(){
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
