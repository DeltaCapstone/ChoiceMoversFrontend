import { Component, Inject } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';
import { Customer } from '../../../models/customer.model';
import { CommonModule } from '@angular/common';
import { CreateEstimateSessionState } from '../../../models/session.model';
import { CustomerSessionServiceToken } from '../../../app.config';

@Component({
  selector: 'app-customer-summary',
  standalone: true,
  imports: [TuiSvgModule, CommonModule],
  templateUrl: './customer-summary.component.html',
  styleUrl: './customer-summary.component.css'
})
export class CustomerSummaryComponent {

  jobSessionState: CreateEstimateSessionState;

  constructor(private _router: Router, @Inject(CustomerSessionServiceToken) private _customerSession: SessionService<Customer>) { }

  ngOnInit() {
    this.jobSessionState = this._customerSession.movePlannerSessionState;
  }

  navigateBackToMovePlanner() {
    this._router.navigate(['/home/move-planner'])
  }
}
