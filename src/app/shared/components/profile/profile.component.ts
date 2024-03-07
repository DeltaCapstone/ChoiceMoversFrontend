import { Component, Input, } from '@angular/core';
import { BaseComponent } from '../base-component';
import { TuiAvatarModule, TuiDataListWrapperModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPhoneModule, TuiSelectModule, TuiTextareaModule } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { TuiDataListModule, TuiErrorModule } from '@taiga-ui/core';
import { CreateEmployeeRequest, Employee, EmployeeType } from '../../../models/user';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, map, of, finalize, pipe } from 'rxjs';
import { UsersService } from '../../services/users.service';

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
        phoneOther: new FormControl(""),
        phonePrimary: new FormControl(""),
    });
    user$: Observable<Employee>;

    ngOnInit() {
        this.user$ = this.usersService.getProfile();

        const userSub = this.user$.subscribe(user => {
            this.form.patchValue({
                email: user.email,
                lastName: user.lastName,
                firstName: user.firstName,
                userName: user.userName,
                phonePrimary: user.phonePrimary,
                phoneOther: user.phoneOther,
                employeeType: user.employeeType,
            });
        });
        this.subscriptions.push(userSub);
    }

    constructor(private location: Location,
        private route: ActivatedRoute,
        private usersService: UsersService) {
        super();
    }

    update() {
        const formValues = this.form.value;
        const saveSub = this.user$.pipe(
            finalize(() => this.back()),
            map(user => ({
                ...user,
                email: formValues.email ?? user.email,
                firstName: formValues.firstName ?? user.firstName,
                lastName: formValues.lastName ?? user.lastName,
                userName: formValues.userName ?? user.userName,
                phonePrimary: formValues.phonePrimary ?? user.phonePrimary,
                phoneOther: formValues.phoneOther ?? user.phoneOther,
                employeeType: (formValues.employeeType ?? user.employeeType) as EmployeeType,
            }))
        ).subscribe(newUser => {
            this.usersService.updateProfile(newUser).subscribe({
                next: (response) => {
                    console.log('User updated successfully', response);
                },
                error: (error) => {
                    console.error('Error updating user', error);
                }
            });
        });
        this.subscriptions.push(saveSub);
    }

    back() {
        this.location.back();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
