import { Injectable } from '@angular/core';
import { Employee } from '../../models/user';
import { UsersService } from './users.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
    user$: Observable<Employee | undefined> = of(undefined);
    
    constructor(private usersService: UsersService) {
        this.user$ = this.usersService.getEmployee("mgr_sarah_m");
    }
    
    setUser(user: Observable<Employee | undefined>) {
        this.user$ = user;
    }

    getUser(): Observable<Employee | undefined> {
        return this.user$;
    }
}
