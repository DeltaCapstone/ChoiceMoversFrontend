import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobWorkersComponent } from './job-workers.component';

describe('JobWorkersComponent', () => {
  let component: JobWorkersComponent;
  let fixture: ComponentFixture<JobWorkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobWorkersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobWorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
