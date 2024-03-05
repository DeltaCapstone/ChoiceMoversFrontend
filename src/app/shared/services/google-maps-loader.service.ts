import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {

  constructor() { }

  map: google.maps.Map;

  async initMap(): Promise<void> {
    //Center of Ohio Location
    const position = { lat: 41.066078186035156, lng: -81.46630096435547 };

    //Request Libraries
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    //Map
    this.map = new Map(
      document.getElementById("map") as HTMLElement, {
      zoom: 7,
      center: position,
      mapId: "e953adf38f76874e"
    }
    );
    console.log(this.map);

    //Map marker on Choice Movers
    const marker = new AdvancedMarkerElement({
      map: this.map,
      position: position,
      title: 'Choice Movers Akron'
    });
  }
}
