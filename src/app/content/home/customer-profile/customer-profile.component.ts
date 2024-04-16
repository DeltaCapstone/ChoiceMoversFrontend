import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Customer } from '../../../models/customer.model';
import { PageComponent } from '../../../shared/components/page-component';
import { PageService } from '../../../shared/services/page.service';
import { CustomersService } from '../../../shared/services/customers.service';
import { CustomerSessionServiceToken } from '../../../app.config';
import { SessionService } from '../../../shared/services/session.service';
import { JobsService } from '../../../shared/services/jobs.service';
import { Job } from '../../../models/job.model';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent extends PageComponent {
  customer$: Observable<Customer | undefined>
  customerJobs$: Observable<Job[] | undefined>
  subscriptions: Subscription[];

  constructor(private _pageService: PageService, private _customerService: CustomersService, @Inject(CustomerSessionServiceToken) private _customerSession: SessionService<Customer>, private _jobsService: JobsService) {
    super(_pageService);

    this.subscriptions = [];
  }

  ngOnInit() {
    this.setTitle("Customer Profile");
    this.customer$ = this._customerService.getCustomerProfile();
    const customerSubscription = this.customer$.subscribe(customer => {
      if (customer) {
        const username = customer.userName;
        this.customerJobs$ = this._jobsService.getCustomerJobs(username);
      }
    })

    this.subscriptions.push(customerSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
