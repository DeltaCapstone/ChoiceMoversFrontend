import { Component } from '@angular/core';
import { BaseComponent } from '../base-component';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css'
})
export class SearchComponent extends BaseComponent {
    constructor() {
        super();
    }
}
