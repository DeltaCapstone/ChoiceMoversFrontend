import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  animateChild
} from '@angular/animations';
export const slideInAnimation =
  trigger('routeAnimations', [
       transition('* => *', [
            query(':enter, :leave',
                 style({ position: 'fixed',  width: '100%' }),
                 { optional: true }),
            group([
                 query(':enter', [
                     style({ transform: 'translateX(100%)' }),
                     animate('0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19)',
                     style({ transform: 'translateX(0%)' }))
                 ], { optional: true }),
                 query(':leave', [
                     style({ transform: 'translateX(0%)' }),
                     animate('0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19)',
                     style({ transform: 'translateX(-100%)' }))
                     ], { optional: true }),
             ])
       ])
]);
