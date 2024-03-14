import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const dashboardGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const session = inject(SessionService);

    return session.guardWithAuth(
        () => true,
        () => router.parseUrl("/login")
    );   
 };
