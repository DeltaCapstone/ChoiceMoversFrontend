import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from '../base-component';
import { slideInAnimation } from '../route-animation';
import { RouterOutlet } from '@angular/router';

/**
 * The layout component that controls the primary structure of the UI.
 */
@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [slideInAnimation]
})
export class LayoutComponent extends BaseComponent implements OnInit {
    constructor() {
        super();
    }

    /**
     * Performs one-time component initialization.  Invoked by the framework.
     */
    public ngOnInit(): void {
    }

}
