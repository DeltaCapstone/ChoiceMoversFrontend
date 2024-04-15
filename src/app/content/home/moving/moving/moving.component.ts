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

  constructor(
    private featureService: FeatureService,
    pageService: PageService) {
    super(pageService);
  }

  ngOnInit() {
    this.setTitle("Moving");
  }

}
