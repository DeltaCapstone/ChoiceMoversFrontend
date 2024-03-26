import { Inject, Injectable } from '@angular/core';
import { SessionType } from '../../models/session.model';
import { Employee } from '../../models/employee';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard {
  constructor(@Inject(SessionType.Employee) private sessionService: SessionService<Employee>) {}

  canActivate(){
    return this.sessionService.guardWithAuth();
  }
}
