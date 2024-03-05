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
      zoom: 14,
      center: position,
      mapId: "e953adf38f76874e"
    }
    );

    const request = {
      placeId: "ChIJR0zbo4V49mIRynTpBCdPbC4",
      fields: ["name", "reviews"]
    };

    const service = new google.maps.places.PlacesService(this.map);

    const infowindow = new google.maps.InfoWindow();

    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK &&
        place &&
        place.geometry &&
        place.geometry.location
      ) {
        const marker = new AdvancedMarkerElement({
          map: this.map,
          position: position,
          title: 'Choice Movers Akron'
        });

        google.maps.event.addListener(marker, "click", () => {
          const content = document.createElement("div");

          const nameElement = document.createElement("h2");

          nameElement.textContent = place.name!;
          content.appendChild(nameElement);

          const placeIdElement = document.createElement("p");

          placeIdElement.textContent = place.place_id!;
          content.appendChild(placeIdElement);

          const placeAddressElement = document.createElement("p");

          placeAddressElement.textContent = place.formatted_address!;
          content.appendChild(placeAddressElement);

          infowindow.setContent(content);
          infowindow.open(this.map, marker);
        });
      }
    });
  }
}
