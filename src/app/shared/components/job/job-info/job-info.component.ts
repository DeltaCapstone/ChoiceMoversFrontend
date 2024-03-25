import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Job } from '../../../../models/job.model';
import { TuiCheckboxModule, TuiFieldErrorPipeModule, TuiInputDateModule, TuiInputModule, TuiTabsModule, TuiTagModule, TuiTextareaModule } from '@taiga-ui/kit';
import { TuiErrorModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiDay, TuiRepeatTimesModule } from '@taiga-ui/cdk';
import { TuiChipModule, TuiHeaderModule, TuiTitleModule } from '@taiga-ui/experimental';

@Component({
    selector: 'app-job-info',
    standalone: true,
    imports: [ReactiveFormsModule, TuiInputModule, CommonModule, TuiInputDateModule, TuiTagModule, TuiTextareaModule,
        TuiErrorModule, TuiFieldErrorPipeModule, TuiTabsModule, TuiSvgModule, TuiCheckboxModule, TuiChipModule, FormsModule,
        TuiRepeatTimesModule, TuiHeaderModule, TuiTitleModule, TuiTextfieldControllerModule],
    templateUrl: './job-info.component.html',
    styleUrl: './job-info.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobInfoComponent extends BaseComponent {
    job$: Observable<Job | undefined>;
    subscriptions: Subscription[] = [];

    form = new FormGroup({
        jobId: new FormControl(""),
        startTime: new FormControl(TuiDay.currentLocal()),
        endTime: new FormControl(TuiDay.currentLocal()),
        notes: new FormControl(""),
        loadAddrStreet: new FormControl(""),
        loadAddrCity: new FormControl(""),
        loadAddrZip: new FormControl(""),
        loadAddrState: new FormControl(""),
        unloadAddrStreet: new FormControl(""),
        unloadAddrCity: new FormControl(""),
        unloadAddrZip: new FormControl(""),
        unloadAddrState: new FormControl(""),
    });
    checked: Array<Array<String | boolean>>;
    status = "Pending";

    ngOnInit() {
        const jobSub = this.job$.subscribe(job => {
            this.checked = [
                ["Truck", !!job?.needTruck, "needsTruck"],
                ["Load", !!job?.load, "load"],
                ["Unload", !!job?.unload, "unload"],
                ["Pack", !!job?.pack, "pack"],
                ["Unpack", !!job?.unpack, "clean"],
            ];

            this.status = job?.finalized ? "Finalized" : "Pending";

            this.form.patchValue({
                jobId: job?.jobId ?? "",
                startTime: job?.startTime ? TuiDay.fromUtcNativeDate(new Date(job.startTime)) : TuiDay.currentLocal(),
                endTime: job?.endTime ? TuiDay.fromUtcNativeDate(new Date(job.endTime)) : TuiDay.currentLocal(),
                notes: job?.notes ?? "",
                loadAddrStreet: job?.loadAddr?.street,
                loadAddrCity: job?.loadAddr?.city,
                loadAddrZip: job?.loadAddr?.zip,
                loadAddrState: job?.loadAddr?.state,
                unloadAddrStreet: job?.unloadAddr?.street,
                unloadAddrCity: job?.unloadAddr?.city,
                unloadAddrZip: job?.unloadAddr?.zip,
                unloadAddrState: job?.unloadAddr?.state,
            });
        });
        this.subscriptions.push(jobSub);
    }

    constructor() {
        super();
    }


    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
