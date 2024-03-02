import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base-component';
import { TuiAvatarModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPhoneModule, TuiTextareaModule } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiErrorModule } from '@taiga-ui/core';
import { User } from '../../../models/user';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [TuiAvatarModule, ReactiveFormsModule, TuiInputModule, TuiTextareaModule,
              CommonModule, TuiErrorModule, TuiFieldErrorPipeModule, TuiInputPhoneModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent extends BaseComponent {
    private _user: User;
    
    @Input()
    get user(): User { return this._user; }
    set user(user: User) {
        this._user = user;
        if (user){
            this.form.patchValue({
                name: `${this._user.firstName} ${this._user.lastName}`,
                phone: this._user.phonePrimary,
            });   
        }
    }
    
    readonly form = new FormGroup({
        name: new FormControl(""),
        phone: new FormControl(""),
        zip: new FormControl(""),
        city: new FormControl(""),
        state: new FormControl(""),
        address: new FormControl(""),
        notes: new FormControl(""),
    });
}
