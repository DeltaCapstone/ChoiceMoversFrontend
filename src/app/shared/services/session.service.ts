import { Injectable } from '@angular/core';
import { Employee } from '../../models/user';
import { UsersService } from './users.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
    user$: Observable<Employee | undefined> = of(undefined);
    
    constructor(private usersService: UsersService) {}
    
    setUser(userName: string) {
        this.user$ = this.usersService.getEmployee(userName);
    }

    getUser(): Observable<Employee | undefined> {
        return this.user$;
    }
}
