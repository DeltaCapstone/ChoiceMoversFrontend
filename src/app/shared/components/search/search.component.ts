import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../base-component';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [TuiInputModule, TuiTextfieldControllerModule, ReactiveFormsModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css'
})
export class SearchComponent<T> extends BaseComponent implements OnChanges {
    @Input() items: T[] | null;
    @Input() filter: (item: T, searchValue: string) => boolean;
    public filteredItems$ = new Observable<T[]>();

    searchInput = new FormControl('');

    ngOnInit() {
        if (!this.items) {
            this.items = [];
        }

        this.filteredItems$ = this.searchInput.valueChanges.pipe(
            startWith(''),
            debounceTime(100),
            map(searchValue => (this.items ?? []).filter(item => {
                searchValue = (searchValue ?? "").toLowerCase();
                return this.filter(item, searchValue);
            }))
        );
    }

    constructor() {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.searchInput.updateValueAndValidity();
        }
    }
}
