import { Component } from '@angular/core';
import { BaseComponent } from '../base-component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [FormsModule, ReactiveFormsModule, TuiInputModule, TuiInputPasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent extends BaseComponent {
    constructor(private session: SessionService, private router: Router){
        super();
    }
    
    readonly form = new FormGroup({
        userName: new FormControl(""),
        passwordPlain: new FormControl(""),
    });

    login(){
        this.session.setUser("emp_linda_k");
        this.router.navigate(["/dashboard"]);
    }
}
