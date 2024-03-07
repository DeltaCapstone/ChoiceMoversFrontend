import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';
import { Job } from '../../models/job.model';
import { Room } from '../../models/room.model';
import { User } from '../../models/user';

/**
 * Service that provides an interface for creating and updating jobs from the customer facing Moving page.
 */
@Injectable({
  providedIn: 'root'
})

export class JobsService {

  apiUrl: string = "";

  constructor(private http: HttpClient, private feature: FeatureService) {
    this.apiUrl = this.feature.getFeatureValue("api").url;
  }

}
