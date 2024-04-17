import { Component } from '@angular/core';
import { BaseComponent } from '../base-component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule, TuiInputPhoneModule } from '@taiga-ui/kit';
import { TuiErrorModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { TuiValidationError } from '@taiga-ui/cdk';
import { EmployeesService } from '../../services/employees.service';
import { EmployeeCreateRequest } from '../../../models/employee';

@Component({
  selector: 'app-employee-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TuiInputModule, TuiInputPasswordModule,
    TuiErrorModule, TuiFieldErrorPipeModule, CommonModule, TuiInputPhoneModule],
  templateUrl: './employee-signup.component.html',
  styleUrl: './employee-signup.component.css',
  providers: [
      {
          provide: TUI_VALIDATION_ERRORS,
          useValue: {
              required: "Required"
          }
      }
  ],
})
export class EmployeeSignupComponent extends BaseComponent {
  readonly form = new FormGroup({
      userName: new FormControl("", [Validators.required]),
      passwordPlain: new FormControl("", [Validators.required]),
      passwordPlainConfirm: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      phonePrimary: new FormControl("", [Validators.required]),
  });
  token: string | null;

  invalidCredentials = new BehaviorSubject(false);
  credentialsError = new TuiValidationError("Invalid credentials");
  
  ngOnInit(){
    this.token = this.route.snapshot.paramMap.get("token");
    if (this.token){
      const email = this.parseJwt(this.token).email;
      this.form.patchValue({
        email: email
      });
    }
  }
  
  constructor(private route: ActivatedRoute, private employeesService: EmployeesService, private router: Router) {
    super();
  }

  signUp(){
    // validate
    const firstInvalidControl = Object.keys(this.form.controls).find(field => {
        const control = this.form.get(field);
        return control?.invalid;
    });

    if (firstInvalidControl) {
        const control = this.form.get(firstInvalidControl);
        control?.markAsTouched({ onlySelf: true });
    }

    if (!this.token){
      return;
    }

    const employeeCreateRequest: EmployeeCreateRequest = {
        userName: this.form.value.userName ?? "",
        passwordPlain: this.form.value.passwordPlain ?? "",
        email: this.form.value.email ?? "",
        firstName: this.form.value.firstName ?? "",
        lastName: this.form.value.firstName ?? "",
        phonePrimary: this.form.value.phonePrimary ?? "",
        phoneOther1: "",
        phoneOther2: ""
    };
    this.employeesService.signUp(employeeCreateRequest, this.token).subscribe({
      next: (response: any) => {
          console.log('User created', response);
          this.router.navigate(["dashboard"]);
      },
      error: (error) => {
          console.error('Error creating user', error);
      }
    })
  }

  parseJwt(token: string){
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join(''));

      return JSON.parse(jsonPayload);
  }
  
  get computedCredentialsError(): Observable<TuiValidationError | null> {
      return this.invalidCredentials.asObservable().pipe(
          map(invalidCredentials => invalidCredentials ? this.credentialsError : null)
      );
  }
}
