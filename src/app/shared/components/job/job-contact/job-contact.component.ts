import { Component } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Job } from '../../../../models/job.model';
import { JobsService } from '../../../services/jobs.service';
import { ActivatedRoute } from '@angular/router';
import { TuiFieldErrorPipeModule, TuiInputModule, TuiInputPhoneModule } from '@taiga-ui/kit';
import { TuiErrorModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-contact',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TuiInputModule, CommonModule,
    TuiInputPhoneModule, TuiErrorModule, TuiFieldErrorPipeModule],
  templateUrl: './job-contact.component.html',
  styleUrl: './job-contact.component.css'
})
export class JobContactComponent extends BaseComponent {
    subscriptions: Subscription[] = [];
    job$: Observable<Job | undefined>;
    form = new FormGroup({
        userName: new FormControl(""),
        firstName: new FormControl(""),
        lastName: new FormControl(""),
        email: new FormControl(""),
        phonePrimary: new FormControl(""),
    });

    ngOnInit() {
        const jobId = this.route.parent?.snapshot?.paramMap?.get("jobId") ?? "";
        this.job$ = this.jobsService.getJob(jobId);
        const jobSub = this.job$.subscribe(job => {
            if (!job) return;
            const customer = job.customer;
            this.form.patchValue({
                userName: customer.userName,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phonePrimary: customer.phonePrimary 
            })
        });
        this.subscriptions.push(jobSub);
    }

    constructor(private jobsService: JobsService, private route: ActivatedRoute) {
        super();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
