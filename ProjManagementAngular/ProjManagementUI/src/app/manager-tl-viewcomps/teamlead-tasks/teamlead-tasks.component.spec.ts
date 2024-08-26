import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamleadTasksComponent } from './teamlead-tasks.component';

describe('TeamleadTasksComponent', () => {
  let component: TeamleadTasksComponent;
  let fixture: ComponentFixture<TeamleadTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamleadTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamleadTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
