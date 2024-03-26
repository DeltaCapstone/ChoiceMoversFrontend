import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SessionService } from '../services/session.service';

export const dashboardGuard: CanActivateFn = (route, state) => {
    const session = inject(SessionService);
    return session.guardWithAuth();
};
