import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, map, of, switchMap, take, tap } from 'rxjs';
import { Job } from '../../../../models/job.model';
import { TuiCheckboxModule, TuiFieldErrorPipeModule, TuiInputDateModule, TuiInputModule, TuiTabsModule, TuiTagModule, TuiTextareaModule } from '@taiga-ui/kit';
import { TuiDataListModule, TuiErrorModule, TuiLoaderModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiDay, TuiRepeatTimesModule } from '@taiga-ui/cdk';
import { TuiChipModule, TuiHeaderModule, TuiTitleModule } from '@taiga-ui/experimental';
import { JobsService } from '../../../services/jobs.service';
import { ActivatedRoute } from '@angular/router';
import { GoogleMap, MapDirectionsRenderer, MapDirectionsService, MapInfoWindow } from '@angular/google-maps';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { Address } from '../../../../models/address.model';
import { SessionService } from '../../../services/session.service';
import { EmployeeSessionServiceToken } from '../../../../app.config';
import { Employee } from '../../../../models/employee';

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
    directionsResults$: Observable<google.maps.DirectionsResult | undefined>;
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
    mapOptions: google.maps.MapOptions = {    
        center: {lat: 41.066078186035156, lng: -81.46630096435547},
        streetViewControl: false,
        zoom: 14,
        mapTypeControl: false
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
    }

    async ngAfterViewInit() {
        await this.initPlaceAutocomplete();
        this.directionsResults$ = this.session.scheduleSessionState.jobSessionState.directionsResults$.pipe(
            switchMap(cachedDirectionsResults => {
                if (cachedDirectionsResults){
                    return of(cachedDirectionsResults);
                }
                else {
                    return this.job$.pipe(
                        switchMap(job => {
                            if (job){
                                return this.updateDirectionsResults(this.makeStringFromAddress(job.loadAddr), this.makeStringFromAddress(job.unloadAddr));
                            }
                            else {
                                return of(undefined);
                            }
                        }),
                    )
                }
            }),
            tap(_ => this.mapLoading.next(false)),
        );

        const formSub = this.form.valueChanges.subscribe(_ => {
            this.updateDirectionsResults(this.form.value.loadAddr ?? "", this.form.value.unloadAddr ?? "");
        });        
        this.subscriptions.push(formSub);
    }

    constructor(
        @Inject(EmployeeSessionServiceToken) private session: SessionService<Employee>,
        private mapDirectionsService: MapDirectionsService,
        private jobsService: JobsService, 
        private route: ActivatedRoute) {
        super();
    }

    updateDirectionsResults(origin: google.maps.LatLng | string, dest: google.maps.LatLng | string): Observable<google.maps.DirectionsResult | undefined> {
        const request: google.maps.DirectionsRequest = {
            origin: origin,
            destination: dest,
            travelMode: google.maps.TravelMode.DRIVING,
        };
        return this.mapDirectionsService.route(request).pipe(
            tap(res => this.session.scheduleSessionState.jobSessionState.directionsResults$.next(res.result)),
            map(res => res.result));
    }

    private async initPlaceAutocomplete() {
        const { Autocomplete } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

        const loadAddrElem = document.querySelector("#loadAddr") as HTMLInputElement;
        const loadAutocomplete = new Autocomplete(loadAddrElem,
            {
                componentRestrictions: { country: 'US' },
                types: ["address"],
                fields: ["formatted_address"] 
            });

        const unloadAddrElem = document.querySelector("#unloadAddr") as HTMLInputElement;
        const unloadAutoComplete = new Autocomplete(unloadAddrElem,
            {
                componentRestrictions: { country: 'US' },
                types: ["address"],
                fields: ["formatted_address"] 
            });

        google.maps.event.addListener(loadAutocomplete, "place_changed", () => {
            const place = loadAutocomplete.getPlace();
            this.form.patchValue({
                loadAddr: place.formatted_address
            });
            this.updateDirectionsResults(place.formatted_address ?? "", this.form.value.unloadAddr ?? "").pipe(take(1)).subscribe();
        });

        google.maps.event.addListener(unloadAutoComplete, "place_changed", () => {
            const place = unloadAutoComplete.getPlace();
            this.form.patchValue({
                unloadAddr: place.formatted_address
            });
            this.updateDirectionsResults(this.form.value.loadAddr ?? "", place.formatted_address ?? "").pipe(take(1)).subscribe();
        });
    }

    
    makeStringFromAddress(addr: Address): string {
        return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}, USA`;
    }

    updateAddressWithString(addr: Address, addrString: String): Address {
        const [street, city, stateAndZip] = addrString.split(",");
        addr.street = street.trim();
        addr.city = city.trim();
        addr.state = stateAndZip.split(' ')[0].trim();
        addr.zip = stateAndZip.split(' ')[1].trim();
        return addr;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
