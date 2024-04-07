import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { movePlannerGuard } from './move-planner.guard';

describe('movePlannerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => movePlannerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
