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
    apiUrl: string = "";
    
    constructor(private http: HttpClient, private feature: FeatureService) {
        this.apiUrl = this.feature.getFeatureValue("api").url;
    }

    putEmployee(updatedUser: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/employee/`, updatedUser);
    }
    
    getEmployee(userName: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/employee/${userName}`, { observe: 'body' });
    }
    
    getEmployees(): Observable<Array<User>> {
        return this.http.get<Array<User>>(`${this.apiUrl}/manager/employee`, { observe: 'body' });
    }
}
