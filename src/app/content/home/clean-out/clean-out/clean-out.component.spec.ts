import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanOutComponent } from './clean-out.component';

describe('CleanOutComponent', () => {
  let component: CleanOutComponent;
  let fixture: ComponentFixture<CleanOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleanOutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleanOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
