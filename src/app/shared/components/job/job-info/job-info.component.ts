import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, map, switchMap } from 'rxjs';
import { Job } from '../../../../models/job.model';
import { TuiCheckboxModule, TuiFieldErrorPipeModule, TuiInputDateModule, TuiInputModule, TuiTabsModule, TuiTagModule, TuiTextareaModule } from '@taiga-ui/kit';
import { TuiErrorModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiDay, TuiRepeatTimesModule } from '@taiga-ui/cdk';
import { TuiChipModule, TuiHeaderModule, TuiTitleModule } from '@taiga-ui/experimental';
import { JobsService } from '../../../services/jobs.service';
import { ActivatedRoute } from '@angular/router';
import { GoogleMap, MapDirectionsRenderer, MapDirectionsService, MapInfoWindow } from '@angular/google-maps';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';

@Component({
    selector: 'app-job-info',
    standalone: true,
    imports: [ReactiveFormsModule, TuiInputModule, CommonModule, TuiInputDateModule, TuiTagModule, TuiTextareaModule,
        TuiErrorModule, TuiFieldErrorPipeModule, TuiTabsModule, TuiSvgModule, TuiCheckboxModule, TuiChipModule, FormsModule,
        TuiRepeatTimesModule, TuiHeaderModule, TuiTitleModule, TuiTextfieldControllerModule,
        GoogleMap, MapDirectionsRenderer, MapInfoWindow],
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
    checked: Array<Array<String | boolean>> = [];
    status = "Pending";
    // map state
    center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
    zoom = 4;
    directionsResults$: Observable<google.maps.DirectionsResult|undefined>;
    @ViewChild(MapInfoWindow) info!: MapInfoWindow;

    ngOnInit() {
        const jobId = this.route.parent?.snapshot?.paramMap?.get("jobId") ?? "";
        this.job$ = this.jobsService.getJob(jobId);
        const jobSub = this.job$.subscribe(job => {
            if (!job) return;
            this.checked = [
                ["Truck", !!job.needTruck, "needsTruck"],
                ["Load", !!job.load, "load"],
                ["Unload", !!job.unload, "unload"],
                ["Pack", !!job.pack, "pack"],
                ["Unpack", !!job.unpack, "clean"],
            ];

            this.status = job?.finalized ? "Finalized" : "Pending";

            this.form.patchValue({
                jobId: job.jobId,
                startTime: TuiDay.fromUtcNativeDate(new Date(job.startTime)),
                endTime: TuiDay.fromUtcNativeDate(new Date(job.endTime)),
                notes: job.notes,
                loadAddrStreet: job.loadAddr.street,
                loadAddrCity: job.loadAddr.city,
                loadAddrZip: job.loadAddr.zip,
                loadAddrState: job.loadAddr.state,
                unloadAddrStreet: job.unloadAddr.street,
                unloadAddrCity: job.unloadAddr.city,
                unloadAddrZip: job.unloadAddr.zip,
                unloadAddrState: job.unloadAddr.state,
            });
        });
        this.subscriptions.push(jobSub);

        this.directionsResults$ = this.job$.pipe(
            switchMap(job => {
                const request: google.maps.DirectionsRequest = {
                    destination: {lat: 12, lng: 4},
                    origin: {lat: 14, lng: 8},
                    travelMode: google.maps.TravelMode.DRIVING,
                };
                return this.mapDirectionsService.route(request).pipe(map(res => res.result));
            })
        )
    }

    constructor(
        private mapsService: GoogleMapsLoaderService,
        private mapDirectionsService: MapDirectionsService,
        private jobsService: JobsService, 
        private route: ActivatedRoute) {
        super();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
