import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {

  constructor(private http: HttpClient) { }

  map: google.maps.Map;

  async initMap(): Promise<void> {
    //Center of Ohio Location
    const position = { lat: 41.066078186035156, lng: -81.46630096435547 };

    //Request Libraries
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    const { PlacesService } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
    //Map
    this.map = new Map(
      document.getElementById("map") as HTMLElement, {
      zoom: 14,
      center: position,
      mapId: "e953adf38f76874e"
    }
    );
  }

  getGoogleReviews(url: string): Observable<any> {
    return this.http.get(url);
  }
}
