import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovePlannerComponent } from './move-planner.component';

describe('MovePlannerComponent', () => {
  let component: MovePlannerComponent;
  let fixture: ComponentFixture<MovePlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovePlannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
