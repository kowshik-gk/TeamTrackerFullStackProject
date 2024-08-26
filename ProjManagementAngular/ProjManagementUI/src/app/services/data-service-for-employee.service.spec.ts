import { TestBed } from '@angular/core/testing';

import { DataServiceForEmployeeService } from './data-service-for-employee.service';

describe('DataServiceForEmployeeService', () => {
  let service: DataServiceForEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataServiceForEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
