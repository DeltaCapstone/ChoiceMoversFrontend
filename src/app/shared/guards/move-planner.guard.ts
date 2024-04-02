import { Inject, Injectable } from "@angular/core";
import { Customer } from "../../models/customer.model";
import { SessionService } from "../services/session.service";
import { CustomerSessionServiceToken } from "../../app.config";

@Injectable({
  providedIn: 'root'
})

export class movePlannerGuard {
  constructor(@Inject(CustomerSessionServiceToken) private _sessionService: SessionService<Customer>) { }

  canActivate() {
    this._sessionService.isUserAuthorized().subscribe(isAuthorized => {
      if (!isAuthorized) {
        this._sessionService.redirectToLogin();
      }
    })
  }
}
