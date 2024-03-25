import { Component, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { PageComponent } from '../../../shared/components/page-component';
import { PageService } from '../../../shared/services/page.service';
import { BehaviorSubject, Observable, map, switchMap, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { JobsService } from '../../../shared/services/jobs.service';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';

@Component({
    selector: 'app-schedule',
    standalone: true,
    imports: [FullCalendarModule, CommonModule],
    templateUrl: './schedule.component.html',
    styleUrl: './schedule.component.css',
})
export class ScheduleComponent extends PageComponent {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    calendarOptions: CalendarOptions;

    getJobEvents(start: string, end: string): Observable<EventInput[]> {
        return this.jobsService.getEmployeeJobs(start, end).pipe(
            map(jobs => jobs.map(job => {
                console.log(job);
                const eventInput: EventInput = {
                    title: job.customer.email,
                    start: job.startTime,
                    end: job.endTime,
                    extendedProps: {
                        jobId: job.jobId
                    }
                };
                return eventInput;
            }))
        );
    }

    ngOnInit() {
        this.setTitle("Schedule");

        this.calendarOptions = {
            initialView: 'dayGridMonth',
            plugins: [dayGridPlugin],
            eventClick: this.eventClick.bind(this),
            datesSet: dateInfo => {
                this.session.guardWithAuth().pipe(
                    switchMap(_ => this.getJobEvents(dateInfo.startStr, dateInfo.endStr)),
                    take(1)
                ).subscribe(events => this.setEvents(events));
            }
        }

        // restore state
        const calendarStart = this.jobsService.cacheStartDate;
        // TODO: figure out better solution
        if (calendarStart) {
            const date = new Date(calendarStart);
            date.setUTCDate(date.getUTCDate() + 5);
            this.calendarOptions.initialDate = date.toISOString();
        }
    }

    constructor(pageService: PageService,
        private session: SessionService,
        private router: Router,
        private jobsService: JobsService) {
        super(pageService);
    }

    setEvents(events: EventInput[]) {
        let calendarApi = this.calendarComponent.getApi();
        calendarApi.removeAllEventSources();
        calendarApi.addEventSource(events);
    }

    eventClick(info: EventClickArg) {
        this.session.guardWithAuth().subscribe(_ => {
            const jobId: string = info.event.extendedProps.jobId;
            this.router.navigate(["dashboard/schedule/job/", jobId]);
        });
    }
}
