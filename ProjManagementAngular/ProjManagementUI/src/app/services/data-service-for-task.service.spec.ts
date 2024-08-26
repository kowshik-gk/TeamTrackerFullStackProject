import { TestBed } from '@angular/core/testing';

import { DataServiceForReportService } from './data-service-for-task.service';

describe('DataServiceForReportService', () => {
  let service: DataServiceForReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataServiceForReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
