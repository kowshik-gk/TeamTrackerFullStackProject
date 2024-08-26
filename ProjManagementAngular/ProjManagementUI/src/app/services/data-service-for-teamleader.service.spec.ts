import { TestBed } from '@angular/core/testing';

import { DataServiceForTeamleaderService } from './data-service-for-teamleader.service';

describe('DataServiceForTeamleaderService', () => {
  let service: DataServiceForTeamleaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataServiceForTeamleaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
