import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { jobGuard } from './job.guard';

describe('jobGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => jobGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
