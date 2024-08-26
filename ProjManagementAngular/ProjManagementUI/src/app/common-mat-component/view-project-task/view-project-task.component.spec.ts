import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectTaskComponent } from './view-project-task.component';

describe('ViewProjectTaskComponent', () => {
  let component: ViewProjectTaskComponent;
  let fixture: ComponentFixture<ViewProjectTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProjectTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProjectTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
