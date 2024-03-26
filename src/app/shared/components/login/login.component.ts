import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '../base-component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';
import { TuiErrorModule, TuiLoaderModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiValidationError } from '@taiga-ui/cdk';
import { BehaviorSubject, Observable, Subscription, map, of, switchMap } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, TuiInputModule, TuiInputPasswordModule,
        TuiErrorModule, TuiFieldErrorPipeModule, CommonModule, TuiLoaderModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: {
                required: "Required"
            }
        }
    ],
})
export class LoginComponent extends BaseComponent {
    subscriptions: Subscription[] = [];
    constructor(private session: SessionService,
        private router: Router) {
        super();
    }

    invalidCredentials = new BehaviorSubject(false);
    credentialsError = new TuiValidationError("Invalid credentials");

    readonly form = new FormGroup({
        userName: new FormControl("", [Validators.required]),
        passwordPlain: new FormControl("", [Validators.required]),
    });

    login() {
        // validate
        const firstInvalidControl = Object.keys(this.form.controls).find(field => {
            const control = this.form.get(field);
            return control?.invalid;
        });

        if (firstInvalidControl) {
            const control = this.form.get(firstInvalidControl);
            control?.markAsTouched({ onlySelf: true });
        }
        if (!this.form.valid) {
            return;
        }

        // attempt login
        const userName = this.form.value.userName ?? "";
        const password = this.form.value.passwordPlain ?? "";

        const loginSub = this.session.login(userName, password).subscribe(success => {
            if (success) {
                this.router.navigate(["dashboard"]);
            }
            else {
                this.invalidCredentials.next(true);
            }
        });
        this.subscriptions.push(loginSub);
    }

    get computedCredentialsError(): Observable<TuiValidationError | null> {
        return this.invalidCredentials.asObservable().pipe(
            map(invalidCredentials => invalidCredentials ? this.credentialsError : null)
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
