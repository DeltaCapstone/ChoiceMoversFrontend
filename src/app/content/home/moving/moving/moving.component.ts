import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { StartMoveButtonComponent } from '../../../../shared/components/start-move-button/start-move-button.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { GoogleMapsComponentComponent } from '../../../../shared/components/google-maps-component/google-maps-component.component';
import { GoogleMapsLoaderService } from '../../../../shared/services/google-maps-loader.service';
import { GoogleReviewsResponse } from '../../../../models/google-reviews-response';
import { PageComponent } from '../../../../shared/components/page-component';
import { PageService } from '../../../../shared/services/page.service';
import { Subscription, Observable, of, BehaviorSubject } from 'rxjs';
import { FeatureService } from '../../../../shared/services/feature.service';

@Component({
  selector: 'app-moving',
  standalone: true,
  imports: [TuiSvgModule, StartMoveButtonComponent, GoogleMapsModule, NgFor, NgIf, CommonModule, GoogleMapsComponentComponent],
  templateUrl: './moving.component.html',
  styleUrl: './moving.component.css'
})

export class MovingComponent extends PageComponent {
  googleReviews$: BehaviorSubject<GoogleReviewsResponse | null>;
  subscriptions: Subscription[] = [];

  constructor(
    private featureService: FeatureService,
    private googleMapsLoaderService: GoogleMapsLoaderService, 
    pageService: PageService) {
    super(pageService);
    this.googleReviews$ = new BehaviorSubject<GoogleReviewsResponse | null>(null);
  }

  ngOnInit() {
    this.setTitle("Moving");
    this.googleReviews$.subscribe(data => console.log(data));
  }

  ngAfterViewInit() {
    this.getReviews();
  }

  getReviews() {
    const url = this.featureService.getFeatureValue("mapsApi").placesUrl;

    const googleReviewSubscription = this.googleMapsLoaderService.getGoogleReviews(url).subscribe(response => {
      this.googleReviews$.next(response);
    });

    this.subscriptions.push(googleReviewSubscription);

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
