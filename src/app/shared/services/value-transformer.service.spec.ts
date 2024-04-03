import { TestBed } from '@angular/core/testing';

import { ValueTransformerService } from './value-transformer.service';

describe('ValueTransformerService', () => {
  let service: ValueTransformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValueTransformerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
