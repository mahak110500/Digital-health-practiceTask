import { TestBed } from '@angular/core/testing';

import { ComparativeResultService } from './comparative-result.service';

describe('ComparativeResultService', () => {
  let service: ComparativeResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComparativeResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
