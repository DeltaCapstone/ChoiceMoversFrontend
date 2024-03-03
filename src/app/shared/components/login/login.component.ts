import { Component } from '@angular/core';
import { BaseComponent } from '../base-component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [FormsModule, ReactiveFormsModule, TuiInputModule, TuiInputPasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent extends BaseComponent {
    readonly form = new FormGroup({
        userName: new FormControl(""),
        passwordPlain: new FormControl(""),
    });
}
