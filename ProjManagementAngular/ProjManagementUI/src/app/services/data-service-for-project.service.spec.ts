import { TestBed } from '@angular/core/testing';

import { DataServiceForPost } from './data-service-for-project.service';

describe('DataServiceForPost', () => {
  let service: DataServiceForPost;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataServiceForPost);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
