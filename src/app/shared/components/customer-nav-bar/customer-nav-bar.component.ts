import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiSvgModule } from '@taiga-ui/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { Observable, Subscription } from 'rxjs';
import { CustomersService } from '../../services/customers.service';
import { Customer } from '../../../models/customer.model';
import { TUI_BUTTON_OPTIONS, TuiButtonModule } from '@taiga-ui/core';
import { CustomerSessionServiceToken } from '../../../app.config';

type MenuBarItem = {
  readonly title: string
  readonly route: string
}

@Component({
  selector: 'app-customer-nav-bar',
  standalone: true,
  imports: [TuiSvgModule, RouterLink, RouterLinkActive, CommonModule, TuiButtonModule],
  templateUrl: './customer-nav-bar.component.html',
  styleUrl: './customer-nav-bar.component.css',
  providers: [
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        appearance: 'primary',
        size: 's',
        shape: 'rounded',
      }
    }
  ]
})
export class CustomerNavBarComponent {

  activeUser$: Observable<Customer | undefined>;

  subscriptions: Subscription[] = [];

  constructor(@Inject(CustomerSessionServiceToken) private _session: SessionService<Customer>, private _router: Router) { }

  ngOnInit() {
    this.activeUser$ = this._session.getUser();

    const userSubscription = this.activeUser$.subscribe();

    this.subscriptions.push(userSubscription);
  }

  items: MenuBarItem[] = [
    { title: "Home", route: "customer-home" },
    { title: "Moving", route: "moving" },
    { title: "Packing", route: "packing" },
    { title: "Storage", route: "storage" },
    { title: "Contact", route: "contact" },
  ]

  //TODO: IMPLEMENT CUSTOMER PROFILE NAVIGATION FUNCTION
  openCustomerProfile() {

  }

  navToLogin() {
    this._router.navigate(['login/customer']);
  }

  logout() {
    this._session.logout();
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
