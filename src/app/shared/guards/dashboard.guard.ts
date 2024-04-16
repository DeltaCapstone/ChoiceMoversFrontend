import { Inject, Injectable } from '@angular/core';
import { Employee } from '../../models/employee';
import { SessionService } from '../services/session.service';
import { CustomerSessionServiceToken, EmployeeSessionServiceToken } from '../../app.config';
import { Customer } from '../../models/customer.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard {
  constructor(@Inject(EmployeeSessionServiceToken) private employeeSessionService: SessionService<Employee>, 
       @Inject(CustomerSessionServiceToken) private customerSessionService: SessionService<Customer>,
       private router: Router) {}

  canActivate(){
      this.customerSessionService.getUser().subscribe(user => {
          if (user){
              this.router.navigate(["/"]);
          }
          else {
              this.employeeSessionService.isUserAuthorized().subscribe(isAuthorized => {
                  if (!isAuthorized){
                     this.employeeSessionService.redirectToLogin();               
                  }  
              })
          }
      })  
  }
}
