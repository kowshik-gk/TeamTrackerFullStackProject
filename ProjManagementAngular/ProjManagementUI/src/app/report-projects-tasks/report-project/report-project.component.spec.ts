import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProjectComponent } from './report-project.component';

describe('ReportProjectComponent', () => {
  let component: ReportProjectComponent;
  let fixture: ComponentFixture<ReportProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
