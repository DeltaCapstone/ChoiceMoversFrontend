import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, catchError, combineLatest, from, map, switchMap } from 'rxjs';
import { Job } from '../../../../models/job.model';
import { TuiCheckboxModule, TuiFieldErrorPipeModule, TuiInputDateModule, TuiInputModule, TuiTabsModule, TuiTagModule, TuiTextareaModule } from '@taiga-ui/kit';
import { TuiDataListModule, TuiErrorModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiDay, TuiRepeatTimesModule } from '@taiga-ui/cdk';
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
        GoogleMap, MapDirectionsRenderer, MapInfoWindow, TuiDataListModule],
    templateUrl: './job-info.component.html',
    styleUrl: './job-info.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobInfoComponent extends BaseComponent {
    job$: Observable<Job | undefined>;
    subscriptions: Subscription[] = [];

    tempList: string[] = [
        "test"
    ]
 
    form = new FormGroup({
        jobId: new FormControl(""),
        startTime: new FormControl(TuiDay.currentLocal()),
        endTime: new FormControl(TuiDay.currentLocal()),
        notes: new FormControl(""),
        loadAddrStreet: new FormControl(""),
        loadAddrCity: new FormControl(""),
        loadAddrZip: new FormControl(""),
        loadAddrState: new FormControl(""),
        loadAddrString: new FormControl(""),
        unloadAddrStreet: new FormControl(""),
        unloadAddrCity: new FormControl(""),
        unloadAddrZip: new FormControl(""),
        unloadAddrState: new FormControl(""),
        unloadAddrString: new FormControl("")
    });
    checked: Array<Array<String | boolean>> = [];
    status = "Pending";
    // map state
    center: google.maps.LatLngLiteral = {lat: 41.066078186035156, lng: -81.46630096435547};
    zoom = 14;
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
                loadAddrString: this.makeStringFromAddress(job.loadAddr),
                unloadAddrStreet: job.unloadAddr.street,
                unloadAddrCity: job.unloadAddr.city,
                unloadAddrZip: job.unloadAddr.zip,
                unloadAddrState: job.unloadAddr.state,
                unloadAddrString: this.makeStringFromAddress(job.unloadAddr)
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
                return this.mapDirectionsService.route(request).pipe(map(res => res.result));
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
        console.log(loadAddrElem);

        const { Autocomplete } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
        const autocomplete = new Autocomplete(loadAddrElem,
            {
                componentRestrictions: { country: 'US' },
                fields: ["address_components", "geometry"],
                types: ["address"],
            });

        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            console.log(autocomplete.getPlace());
            this.form.patchValue({
                loadAddrString: autocomplete.getPlace().adr_address
            });
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
