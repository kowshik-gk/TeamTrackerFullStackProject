import { TestBed } from '@angular/core/testing';

import { DataServiceForLoginService } from './data-service-for-login.service';

describe('DataServiceForLoginService', () => {
  let service: DataServiceForLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataServiceForLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
