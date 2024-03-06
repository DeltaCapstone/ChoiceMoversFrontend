import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';
import { Job } from '../../models/job.model';

/**
 * Service that provides an interface for creating and updating jobs from the customer facing Moving page.
 */
@Injectable({
  providedIn: 'root'
})

export class JobsService {

  constructor(private http: HttpClient, private feature: FeatureService) { }

}
