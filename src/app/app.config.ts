import { provideAnimations } from "@angular/platform-browser/animations";
import { TuiRootModule } from "@taiga-ui/core";
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        importProvidersFrom(HttpClientModule, TuiRootModule)
    ]
};
