import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { PageComponent } from '../../../shared/components/page-component';
import { PageService } from '../../../shared/services/page.service';
import { BehaviorSubject, Observable, map, of, take } from 'rxjs';
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
    ngOnInit() {
        this.setTitle("Schedule");
    }

    events$ = new BehaviorSubject<EventInput>([]);
    calendarOptions: CalendarOptions;

    constructor(pageService: PageService,
        private session: SessionService,
        private router: Router,
        private jobsService: JobsService) {
        super(pageService);

        this.calendarOptions = {
            initialView: 'dayGridMonth',
            plugins: [dayGridPlugin],
            eventClick: this.eventClick.bind(this),
            viewDidMount: viewInfo => {
                console.log("mount");
                this.session.guardWithAuth(() => {
                    const start = viewInfo.view.activeStart.toISOString();
                    const end = viewInfo.view.activeEnd.toISOString();
                    this.getJobEvents(start, end).subscribe(events => this.events$.next(events))
                }).subscribe();
            },
            datesSet: dateInfo => {
                this.session.guardWithAuth(() => {
                    const start = dateInfo.startStr;
                    const end = dateInfo.endStr;
                    localStorage.setItem("calendarStart", start);
                    localStorage.setItem("calendarEnd", end);

                    this.getJobEvents(start, end).subscribe(events => this.events$.next(events))
                }).subscribe();
            },
        }

        const calendarStart = localStorage.getItem("calendarStart");
        // TODO: figure out proper solution
        if (calendarStart) {
            const date = new Date(calendarStart);
            date.setUTCDate(date.getUTCDate() + 5);
            this.calendarOptions.initialDate = date.toISOString();
        }
    }

    getJobEvents(start: string, end: string): Observable<EventInput[]> {
        return this.jobsService.getEmployeeJobs(start, end).pipe(
            map(jobs => jobs.map(job => {
                const eventInput: EventInput = {
                    title: job.customer.email,
                    start: job.startTime,
                    end: job.endTime,
                    extendedProps: {
                        jobId: job.jobId
                    }
                };
                return eventInput;
            })),
            take(1)
        );
    }

    eventClick(info: EventClickArg) {
        this.session.guardWithAuth(() => {
            const jobId: string = info.event.extendedProps.jobId;
            this.router.navigate(["dashboard/schedule/job/", jobId]);
        }).subscribe();
    }
}
