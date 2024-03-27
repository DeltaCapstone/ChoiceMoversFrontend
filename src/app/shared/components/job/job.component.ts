import { Component, Inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { JobInfoComponent } from './job-info/job-info.component';
import { BaseComponent } from '../base-component';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiTabsModule } from '@taiga-ui/kit';
import { SessionService } from '../../services/session.service';
import { SessionType } from '../../../models/session.model';
import { Employee } from '../../../models/employee';

@Component({
    selector: 'app-job',
    standalone: true,
    imports: [JobInfoComponent, RouterOutlet, RouterModule, TuiSvgModule, TuiTabsModule],
    templateUrl: './job.component.html',
    styleUrl: './job.component.css'
})
export class JobComponent extends BaseComponent {
    constructor(
        @Inject(SessionType.Employee) private session: SessionService<Employee>,
        private router: Router) {
        super();
    }

    back() {
        this.session.scheduleSessionState.jobId = "";
        this.router.navigate(["/dashboard/schedule"]);
    }
}
