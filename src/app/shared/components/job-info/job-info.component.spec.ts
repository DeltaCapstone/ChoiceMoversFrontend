import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInfoComponent } from './job-info.component';

describe('JobInfoComponent', () => {
  let component: JobInfoComponent;
  let fixture: ComponentFixture<JobInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
