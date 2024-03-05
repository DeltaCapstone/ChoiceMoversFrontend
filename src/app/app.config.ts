import { provideAnimations } from "@angular/platform-browser/animations";
import { TuiRootModule } from "@taiga-ui/core";
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtModule } from "@auth0/angular-jwt";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(
            withInterceptorsFromDi()
        ),
        importProvidersFrom(HttpClientModule, TuiRootModule,
            JwtModule.forRoot({
                config: {
                    tokenGetter: () => sessionStorage.getItem("accessToken"),
                    allowedDomains: ["localhost:8080"],
                },
            },
        )), provideAnimationsAsync()
    ]
};
