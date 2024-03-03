import { Component, } from '@angular/core';
import { BaseComponent } from '../base-component';
import { TuiAvatarModule, TuiDataListWrapperModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPhoneModule, TuiSelectModule, TuiTextareaModule } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { TuiDataListModule, TuiErrorModule } from '@taiga-ui/core';
import { CreateEmployeeRequest, Employee, EmployeeType, getEmployeeTypes } from '../../../models/user';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, of } from 'rxjs';
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
    employeeTypes: String[] = getEmployeeTypes();
    isNew = false;
    
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
        const userName: string | null = this.route.snapshot.paramMap.get('userName');
        if (userName) {
            this.user$ = this.usersService.getEmployee(userName);
            this.user$.subscribe(user => {
                this.form.patchValue({
                    lastName: user.firstName,
                    firstName: user.lastName,
                    userName: user.userName,
                    phonePrimary: user.phonePrimary,
                    phoneOther: user.phoneOther,
                    employeeType: user.employeeType,
                });
            });
        }
        else {
            this.user$ = of(new Employee);
            this.isNew = true;
        }
    }

    constructor(private location: Location,
                private route: ActivatedRoute,
                private usersService: UsersService) {
        super();
    }

    save() {
        const formValues = this.form.value;
        this.user$.pipe(
            map(user => ({
                ...user,
                email:  formValues.email ?? user.email,
                firstName: formValues.firstName ?? user.firstName,
                lastName: formValues.lastName ?? user.lastName,
                userName: formValues.userName ?? user.userName,
                phonePrimary: formValues.phonePrimary ?? user.phonePrimary,
                phoneOther: formValues.phoneOther ?? user.phoneOther,
                employeeType: (formValues.employeeType ?? user.employeeType) as EmployeeType,
            }))
        ).subscribe(newUser => {
            if (this.isNew){
                const createEmployeeRequest: CreateEmployeeRequest = {
                    ...newUser,
                    phoneOther: null,
                    passwordPlain: "test1234"
                };
                
                this.usersService.createEmployee(createEmployeeRequest).subscribe({
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
            else {
                this.usersService.updateEmployee(newUser).subscribe({
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
    }

    back() {
        this.location.back();
    }
}
