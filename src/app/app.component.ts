import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [SidebarComponent, TuiRootModule, TuiDialogModule, TuiAlertModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}]
})
export class AppComponent {
}
