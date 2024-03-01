import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovePlannerModalComponent } from './move-planner-modal.component';

describe('MovePlannerModalComponent', () => {
  let component: MovePlannerModalComponent;
  let fixture: ComponentFixture<MovePlannerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovePlannerModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovePlannerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
