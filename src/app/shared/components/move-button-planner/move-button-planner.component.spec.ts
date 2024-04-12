import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveButtonPlannerComponent } from './move-button-planner.component';

describe('MoveButtonPlannerComponent', () => {
  let component: MoveButtonPlannerComponent;
  let fixture: ComponentFixture<MoveButtonPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveButtonPlannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoveButtonPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
