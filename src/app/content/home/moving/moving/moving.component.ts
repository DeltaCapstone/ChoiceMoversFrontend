import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { StartMoveButtonComponent } from '../../../../shared/components/start-move-button/start-move-button.component';
import { GoogleMapsModule } from '@angular/google-maps';
@Component({
  selector: 'app-moving',
  standalone: true,
  imports: [TuiSvgModule, StartMoveButtonComponent, GoogleMapsModule],
  templateUrl: './moving.component.html',
  styleUrl: './moving.component.css'
})
export class MovingComponent {
  constructor() { }
  ngOnInit(): void { }
  display: any; // Property to store latitude and longitude data from the map
  center: google.maps.LatLngLiteral = {
    // Initial center coordinates for the map
    lat: 40.73438262939453,
    lng: -82.90711975097656
  };
  zoom = 7; // Initial zoom level for the map
  move(event: google.maps.MapMouseEvent) {
    // Method to handle map click event and update the display property
    if (event.latLng != null) {
      this.display = event.latLng.toJSON();
    }
  }
}
