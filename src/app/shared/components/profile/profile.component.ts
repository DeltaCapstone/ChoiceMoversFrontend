import { Component, } from '@angular/core';
import { BaseComponent } from '../base-component';
import { TuiAvatarModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPhoneModule, TuiTextareaModule } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { TuiErrorModule } from '@taiga-ui/core';
import { User } from '../../../models/user';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [TuiAvatarModule, ReactiveFormsModule, TuiInputModule, TuiTextareaModule,
        CommonModule, TuiErrorModule, TuiFieldErrorPipeModule, TuiInputPhoneModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent extends BaseComponent {
    readonly form = new FormGroup({
        name: new FormControl(""),
        phone: new FormControl(""),
        zip: new FormControl(""),
        city: new FormControl(""),
        state: new FormControl(""),
        address: new FormControl(""),
        notes: new FormControl(""),
    });
    user$: Observable<User>;

    ngOnInit() {
        const userName: string | null = this.route.snapshot.paramMap.get('userName');
        if (userName) {
            console.log(userName);
            this.user$ = this.usersService.getEmployee(userName);
            this.user$.subscribe(user => {
                this.form.patchValue({
                    name: `${user.firstName} ${user.lastName}`,
                    phone: user.phonePrimary
                });
            });
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
            take(1),
            map(user => ({
                ...user,
                firstName: formValues.name?.split(" ")[0] ?? user.firstName,
                lastName: formValues.name?.split(" ")[1] ?? user.lastName,
                phonePrimary: formValues.phone ?? user.phonePrimary,
            }))
        ).subscribe(updatedUser => {
            console.log(updatedUser);
            this.usersService.putEmployee(updatedUser).subscribe({
                next: (response) => {
                    console.log('User updated successfully', response);
                },
                error: (error) => {
                    console.error('Error updating user', error);
                }
            });
        });
    }

    back() {
        this.location.back();
    }
}
