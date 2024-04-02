import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, combineLatest, map, switchMap, tap } from 'rxjs';
import { Job } from '../../../../models/job.model';
import { TuiCheckboxModule, TuiFieldErrorPipeModule, TuiInputDateModule, TuiInputModule, TuiTabsModule, TuiTagModule, TuiTextareaModule } from '@taiga-ui/kit';
import { TuiDataListModule, TuiErrorModule, TuiLoaderModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiDay, TuiLetModule, TuiRepeatTimesModule } from '@taiga-ui/cdk';
import { TuiChipModule, TuiHeaderModule, TuiTitleModule } from '@taiga-ui/experimental';
import { JobsService } from '../../../services/jobs.service';
import { ActivatedRoute } from '@angular/router';
import { GoogleMap, MapDirectionsRenderer, MapDirectionsService, MapInfoWindow } from '@angular/google-maps';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { Address } from '../../../../models/address.model';

@Component({
    selector: 'app-job-info',
    standalone: true,
    imports: [ReactiveFormsModule, TuiInputModule, CommonModule, TuiInputDateModule, TuiTagModule, TuiTextareaModule,
        TuiErrorModule, TuiFieldErrorPipeModule, TuiTabsModule, TuiSvgModule, TuiCheckboxModule, TuiChipModule, FormsModule,
        TuiRepeatTimesModule, TuiHeaderModule, TuiTitleModule, TuiTextfieldControllerModule,
        GoogleMap, MapDirectionsRenderer, MapInfoWindow, TuiDataListModule, TuiLoaderModule],
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
        loadAddr: new FormControl(""),
        unloadAddr: new FormControl("")
    });
    checked: Array<Array<String | boolean>> = [];
    status = "Pending";
    // map state
    directionsResults$: Observable<google.maps.DirectionsResult|undefined>;
    mapOptions: google.maps.MapOptions = {    
        center: {lat: 41.066078186035156, lng: -81.46630096435547},
        streetViewControl: false,
        zoom: 14
    }
    mapLoading = new BehaviorSubject(true);

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
                loadAddr: this.makeStringFromAddress(job.loadAddr),
                unloadAddr: this.makeStringFromAddress(job.unloadAddr)
            });
        });
        this.subscriptions.push(jobSub);

        this.directionsResults$ = this.job$.pipe(
            switchMap(job => {
                return combineLatest([
                    this.mapsService.geocodeAddress(job?.loadAddr ? this.makeStringFromAddress(job.loadAddr) : ""),
                    this.mapsService.geocodeAddress(job?.unloadAddr ? this.makeStringFromAddress(job.unloadAddr) : ""),
                ]);
            }),
            switchMap(([origin, dest]) => {
                const request: google.maps.DirectionsRequest = {
                    origin: origin,
                    destination: dest,
                    travelMode: google.maps.TravelMode.DRIVING,
                };
                return this.mapDirectionsService.route(request).pipe(
                    tap(_ => this.mapLoading.next(false)),
                    map(res => res.result));
            }),
        )
    }

    constructor(
        private mapsService: GoogleMapsLoaderService,
        private mapDirectionsService: MapDirectionsService,
        private jobsService: JobsService, 
        private route: ActivatedRoute) {
        super();
    }

    makeStringFromAddress(addr: Address): string {
        return `${addr.street} ${addr.city} ${addr.state} ${addr.zip}`;
    }

    ngAfterViewInit() {
        this.getPlaceAutocomplete();
    }

    private async getPlaceAutocomplete() {
        const loadAddrElem = document.querySelector("#loadAddr") as HTMLInputElement;

        const { Autocomplete } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
        new Autocomplete(loadAddrElem,
            {
                componentRestrictions: { country: 'US' },
                types: ["address"],
            });
    }

    updateAddressWithString(addr: Address, addrString: String): Address {
        const [street, city, state, zip] = addrString.split(" ");
        addr.street = street;
        addr.city = city;
        addr.state = state;
        addr.zip = zip;
        return addr;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
