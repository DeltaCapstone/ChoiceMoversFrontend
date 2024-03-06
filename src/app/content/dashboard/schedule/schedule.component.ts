import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { PageComponent } from '../../../shared/components/page-component';
import { PageService } from '../../../shared/services/page.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
    imports: [FullCalendarModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent extends PageComponent {
    ngOnInit(){
        this.setTitle("Schedule");
    }
    
    constructor(pageService: PageService){
        super(pageService);
    }
    
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin],
        eventClick: this.eventClick,
        events: [
            {
                title: "test",
                start: "2024-03-06",
                end: "2024-03-08"
            }
        ]
    }

    eventClick(info: EventClickArg){
        console.log(info.event.title);
    }
}
