import { Component, Inject, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { PageComponent } from '../../../shared/components/page-component';
import { PageService } from '../../../shared/services/page.service';
import { Observable, combineLatest, map, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { JobsService } from '../../../shared/services/jobs.service';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';
import { Employee, EmployeeType } from '../../../models/employee';
import { EmployeeSessionServiceToken } from '../../../app.config';

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
        return combineLatest([this.jobsService.getEmployeeJobs(start, end), this.session.getUser()]).pipe(
            map(([jobs, user]) => jobs
                .filter(job => user?.employeeType == EmployeeType.Manager || 
                    (user?.employeeType as EmployeeType != EmployeeType.Manager && job.finalized))
                .map(job => {
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
                // update calendar
                this.session.isUserAuthorized().subscribe(isAuthorized => {
                    if (!isAuthorized) {
                        this.session.redirectToLogin();
                        return;
                    };

                    this.getJobEvents(dateInfo.startStr, dateInfo.endStr).pipe(take(1)).subscribe(events => {
                        // update session cache
                        const [earliestDate, latestDate] = this.getBoundaryDates(events);
                        this.session.scheduleSessionState.jobsStartDate = earliestDate;
                        this.session.scheduleSessionState.jobsEndDate = latestDate;

                        // update calendar
                        this.setEvents(events)
                    })
                });
            }
        }

        // restore state
        const cachedCalendarStart = this.session.scheduleSessionState.jobsStartDate;
        // TODO: figure out better solution
        if (cachedCalendarStart) {
            const date = new Date(cachedCalendarStart);
            date.setUTCDate(date.getUTCDate() + 5);
            this.calendarOptions.initialDate = date.toISOString();
        }
        const cachedJobId = this.session.scheduleSessionState.jobSessionState.jobId;
        if (cachedJobId) {
            this.router.navigate(["dashboard/schedule/job/", cachedJobId]);
        }
    }

    constructor(pageService: PageService,
        @Inject(EmployeeSessionServiceToken) private session: SessionService<Employee>,
        private router: Router,
        private jobsService: JobsService) {
        super(pageService);
    }

    setEvents(events: EventInput[]) {
        let calendarApi: Calendar | null = this.calendarComponent.getApi();
        if (calendarApi) {
            calendarApi.removeAllEventSources();
            calendarApi.addEventSource(events);
        }
    }
    private getBoundaryDates(events: EventInput[]): [string, string] {
        if (events.length === 0) {
            return ["", ""];
        }

        const earliestStartDate = events
            .filter(event => event.start)
            .reduce((earliest, current) => {
                const earliestDate = new Date(earliest);
                const currentDate = new Date(current.start?.toString()!);
                return currentDate < earliestDate ? current.start?.toString()! : earliest;
            }, events[0].start?.toString()!);

        const latestEndDate = events
            .filter(event => event.end)
            .reduce((latest, current) => {
                const latestDate = new Date(latest);
                const currentDate = new Date(current.end?.toString()!);
                return currentDate > latestDate ? current.end?.toString()! : latest;
            }, events[0].end?.toString()!);

        return [earliestStartDate, latestEndDate];
    }

    eventClick(info: EventClickArg) {
        this.session.isUserAuthorized().subscribe(isAuthorized => {
            if (isAuthorized){
                const jobId: string = info.event.extendedProps.jobId;
                this.session.scheduleSessionState.jobSessionState.jobId = jobId;
                this.router.navigate(["dashboard/schedule/job/", jobId]);
            }
            else {
                this.session.redirectToLogin();
            }
        });
    }
}
