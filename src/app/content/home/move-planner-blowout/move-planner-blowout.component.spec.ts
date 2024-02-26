import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovePlannerBlowoutComponent } from './move-planner-blowout.component';

describe('MovePlannerBlowoutComponent', () => {
  let component: MovePlannerBlowoutComponent;
  let fixture: ComponentFixture<MovePlannerBlowoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovePlannerBlowoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovePlannerBlowoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
