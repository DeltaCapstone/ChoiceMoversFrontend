import { Component, Input, } from '@angular/core';
import { BaseComponent } from '../base-component';
import { TuiAvatarModule, TuiDataListWrapperModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPhoneModule, TuiSelectModule, TuiTextareaModule } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { TuiDataListModule, TuiErrorModule } from '@taiga-ui/core';
import { CreateEmployeeRequest, Employee, EmployeeType } from '../../../models/user';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, map, of } from 'rxjs';
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
    @Input() isSignedInUser!: boolean;
    subscriptions: Subscription[] = [];
    employeeTypes: String[] = Object.values(EmployeeType);
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
        if (userName) { // get this employee and set the form values
            this.user$ = this.isSignedInUser ?
                this.usersService.getProfile() :
                this.usersService.getEmployee(userName);
            
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
                private usersService: UsersService) {
        super();
    }

    save() {
        const formValues = this.form.value;
        const saveSub = this.user$.pipe(
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
            if (this.isNew){ // CREATE NEW EMPLOYEE
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
            else { // UPDATE EXISTING EMPLOYEE
                const update = this.isSignedInUser ?
                    this.usersService.updateProfile.bind(this.usersService) :
                    this.usersService.updateEmployee.bind(this.usersService);
                
                update(newUser).subscribe({
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
    }

    delete() {
        const userName: string | null = this.route.snapshot.paramMap.get('userName');
        if (!userName)
            return;
        
        this.usersService.deleteEmployee(userName).subscribe({
            next: (response) => {
                console.log('User deleted successfully', response);
                this.back();
            },
            error: (error) => {
                console.error('Error deleting user', error);
                this.back();
            }
        });                
    }

    back() {
        this.location.back();
    }

    ngOnDestroy(){
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
