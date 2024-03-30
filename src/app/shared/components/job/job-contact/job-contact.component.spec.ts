import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobContactComponent } from './job-contact.component';

describe('JobContactComponent', () => {
  let component: JobContactComponent;
  let fixture: ComponentFixture<JobContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
