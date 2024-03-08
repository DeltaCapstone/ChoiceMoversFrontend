import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { StartMoveButtonComponent } from '../../../../shared/components/start-move-button/start-move-button.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { GoogleMapsComponentComponent } from '../../../../shared/components/google-maps-component/google-maps-component.component';
import { GoogleMapsLoaderService } from '../../../../shared/services/google-maps-loader.service';
@Component({
  selector: 'app-moving',
  standalone: true,
  imports: [TuiSvgModule, StartMoveButtonComponent, GoogleMapsModule, NgFor, NgIf, CommonModule, GoogleMapsComponentComponent],
  templateUrl: './moving.component.html',
  styleUrl: './moving.component.css'
})

export class MovingComponent {
  googleReviews: any[];

  constructor(private googleMapsLoaderService: GoogleMapsLoaderService) { }

  ngOnInit() {
    this.getReviews();
  }

  getReviews() {
    const url = 'https://places.googleapis.com/v1/places/ChIJR0zbo4V49mIRynTpBCdPbC4?fields=reviews,displayName&key=API_KEY_HERE';

    this.googleMapsLoaderService.getGoogleReviews(url).subscribe(response => {
      this.googleReviews = response;
      console.log(this.googleReviews);
    });
  }
}
