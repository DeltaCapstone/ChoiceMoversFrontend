import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base-component';
import { TuiAvatarModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPhoneModule, TuiTextareaModule } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiErrorModule } from '@taiga-ui/core';
import { User } from '../../../models/user';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
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
    user$: Observable<User>;
    ngOnInit() {
        const userName: string | null = this.route.snapshot.paramMap.get('userName');
        if (userName){
            this.user$ = this.usersService.getEmployee(userName);   
        }
    }

    constructor(private route: ActivatedRoute, private usersService: UsersService) {
        super();
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
