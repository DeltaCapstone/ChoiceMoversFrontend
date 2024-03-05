import { Injectable } from '@angular/core';
import { Employee } from '../../models/user';
import { UsersService } from './users.service';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
    user$: Observable<Employee | undefined>;
    
    constructor(private usersService: UsersService) {
        // check if there is a stored token
        const token = this.getToken();
        const userName = sessionStorage.getItem("userName");
        if (token && userName) {
            this.user$ = this.usersService.getEmployee(userName);
        }
        else {
            this.user$ = of(undefined);
        }
    }

    getToken(): string | null {
        return sessionStorage.getItem("token");
    }
    
    login(userName: string, passwordPlain: string): Observable<boolean> {
        return this.usersService.login(userName, passwordPlain).pipe(
            map((res: any) => {
                this.user$ = this.usersService.getEmployee(userName);
                sessionStorage.setItem("token", res["token"]);
                // TODO: encode in token and pull from that?
                sessionStorage.setItem("userName", userName);
                return !!res["token"];
            }));
    }

    logout() {
        this.user$ = of(undefined);
    }

    getUser(): Observable<Employee | undefined> {
        return this.user$;
    }
}
