import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartMoveButtonComponent } from './start-move-button.component';

describe('StartMoveButtonComponent', () => {
  let component: StartMoveButtonComponent;
  let fixture: ComponentFixture<StartMoveButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartMoveButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartMoveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
