import { Inject, Injectable } from '@angular/core';
import { SessionType } from '../../models/session.model';
import { Employee } from '../../models/employee';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard {
  constructor(@Inject(SessionType.Employee) private sessionService: SessionService<Employee>, private _router: Router) { }

  canActivate() {
    console.log('In canActivate()');
    this.sessionService.guardWithAuth().pipe(
      map(success => {
        console.log('Success');
        if (success) {
          return true;
        } else {
          this._router.navigate(['login', SessionType.Employee]);
          return false;
        }
      })
    ).subscribe()
    return of(true);
  }
}
