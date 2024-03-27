import { Component } from '@angular/core';
import { BaseComponent } from '../base-component';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.css'
})
export class NotFoundComponent extends BaseComponent {
    constructor() {
        super();
    }
}
