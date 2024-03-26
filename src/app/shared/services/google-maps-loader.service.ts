import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleReviewsResponse } from '../../models/google-reviews-response';
import { FeatureService } from './feature.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators'

/**
 * Service type that provides an interface for loading GoogleMaps related content
 */
@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {

  apiUrl: string = "";

  constructor(private http: HttpClient, private feature: FeatureService) {
    this.apiUrl = this.feature.getFeatureValue("api").url;
  }

  //--Maps and Reviews Section----------------------------------------------
  map: google.maps.Map;

  async initMap(): Promise<void> {
    //Choice Movers Location
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
  }

  getGoogleReviews(url: string): Observable<GoogleReviewsResponse> {
    return this.http.get<GoogleReviewsResponse>(url, { observe: 'body' });
  }

  //--AutoComplete Section--------------------------------------------------

  //From and To Address autocomplete variables
  fromAutocomplete: google.maps.places.Autocomplete;
  toAutocomplete: google.maps.places.Autocomplete;
  fromAddress1Field: HTMLInputElement;
  fromAddress2Field: HTMLInputElement;
  fromPostalField: HTMLInputElement;
  toAddress1Field: HTMLInputElement;
  toAddress2Field: HTMLInputElement;
  toPostalField: HTMLInputElement;
  private autoCompleteFromInitializedSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private autoCompleteToInitializedSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Function that checks whether or not the fromAutocomplete variable is initialized before user
   * @returns an observable of type boolean that emits true if fromAutocomplete is initialized; false otherwise
   */
  autoCompleteFromInitialized$(): Observable<boolean> {
    return this.autoCompleteFromInitializedSubject$.asObservable()
  }

  /**
   * Function that initializes the fromAutocomplete variable asynchronously
   */
  async initFromAutoComplete(): Promise<void> {
    try {
      const { Autocomplete } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
      console.log('Entered initFromAutocomplete');
      this.fromAddress1Field = document.querySelector("#fromStreetAddress") as HTMLInputElement;
      this.fromAddress2Field = document.querySelector("#fromAptNumUnitOrSuite") as HTMLInputElement;
      this.fromPostalField = document.querySelector("#fromPostcode") as HTMLInputElement;

      // Create the autocomplete object
      this.fromAutocomplete = new Autocomplete(this.fromAddress1Field, {
        componentRestrictions: { country: ["us", "ca"] },
        fields: ["address_components", "geometry"],
        types: ["address"],
      });
      console.log('Initialized fromAutocomplete');
      this.fromAddress1Field.focus();

      // complete address fields based on user selection from autocomplete dropdown, call fillInFrom address once change detected
      this.autoCompleteFromInitializedSubject$.next(true);
      this.fromAutocomplete.addListener("place_changed", this.fillInFromAddress);


    } catch {
      console.log("Error initializing autocomplete");
    }
  }

  /**
   * Fills in 'from' address form based on the users choice from the autocomplete field
   */
  fillInFromAddress = () => {
    this.autoCompleteFromInitialized$().pipe(
      filter(initialized => initialized),
      take(1)
    ).subscribe(() => {
      // Get the place details from the autocomplete object.
      const place = this.fromAutocomplete.getPlace();
      console.log('From Place value is:', place);
      let address1 = "";
      let postcode = "";

      // get addresss components from autocomplete, fill in form
      for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
        // @ts-ignore remove once typings fixed
        const componentType = component.types[0];

        switch (componentType) {
          case "street_number": {
            address1 = `${component.long_name} ${address1}`;
            break;
          }

          case "route": {
            address1 += component.short_name;
            break;
          }

          case "postal_code": {
            postcode = `${component.long_name}${postcode}`;
            break;
          }

          case "postal_code_suffix": {
            postcode = `${postcode}-${component.long_name}`;
            break;
          }

          case "locality":
            (document.querySelector("#fromLocality") as HTMLInputElement).value =
              component.long_name;
            break;

          case "administrative_area_level_1": {
            (document.querySelector("#fromState") as HTMLInputElement).value =
              component.short_name;
            break;
          }

          case "country":
            (document.querySelector("#fromCountry") as HTMLInputElement).value =
              component.long_name;
            break;
        }
      }

      this.fromAddress1Field.value = address1;
      this.fromPostalField.value = postcode;

      // Set focus to location of second address field
      this.fromAddress2Field.focus();
    });
  }

  /**
   * Function that checks whether or not the toAutocomplete variable is initialized before use
   * @returns an observable of type boolean that emits true if toAutocomplete is initialized; false otherwise
   */
  autoCompleteToInitialized$(): Observable<boolean> {
    return this.autoCompleteToInitializedSubject$.asObservable()
  }

  /**
   * Function that initializes the toAutocomplete variable asynchronously
   */
  async initToAutoComplete(): Promise<void> {
    try {
      const { Autocomplete } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
      console.log('Entered initToAutocomplete');
      this.toAddress1Field = document.querySelector("#toStreetAddress") as HTMLInputElement;
      this.toAddress2Field = document.querySelector("#toAptNumUnitOrSuite") as HTMLInputElement;
      this.toPostalField = document.querySelector("#toPostcode") as HTMLInputElement;

      // Create the autocomplete object
      this.toAutocomplete = new Autocomplete(this.toAddress1Field, {
        componentRestrictions: { country: ["us", "ca"] },
        fields: ["address_components", "geometry"],
        types: ["address"],
      });
      console.log('Initialized toAutocomplete');
      this.toAddress1Field.focus();

      //Populate address form once an address is selected. fillInToAddress called when place_changed happens
      this.autoCompleteToInitializedSubject$.next(true);
      this.toAutocomplete.addListener("place_changed", this.fillInToAddress);


    } catch {
      console.log("Error initializing autocomplete");
    }
  }

  /**
   * Fills in 'to' address form based on the users choice from the autocomplete field
   */
  fillInToAddress = () => {
    this.autoCompleteToInitialized$().pipe(
      filter(initialized => initialized),
      take(1)
    ).subscribe(() => {
      // Get the place details from the autocomplete object.
      const place = this.toAutocomplete.getPlace();
      console.log('To Place value is:', place);
      let address1 = "";
      let postcode = "";

      // fill in address based on address_componets
      for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
        // @ts-ignore remove once typings fixed
        const componentType = component.types[0];

        switch (componentType) {
          case "street_number": {
            address1 = `${component.long_name} ${address1}`;
            break;
          }

          case "route": {
            address1 += component.short_name;
            break;
          }

          case "postal_code": {
            postcode = `${component.long_name}${postcode}`;
            break;
          }

          case "postal_code_suffix": {
            postcode = `${postcode}-${component.long_name}`;
            break;
          }

          case "locality":
            (document.querySelector("#toLocality") as HTMLInputElement).value =
              component.long_name;
            break;

          case "administrative_area_level_1": {
            (document.querySelector("#toState") as HTMLInputElement).value =
              component.short_name;
            break;
          }

          case "country":
            (document.querySelector("#toCountry") as HTMLInputElement).value =
              component.long_name;
            break;
        }
      }

      this.toAddress1Field.value = address1;
      this.toPostalField.value = postcode;

      // Set focus to location of second address field
      this.toAddress2Field.focus();
    });
  }

  //--Distance Calculation Section-------------------------------------------

  async geocodeAddress(address: string): Promise<google.maps.LatLng> {
    const { Geocoder } = await google.maps.importLibrary("geocoding") as google.maps.GeocodingLibrary;

    //Retreives the Geocoder response. If the status of the response is'OK', the Promise resolves
    //otherwise, the response is rejected
    return new Promise((resolve, reject) => {
      const addressLatLng = new Geocoder();

      addressLatLng.geocode({ address: address }, (results, status) => {
        status === google.maps.GeocoderStatus.OK && results !== null && results.length > 0 ?
          resolve(results[0].geometry.location) : reject(status);
      });
    });
  }

  /**
   * Takes the fromAddress and toAddress geocodes from the geocodeAddress function and calculates the driving
   * distance between the two addresses
   * @param fromAddress geocoded fromAddress
   * @param toAddress geocoded toAddress
   * @returns The driving distance between the fromAddress and toAddress 
   */
  calculateDistanceBetweenAddresses(fromAddress: google.maps.LatLng, toAddress: google.maps.LatLng) {

    //instantiating DistanceMatrixService
    const distanceMatrix = new google.maps.DistanceMatrixService();

    //Retreives the distance matrix response. If the status of the response is 'OK', Promise resolves
    //otherwise, the response is rejected
    return new Promise((resolve, reject) => {
      distanceMatrix.getDistanceMatrix({
        origins: [fromAddress],
        destinations: [toAddress],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
      },
        (response, status) => {
          if (status === 'OK' && response !== null) {
            // Extract distance from response
            const distanceMeters = response.rows[0].elements[0].distance?.value;
            const distanceMiles = distanceMeters ? distanceMeters / 1609.34 : undefined;
            resolve(distanceMiles);
          } else {
            reject(status);
          }
        }
      )
    });
  }

  /**
   * Geocodes and calculates distance between two addresses
   * @param fromAddress Origin address
   * @param toAddress Destination address
   * @returns a Promise<void> that if resolved returns the distance in miles; error otherwise
   */
  async geocodeAndCalculateDistance(fromAddress: string, toAddress: string): Promise<number> {
    try {
      // Geocode the from and to addresses
      const fromLatLng = await this.geocodeAddress(fromAddress);
      const toLatLng = await this.geocodeAddress(toAddress);

      // Calculated distance between the geocoded locations
      const distanceMatrixResponse = await this.calculateDistanceBetweenAddresses(fromLatLng, toLatLng) as number;

      console.log('Distance Matrix Response:', distanceMatrixResponse);

      return distanceMatrixResponse;

    } catch (error) {
      console.error('Error:', error);
      throw Error('GEOCODE AND CALCULATE DISTANCE ERROR');
    }
  }
}
