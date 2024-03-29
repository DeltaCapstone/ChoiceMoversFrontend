import { provideAnimations } from "@angular/platform-browser/animations";
import { TuiDialogModule, TuiRootModule } from "@taiga-ui/core";
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Router, provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtModule } from "@auth0/angular-jwt";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { Employee } from "./models/employee";
import { SessionServiceConfig, SessionType } from "./models/session.model";
import { EmployeesService } from "./shared/services/employees.service";
import { SessionService } from "./shared/services/session.service";
import { FeatureService } from "./shared/services/feature.service";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(
            withInterceptorsFromDi()
        ),
        importProvidersFrom(HttpClientModule, TuiRootModule, TuiDialogModule,
            JwtModule.forRoot({
                config: {
                    tokenGetter: () => sessionStorage.getItem("accessToken"),
                    allowedDomains: ["localhost:8080"],
                },
            },
        )), provideAnimationsAsync(),
        {
            provide: SessionType.Employee,
            useFactory: (http: HttpClient, featureService: FeatureService, router: Router, employeesService: EmployeesService) => {
                const config = new SessionServiceConfig(
                    () => employeesService.getProfile(), 
                    'portal/login',
                    SessionType.Employee
                );
                return new SessionService<Employee>(http, featureService, router, config);
            },
            deps: [HttpClient, FeatureService, Router, EmployeesService]
        },
    ]
};
