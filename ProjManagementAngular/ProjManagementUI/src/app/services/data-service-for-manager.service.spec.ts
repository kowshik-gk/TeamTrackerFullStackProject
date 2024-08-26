import { TestBed } from '@angular/core/testing';

import { DataServiceForManagerService } from './data-service-for-manager.service';

describe('DataServiceForManagerService', () => {
  let service: DataServiceForManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataServiceForManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
