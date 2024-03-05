import { Component } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { PageComponent } from '../page-component';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-google-maps-component',
  standalone: true,
  imports: [GoogleMap],
  templateUrl: './google-maps-component.component.html',
  styleUrl: './google-maps-component.component.css'
})
export class GoogleMapsComponentComponent extends PageComponent {

  constructor(public googleMapsLoaderService: GoogleMapsLoaderService, pageService: PageService) {
    super(pageService);
  }

  override ngOnInit(): void {
    this.setTitle("Moving");
  }

  ngAfterViewInit(): void {
    this.googleMapsLoaderService.initMap();
  }

}
