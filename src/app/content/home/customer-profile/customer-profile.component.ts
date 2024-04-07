import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Customer } from '../../../models/customer.model';
import { PageComponent } from '../../../shared/components/page-component';
import { PageService } from '../../../shared/services/page.service';
import { CustomersService } from '../../../shared/services/customers.service';
import { CustomerSessionServiceToken } from '../../../app.config';
import { SessionService } from '../../../shared/services/session.service';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent extends PageComponent {
  customer$: Observable<Customer | undefined>

  constructor(private _pageService: PageService, private _customerService: CustomersService, @Inject(CustomerSessionServiceToken) private _customerSession: SessionService<Customer>) {
    super(_pageService);
  }
  ngOnInit() {
    this.setTitle("Customer Profile");
    this.customer$ = this._customerService.getCustomerProfile();
  }

}
