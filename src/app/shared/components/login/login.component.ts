import { Component, Inject, InjectionToken, Injector, inject } from '@angular/core';
import { BaseComponent } from '../base-component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { SessionService } from '../../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiErrorModule, TuiLoaderModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiValidationError } from '@taiga-ui/cdk';
import { BehaviorSubject, Observable, Subscription, map, switchMap, tap, catchError, of } from 'rxjs';
import { Employee } from '../../../models/employee';
import { SessionServiceConfig, SessionType } from '../../../models/session.model';
import { Customer } from '../../../models/customer.model';
import { LoginRequest } from '../../../models/employee';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from '../../services/feature.service';


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
    loginRoute: string;
    subscriptions: Subscription[] = [];
    session: SessionService<Employee | Customer>;
    sessionType: SessionType;

    constructor(
        private router: Router, private _route: ActivatedRoute, private _http: HttpClient, private _feature: FeatureService, private _injector: Injector) {
        super();
        this.apiUrl = this._feature.getFeatureValue("api").url
        const type = this._route.snapshot.paramMap.get("type") as SessionType ?? "";
        console.log('Type is:', type);
        if (type === SessionType.Customer) {
            this.session = <SessionService<Customer>>this._injector.get(SessionService<Customer>);
            this.loginRoute = 'login';
            this.sessionType = type;
        } else {
            this.session = <SessionService<Employee>>this._injector.get(SessionService<Employee>);
            this.loginRoute = 'portal/login';
            this.sessionType = type;
        }
        console.log('Type is:', type);
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
        const loginRequest: LoginRequest = {
            userName: userName,
            passwordPlain: password
        };
        console.log('Login request is:', loginRequest);

        const loginSub = this._http.post<LoginRequest>(`${this.apiUrl}/${this.loginRoute}`, loginRequest).pipe(
            switchMap((res: any) => {
                const accessToken = res["accessToken"];
                this.session.setStorageValues(accessToken, res["accessTokenExpiresAt"], res["refreshToken"], res["refreshTokenExpiresAt"], userName);
                if (accessToken) {
                    return this.session.getUser().pipe(
                        tap(profile => {
                            if (profile) {
                                this.session.setUser(of(profile), this.sessionType);
                            }
                        }),
                        map(_ => true),
                        catchError(err => {
                            console.error(err);
                            this.session.logout();
                            return of(false)
                        })
                    );
                }
                else {
                    return of(false);
                }
            }),
            // Catch any error that occurs during the requestLogin or if switchMap fails
            catchError(() => of(false))
        ).subscribe(success => {
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
