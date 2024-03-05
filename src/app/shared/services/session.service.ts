import { Injectable } from '@angular/core';
import { Employee } from '../../models/user';
import { UsersService } from './users.service';
import { Observable, map, of } from 'rxjs';
import { HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
    user$: Observable<Employee | undefined>;
    
    constructor(private usersService: UsersService) {
        // check if there is a stored token
        const token = sessionStorage.getItem("accessToken");
        const userName = sessionStorage.getItem("userName");
        if (token && userName) {
            this.user$ = this.usersService.getEmployee(userName);
        }
        else {
            this.user$ = of(undefined);
        }
    }
    
    login(userName: string, passwordPlain: string): Observable<boolean> {
        return this.usersService.requestLogin(userName, passwordPlain).pipe(
            map((res: any) => {
                const accessToken = res["access_token"];
                const refreshToken = res["refresh_token"];
                if (accessToken && refreshToken){
                    this.user$ = this.usersService.getEmployee(userName);
                    sessionStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    // TODO: encode in token and pull from that?
                    sessionStorage.setItem("userName", userName);
                    return res["access_token"];   
                }
                return false;
            }));
    }

    logout() {
        sessionStorage.setItem("accessToken", "");
        localStorage.setItem("refreshToken", "");
        sessionStorage.setItem("userName", "");         
        this.user$ = of(undefined);
    }

    getUser(): Observable<Employee | undefined> {
        return this.user$;
    }
}
