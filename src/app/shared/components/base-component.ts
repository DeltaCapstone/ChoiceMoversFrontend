import { Injectable } from '@angular/core';
import { Formats } from '../../localization';

/**
 * Base component class used to encapsulate common component behaviors and fields.
 */
@Injectable()
export class BaseComponent {
    protected formatting: Formats;
    
    constructor() {
      this.formatting = new Formats();
    }
}
