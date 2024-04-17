import { Component, Injector } from '@angular/core';
import { BaseComponent } from '../base-component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { SessionService } from '../../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiErrorModule, TuiLoaderModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiValidationError } from '@taiga-ui/cdk';
import { BehaviorSubject, Observable, Subscription, map, take } from 'rxjs';
import { Employee } from '../../../models/employee';
import { SessionType } from '../../../models/session.model';
import { Customer } from '../../../models/customer.model';
import { FeatureService } from '../../services/feature.service';
import { CustomerSessionServiceToken, EmployeeSessionServiceToken } from '../../../app.config';


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
    apiUrl: string;
    subscriptions: Subscription[] = [];
    session: SessionService<Employee | Customer>;

    constructor(
        private router: Router, private _route: ActivatedRoute, private _feature: FeatureService, private _injector: Injector) {
        super();
        this.apiUrl = this._feature.getFeatureValue("api").url
    }

    invalidCredentials = new BehaviorSubject(false);
    credentialsError = new TuiValidationError("Invalid credentials");

    readonly form = new FormGroup({
        userName: new FormControl("", [Validators.required]),
        passwordPlain: new FormControl("", [Validators.required]),
    });

    /**
     * Called on component initialization. Uses the SessionType to determine which login route to provide.
     */
    ngOnInit() {
        const sessionType = this._route.snapshot.paramMap.get("type") as SessionType ?? "";
        if (sessionType === SessionType.Customer) {
            this.session = this._injector.get(CustomerSessionServiceToken) as SessionService<Customer | Employee>;
        }
        else {
            this.session = this._injector.get(EmployeeSessionServiceToken) as SessionService<Customer | Employee>;
        }
    }

    /**
     * Login function that provides login functionality to the website. Validates user credentials and attempts login depending on SessionType
     * @returns An AbstractControl if the form field is invalid; nothing otherwise
     */
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
        this.session.login(userName, password).pipe(take(1)).subscribe(success => {
            if (success) {
                if (this.session.getType() == SessionType.Employee) {
                    this.router.navigate(["dashboard"]);
                }
                else {
                    this.router.navigate(["home/customer-home"]);
                }
            }
        });
    }

    /**
     * Getter for computedCredentialsError
     * @returns An observable of type TuiValidationError if an credentials are invalid; null otherwise
     */
    get computedCredentialsError(): Observable<TuiValidationError | null> {
        return this.invalidCredentials.asObservable().pipe(
            map(invalidCredentials => invalidCredentials ? this.credentialsError : null)
        );
    }

    /**
     * Called on component destruction. Unsubscribes from all subscriptions.
     */
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    /**
     * Function that navigates to the customer-signup component if the sign up button is clicked
     */
    navigateToCustomerSignup() {
        this.router.navigate(['/home/customer-signup']);
    }
}
