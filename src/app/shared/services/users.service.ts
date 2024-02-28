import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';

/**
 * Service type that provides an interface for users stored in the database.
 */
@Injectable({
  providedIn: 'root'
})
export class UsersService {
    constructor(private http: HttpClient, private feature: FeatureService) { }
    
    getEmployees(): Observable<Array<User>> {
        const apiUrl: string = this.feature.getFeatureValue("api").url;
        
        return this.http.get<Array<User>>(`${apiUrl}/employee`, { observe: 'body' });
    }
}
