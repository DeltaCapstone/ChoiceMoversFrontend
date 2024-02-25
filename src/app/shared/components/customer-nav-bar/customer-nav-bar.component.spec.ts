import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerNavBarComponent } from './customer-nav-bar.component';

describe('CustomerNavBarComponent', () => {
  let component: CustomerNavBarComponent;
  let fixture: ComponentFixture<CustomerNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
