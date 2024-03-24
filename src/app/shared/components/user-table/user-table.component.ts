import { Component } from '@angular/core';
import { BaseComponent } from '../base-component';

@Component({
    selector: 'app-user-table',
    standalone: true,
    imports: [],
    templateUrl: './user-table.component.html',
    styleUrl: './user-table.component.css'
})
export class UserTableComponent extends BaseComponent {
    constructor() {
        super();
    }
}
