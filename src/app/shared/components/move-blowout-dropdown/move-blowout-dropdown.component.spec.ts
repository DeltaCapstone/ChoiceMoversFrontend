import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveBlowoutDropdownComponent } from './move-blowout-dropdown.component';

describe('MoveBlowoutDropdownComponent', () => {
  let component: MoveBlowoutDropdownComponent;
  let fixture: ComponentFixture<MoveBlowoutDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveBlowoutDropdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoveBlowoutDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
