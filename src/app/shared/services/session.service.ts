import { Injectable } from '@angular/core';
import { Employee } from '../../models/user';
import { UsersService } from './users.service';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
    user$: Observable<Employee | undefined> = of(undefined);
    
    constructor(private usersService: UsersService) {}
    
    login(userName: string, passwordPlain: string): Observable<boolean> {
        return this.usersService.login(userName, passwordPlain).pipe(
            map((res: any) => {
                this.user$ = this.usersService.getEmployee(userName);
                return !!res["token"];
            }));
    }

    getUser(): Observable<Employee | undefined> {
        return this.user$;
    }
}
