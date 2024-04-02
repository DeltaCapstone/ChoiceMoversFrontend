import { NgFor, NgClass, NgIf, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDataListModule, TuiHostedDropdownModule, TuiSvgModule } from '@taiga-ui/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { TuiSurfaceModule } from '@taiga-ui/experimental';
import { BaseComponent } from '../base-component';
import { filter, map } from 'rxjs/operators';
import { Observable, Subscription, of } from 'rxjs';
import { SessionService } from '../../services/session.service';
import { Employee, EmployeeType } from '../../../models/employee';
import { EmployeeSessionServiceToken } from '../../../app.config';

type SidebarItem = {
    readonly name: string
    readonly icon: string
    readonly route: string
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [NgFor, TuiSvgModule, NgClass, RouterModule, TuiAvatarModule, NgIf, CommonModule,
        TuiSurfaceModule, TuiHostedDropdownModule, TuiDataListModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent extends BaseComponent {
    user$: Observable<Employee | undefined>;
    sidebarItems$: Observable<SidebarItem[]> = of([]);
    subscriptions: Subscription[] = [];

    dropdownOpen: boolean = false;
    profileOpen: boolean = false;

    ngOnInit() {
        this.user$ = this.session.getUser();

        const routerEventSub = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(_ => {
            this.profileOpen = this.router.url.includes("/dashboard/profile");
        });
        this.subscriptions.push(routerEventSub);

        this.sidebarItems$ = this.user$.pipe(
            map(user => {
                console.log(user);
                let sidebarItems = [];
                sidebarItems.push({ name: "Schedule", icon: "tuiIconCalendarLarge", route: "schedule" });
                if (user?.employeeType == EmployeeType.Manager) {
                    sidebarItems = sidebarItems.concat([
                        { name: "Employees", icon: "tuiIconUsersLarge", route: "employees" },
                        { name: "Statistics", icon: "tuiIconTrelloLarge", route: "statistics" }
                    ]);
                }
                sidebarItems.push({ name: "Settings", icon: "tuiIconSettingsLarge", route: "settings" });
                return sidebarItems;
            }));
    }

    constructor(private router: Router, 
        @Inject(EmployeeSessionServiceToken) private session: SessionService<Employee>) {
        super();
    }

    openProfile() {
        this.dropdownOpen = false;
        this.session.isUserAuthorized().subscribe(isAuthorized => {
            if (isAuthorized){
                this.router.navigate([`dashboard/profile/`]);
            }
            else {
                this.session.redirectToLogin();
            }
        });
    }

    logout() {
        this.session.logout();
        this.session.redirectToLogin();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
