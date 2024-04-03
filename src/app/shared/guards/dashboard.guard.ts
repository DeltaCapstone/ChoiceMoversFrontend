import { Inject, Injectable } from '@angular/core';
import { Employee } from '../../models/employee';
import { SessionService } from '../services/session.service';
import { EmployeeSessionServiceToken } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard {
  constructor(@Inject(EmployeeSessionServiceToken) private sessionService: SessionService<Employee>) {}

  canActivate(){
      this.sessionService.isUserAuthorized().subscribe(isAuthorized => {
          if (!isAuthorized){
             this.sessionService.redirectToLogin();               
          }  
      })
  }
}
