import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapsComponentComponent } from './google-maps-component.component';

describe('GoogleMapsComponentComponent', () => {
  let component: GoogleMapsComponentComponent;
  let fixture: ComponentFixture<GoogleMapsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleMapsComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoogleMapsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
