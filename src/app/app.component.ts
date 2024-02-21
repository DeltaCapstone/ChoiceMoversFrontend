import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TUI_SANITIZER } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { LayoutComponent } from "./shared/components/layout/layout.component";
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [SidebarComponent, TuiRootModule, LayoutComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }]
})
export class AppComponent {
}

