import { Component, Inject, Input, } from '@angular/core';
import { BaseComponent } from '../base-component';
import { TuiAvatarModule, TuiDataListWrapperModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputNumberModule, TuiInputPhoneModule, TuiSelectModule, TuiTextareaModule } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { TuiDataListModule, TuiErrorModule, TuiSvgModule } from '@taiga-ui/core';
import { Employee, EmployeeType, EmployeeTypePriorityRequest } from '../../../models/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, map, of } from 'rxjs';
import { EmployeesService } from '../../services/employees.service';
import { SessionService } from '../../services/session.service';
import { EmployeeSessionServiceToken } from '../../../app.config';

@Component({
    selector: 'app-employee-info',
    standalone: true,
    imports: [TuiAvatarModule, ReactiveFormsModule, TuiInputModule, TuiTextareaModule, TuiDataListModule, TuiSelectModule, TuiDataListWrapperModule,
        CommonModule, TuiErrorModule, TuiFieldErrorPipeModule, TuiInputPhoneModule, TuiSvgModule,
        TuiInputNumberModule],
    templateUrl: './employee-info.component.html',
    styleUrl: './employee-info.component.css'
})
export class EmployeeInfoComponent extends BaseComponent {
    @Input() readOnly: boolean;
    isManager$: Observable<boolean>;
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
        employeePriority: new FormControl(3),
    });
    user$: Observable<Employee | undefined>;

    ngOnInit() {
        // check if we are at a readOnly route
        this.readOnly = !!this.route.snapshot.url.find(seg => seg.path.includes("workers"));
        this.isManager$ = this.session.getUser().pipe(
            map(user => user?.employeeType == EmployeeType.Manager)
        );
        const userName: string | null = this.route.snapshot.paramMap.get('userName');
        if (userName) { // get this employee and set the form values
            this.user$ = this.employeesService.getEmployee(userName);

            const userSub = this.user$.subscribe(user => {
                if (!user) return;
                this.form.patchValue({
                    email: user.email,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    userName: user.userName,
                    phonePrimary: user.phonePrimary,
                    // phoneOther: user.phoneOther,
                    employeeType: user.employeeType,
                    employeePriority: user.employeePriority,
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
        private router: Router,
        @Inject(EmployeeSessionServiceToken) private session: SessionService<Employee>,
        private employeesService: EmployeesService) {
        super();
    }

    save() {
        this.session.isUserAuthorized().subscribe(isAuthorized => {
            if (!isAuthorized){
                this.session.redirectToLogin();
            }

            const formValues = this.form.value;
            const saveSub = this.user$.pipe(
                map(user => ({
                    ...user,
                    email: formValues.email ?? user?.email ?? "",
                    firstName: formValues.firstName ?? user?.firstName ?? "",
                    lastName: formValues.lastName ?? user?.lastName ?? "",
                    userName: formValues.userName ?? user?.userName ?? "",
                    phonePrimary: formValues.phonePrimary ?? user?.phonePrimary ?? "",
                    phoneOther: [],
                    employeeType: (formValues.employeeType ?? user?.employeeType ?? "") as EmployeeType,
                    employeePriority: formValues.employeePriority ?? user?.employeePriority ?? 3,
                }))
            ).subscribe(newUser => {
                if (this.isNew) { // CREATE NEW EMPLOYEE
                    this.employeesService.createEmployee(newUser.email, newUser.employeePriority, newUser.employeeType).subscribe({
                        next: (response: any) => {
                            console.log('User create email sent', response);
                            let splitUrl: Array<string> = response.url.split("/");
                            splitUrl.shift();
                            const token = splitUrl.pop();
                            const route = splitUrl.join("/");
                            this.router.navigate([route, token])
                            // this.back();
                        },
                        error: (error) => {
                            console.error('Error creating user', error);
                            this.back();
                        }
                    });
                    this.isNew = false;
                }
                else { // UPDATE EXISTING EMPLOYEE
                    const updateRequest: EmployeeTypePriorityRequest = {
                        userName: newUser.userName,
                        employeeType: newUser.employeeType,
                        employeePriority: newUser.employeePriority
                    };
                    console.log(updateRequest);
                    this.employeesService.updateEmployee(updateRequest).subscribe({
                        next: (response) => {
                            console.log('Employee updated successfully', response);
                            this.back();
                        },
                        error: (error) => {
                            console.error('Error updating employee', error);
                            this.back();
                        }
                    });
                }
            });
            this.subscriptions.push(saveSub);
        });
    }

    delete() {
        this.session.isUserAuthorized().subscribe(isAuthorized => {
            if (!isAuthorized){
                this.session.redirectToLogin();
                return;
            }
            
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
        });
    }

    back() {
        this.location.back();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
