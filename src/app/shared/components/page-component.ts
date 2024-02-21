import { Injectable, OnInit } from '@angular/core';
import { PageService } from '../services/page.service';
import { BaseComponent } from './base-component';

/**
 * Base class used for all "route-able" pages.
 */
@Injectable()
export abstract class PageComponent extends BaseComponent implements OnInit {
    /**
     * Initializes the PageComponent
     * @param {PageService} pageService - The page service used to interact with page-level elements and the DOM.
     */
    protected constructor(private pageService: PageService) {
        super();
    }

    /**
     * Updates the title of the page.
     * @param {string} title - The title to set.
     */
    public setTitle(title: string): void {
        this.pageService.updateTitle(title);
    }

    /**
     * Performs component initialization logic.  Invoked by the framework.
     */
    abstract ngOnInit(): void;
}
