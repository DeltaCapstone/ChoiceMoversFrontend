import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * A service that handles basic page-related behavior such as setting the title and interacting with the window.
 */
@Injectable({
    providedIn: 'root'
})
export class PageService {
    private _titleSuffix: string;
    public $title: BehaviorSubject<string>;

    constructor() {
        this._titleSuffix = 'JR Suffix';
        this.$title = new BehaviorSubject<string>(this._titleSuffix);
    }

    /**
     * Encapsulation used to update the title of the page.
     * @param {string} newTitle - The new title to set which is suffixed with a common title.
     */
    public updateTitle(newTitle: string): void {
        this.$title.next(`${newTitle} - ${this._titleSuffix}`);
    }
}
