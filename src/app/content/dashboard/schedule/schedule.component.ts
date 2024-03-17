import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { PageComponent } from '../../../shared/components/page-component';
import { PageService } from '../../../shared/services/page.service';
import { Observable, map, of, take } from 'rxjs';
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

    events$: Observable<EventInput>;
    calendarOptions: CalendarOptions; 

    constructor(pageService: PageService, private jobsService: JobsService, private cdr: ChangeDetectorRef) {
        super(pageService);

        this.calendarOptions = {
            initialView: 'dayGridMonth',
            plugins: [dayGridPlugin],
            eventClick: this.eventClick,
            viewDidMount: viewInfo => {
                const start = viewInfo.view.activeStart.toISOString();
                const end = viewInfo.view.activeEnd.toISOString();
                this.events$ = this.getJobEvents(start, end);
            },
            datesSet: dateInfo => {
                const start = dateInfo.startStr;
                const end = dateInfo.endStr;
                this.events$ = this.getJobEvents(start, end);
                this.cdr.detectChanges();
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
