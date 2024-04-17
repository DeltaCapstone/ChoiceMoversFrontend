import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MoveButtonComponent } from '../../../../shared/components/move-button/move-button.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { GoogleMapsComponentComponent } from '../../../../shared/components/google-maps-component/google-maps-component.component';
import { GoogleMapsLoaderService } from '../../../../shared/services/google-maps-loader.service';
import { GoogleReviewsResponse } from '../../../../models/google-reviews-response';
import { PageComponent } from '../../../../shared/components/page-component';
import { PageService } from '../../../../shared/services/page.service';
import { Subscription, BehaviorSubject, interval } from 'rxjs';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [MoveButtonComponent, GoogleMapsModule, NgFor, NgIf, CommonModule, GoogleMapsComponentComponent],
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css']
})
export class CustomerHomeComponent extends PageComponent implements OnInit, OnDestroy {
  googleReviews$: BehaviorSubject<GoogleReviewsResponse | null>;
  subscriptions: Subscription[] = [];
  activeReviewIndex = 0;
  reviewRotationSubscription: Subscription;

  constructor(
    private googleMapsLoaderService: GoogleMapsLoaderService,
    pageService: PageService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    super(pageService);
    this.googleReviews$ = new BehaviorSubject<GoogleReviewsResponse | null>(null);
  }

  /**
   * Called on component initialization. Sets title, subscribes to GoogleReviews response data, pushes subscriptions to Subscription array
   */
  ngOnInit() {
    this.setTitle("Moving");
    this.subscriptions.push(this.googleReviews$.subscribe(data => console.log(data)));

    // Automatic review rotation logic
    this.reviewRotationSubscription = interval(5000).subscribe(() => {
      const reviews = this.googleReviews$.value;
      if (reviews && reviews.reviews) {
        this.activeReviewIndex = (this.activeReviewIndex + 1) % reviews.reviews.length;
        this.cdr.detectChanges(); // Manually trigger change detection
      }
    });

    this.subscriptions.push(this.reviewRotationSubscription);
  }

  /**
   * Called after component view initializes. Calls the getReviews function which fetches Google Reviews via an API call to Google Places API
   */
  ngAfterViewInit() {
    this.getReviews();
  }

  /**
   * Calls the google places API to retreive the 5 most recent reviews for Choice Movers Google Business Profile
   */
  getReviews() {
    const url = 'https://places.googleapis.com/v1/places/ChIJR0zbo4V49mIRynTpBCdPbC4?fields=reviews,displayName&key=API_KEY_HERE';
    const googleReviewSubscription = this.googleMapsLoaderService.getGoogleReviews(url).subscribe(response => {
      this.googleReviews$.next(response);
    });
    this.subscriptions.push(googleReviewSubscription);
  }

  /**
   * Called on component destruction. Unsubscribes to all subscriptions to avoid memory leaks.
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.reviewRotationSubscription) {
      this.reviewRotationSubscription.unsubscribe();
    }
  }

  createRange(number: number) {
    return new Array(number).fill(0);
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }
}
