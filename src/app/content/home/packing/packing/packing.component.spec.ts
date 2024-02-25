import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingComponent } from './packing.component';

describe('PackingComponent', () => {
  let component: PackingComponent;
  let fixture: ComponentFixture<PackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
