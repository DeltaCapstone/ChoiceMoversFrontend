import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCompletionComponent } from './job-completion.component';

describe('JobCompletionComponent', () => {
  let component: JobCompletionComponent;
  let fixture: ComponentFixture<JobCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCompletionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
