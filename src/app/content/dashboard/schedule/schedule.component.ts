import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { PageComponent } from '../../../shared/components/page-component';
import { PageService } from '../../../shared/services/page.service';
import { BehaviorSubject, Observable, map, of, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { JobsService } from '../../../shared/services/jobs.service';

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

    constructor(pageService: PageService, private jobsService: JobsService) {
        super(pageService);

        this.calendarOptions = {
            initialView: 'dayGridMonth',
            plugins: [dayGridPlugin],
            eventClick: this.eventClick,
            viewDidMount: viewInfo => {
                const start = viewInfo.view.activeStart.toISOString();
                const end = viewInfo.view.activeEnd.toISOString();
                this.getJobEvents(start, end).subscribe(events => this.events$.next(events))
            },
            datesSet: dateInfo => {
                const start = dateInfo.startStr;
                const end = dateInfo.endStr;
                this.getJobEvents(start, end).subscribe(events => this.events$.next(events))
            },
        }
    }

    getJobEvents(start: string, end: string): Observable<EventInput[]> {
        return this.jobsService.getJobs(start, end).pipe(
            map(jobs => jobs.map(job => {
                const eventInput: EventInput = {
                    title: job.customer.email,
                    start: job.startTime,
                    end: job.endTime
                };
                return eventInput;
            })
            ),
            take(1)
        );
    }

    eventClick(info: EventClickArg) {
    }
}
