import { TestBed } from '@angular/core/testing';

import { BeneficiaryGroupService } from './beneficiary-group.service';

describe('BeneficiaryGroupService', () => {
  let service: BeneficiaryGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiaryGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
