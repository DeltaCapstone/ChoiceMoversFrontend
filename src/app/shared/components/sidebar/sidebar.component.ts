import { NgFor, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TuiDataListModule, TuiHostedDropdownComponent, TuiHostedDropdownModule, TuiSvgModule } from '@taiga-ui/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { TuiSurfaceModule } from '@taiga-ui/experimental';
import { BaseComponent } from '../base-component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

type SidebarItem = {
    readonly name: string
    readonly icon: string
    readonly route: string
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [NgFor, TuiSvgModule, NgClass, RouterModule, TuiAvatarModule, NgIf,
        TuiSurfaceModule, TuiHostedDropdownModule, TuiDataListModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent extends BaseComponent {
    @ViewChild(TuiHostedDropdownComponent)
    component?: TuiHostedDropdownComponent;

    routerEventSub: Subscription;
    
    dropdownOpen: boolean = false;
    profileOpen: boolean = false;

    constructor(private router: Router) {
        super();
        this.routerEventSub = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(_ => {
            this.profileOpen = this.router.url.includes("/dashboard/profile");
        });
    }

    openProfile() {
        this.dropdownOpen = false;
        this.router.navigate([`dashboard/profile/`, "emp_linda_k"]);
    }
    
    items: SidebarItem[] = [
        { name: "Schedule", icon: "tuiIconCalendarLarge", route: "schedule" },
        { name: "Employees", icon: "tuiIconUsersLarge", route: "employees" },
        { name: "Statistics", icon: "tuiIconTrelloLarge", route: "statistics" },
        { name: "Settings", icon: "tuiIconSettingsLarge", route: "settings" }
    ];

    ngOnDestroy(){
        this.routerEventSub.unsubscribe();
    }
}
