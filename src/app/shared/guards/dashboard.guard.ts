import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { first, map } from 'rxjs';

export const dashboardGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const session = inject(SessionService)
    return session.getUser().pipe(
        first(),
        map(user => {
            if (user){
                return true;
            }
            else {
                return router.parseUrl("/login");
            }
        })
    );
};
