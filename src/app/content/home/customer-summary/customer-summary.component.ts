import { Component, Inject } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';
import { Customer } from '../../../models/customer.model';
import { CommonModule } from '@angular/common';
import { CreateEstimateSessionState } from '../../../models/session.model';
import { CustomerSessionServiceToken } from '../../../app.config';
import { BehaviorSubject, Observable, Subscription, filter, map, pipe, take } from 'rxjs';
import { JobsService } from '../../../shared/services/jobs.service';

@Component({
  selector: 'app-customer-summary',
  standalone: true,
  imports: [TuiSvgModule, CommonModule],
  templateUrl: './customer-summary.component.html',
  styleUrl: './customer-summary.component.css'
})
export class CustomerSummaryComponent {

  jobSessionState: CreateEstimateSessionState;

  estimateCost$: BehaviorSubject<number | null>;

  estimateID$: BehaviorSubject<number | null>;

  roundedEstimate$: BehaviorSubject<number | null>;

  subscriptions: Subscription[];

  constructor(private _router: Router, @Inject(CustomerSessionServiceToken) private _customerSession: SessionService<Customer>, private _jobService: JobsService) {
    this.estimateCost$ = new BehaviorSubject<number | null>(null);
    this.estimateID$ = new BehaviorSubject<number | null>(null);
    this.roundedEstimate$ = new BehaviorSubject<number | null>(null);
  }

  /**
   * Called on component initialization. Assigns initial values of component properties.
   */
  ngOnInit() {
    this.jobSessionState = this._customerSession.movePlannerSessionState;

    this.estimateCost$ = this.jobSessionState.estimateAmount;

    this.estimateID$ = this.jobSessionState.estimateID;

    this.subscriptions = [];

  }

  /**
   * Called after component initialization. Subscribes to estimateCost$ BehaviorSubject to get value, and uses pipe and map to round that value, setting roundedValue$ Behavior Subject value.
   */
  ngAfterViewInit() {

    this.subscriptions.push(this.estimateCost$.pipe(
      map(estimateCost => estimateCost !== null ? (Math.round(estimateCost * 100) / 100) : null)
    ).subscribe(roundedValue => {
      this.roundedEstimate$.next(roundedValue);
    })
    );
  }

  /**
   * Calls the Jobs service which is used to call the createCustomerJob API route. Creates a customer job from an estimate given the estimate ID.
   */
  createJobFromEstimate() {
    const estimateSubscription = this.estimateID$.subscribe({
      next: (id) => {
        if (id) {
          this._jobService.createCustomerJob(id).pipe(
            take(1)
          ).subscribe()
        }
      },
      error: (error) => {
        console.error('Error creating job from estimate', error);
      }
    });

    this.subscriptions.push(estimateSubscription);

    this._router.navigate(['/home/job-completion']);
  }

  /**
   * Uses Router module to navigate back to the move-planner component
   */
  navigateBackToMovePlanner() {
    this._router.navigate(['/home/move-planner']);
  }

  /**
   * Called on component destruction. Unsubscribes from each subscription to avoid memory leaks
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
