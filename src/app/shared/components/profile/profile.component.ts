import { Component, Input, } from '@angular/core';
import { BaseComponent } from '../base-component';
import { TuiAvatarModule, TuiDataListWrapperModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPhoneModule, TuiSelectModule, TuiTextareaModule } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { TuiDataListModule, TuiErrorModule } from '@taiga-ui/core';
import { Employee, EmployeeProfileUpdateRequest, EmployeeType } from '../../../models/user';
import { Observable, Subscription, map, finalize, take } from 'rxjs';
import { EmployeesService } from '../../services/employees.service';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [TuiAvatarModule, ReactiveFormsModule, TuiInputModule, TuiTextareaModule, TuiDataListModule, TuiSelectModule, TuiDataListWrapperModule,
              CommonModule, TuiErrorModule, TuiFieldErrorPipeModule, TuiInputPhoneModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent extends BaseComponent {
    subscriptions: Subscription[] = [];
    employeeTypes: String[] = Object.values(EmployeeType);

    readonly form = new FormGroup({
        userName: new FormControl(""),
        firstName: new FormControl(""),
        lastName: new FormControl(""),
        email: new FormControl(""),
        employeeType: new FormControl(""),
        // phoneOther: new FormControl([]),
        phonePrimary: new FormControl("")
    });
    user$: Observable<Employee | undefined>;

    ngOnInit() {
        this.user$ = this.employeesService.getProfile();

        const userSub = this.user$.subscribe(user => {
            if (user) {
                this.form.patchValue({
                    email: user.email,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    userName: user.userName,
                    phonePrimary: user.phonePrimary,
                    // phoneOther: user.phoneOther,
                    employeeType: user.employeeType
                });
            }
        });
        this.subscriptions.push(userSub);
    }

    constructor(private location: Location, private session: SessionService,
        private employeesService: EmployeesService) {
        super();
    }

    update() {
        this.session.guardWithAuth(() => {
            const formValues = this.form.value;
            this.user$.pipe(
                finalize(() => this.back()),
                map(user => ({
                    email: formValues.email ?? user?.email ?? "",
                    firstName: formValues.firstName ?? user?.firstName ?? "",
                    lastName: formValues.lastName ?? user?.lastName ?? "",
                    userName: formValues.userName ?? user?.userName ?? "",
                    phonePrimary: formValues.phonePrimary ?? user?.phonePrimary ?? "",
                    phoneOther: [],
                    employeeType: (formValues.employeeType ?? user?.employeeType ?? "") as EmployeeType,
                } as EmployeeProfileUpdateRequest))
            ).subscribe(newUser => {
                this.employeesService.updateProfile(newUser).subscribe({
                    next: (response) => {
                        console.log('Profile updated successfully', response);
                    },
                    error: (error) => {
                        console.error('Error updating profile', error);
                    }
                });
            });
        }).pipe((take(1))).subscribe();
    }

    back() {
        this.location.back();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
