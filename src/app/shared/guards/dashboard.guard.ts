import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { first, map, of } from 'rxjs';

export const dashboardGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const session = inject(SessionService);

    if (session.isActive()){
        return of(true); 
    }
    else {
        return session.refresh().pipe(
            map(success => {
                if (success){
                    return true;
                }
                else {
                    return router.parseUrl("/login");
                }
            })
        )
    }
};
