import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovePlannerModalCountInputComponent } from './move-planner-modal-count-input.component';

describe('MovePlannerModalCountInputComponent', () => {
  let component: MovePlannerModalCountInputComponent;
  let fixture: ComponentFixture<MovePlannerModalCountInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovePlannerModalCountInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovePlannerModalCountInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
