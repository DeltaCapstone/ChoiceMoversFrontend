import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { JobInfoComponent } from './job-info/job-info.component';
import { BaseComponent } from '../base-component';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiTabsModule } from '@taiga-ui/kit';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-job',
    standalone: true,
    imports: [JobInfoComponent, RouterOutlet, RouterModule, TuiSvgModule, TuiTabsModule],
    templateUrl: './job.component.html',
    styleUrl: './job.component.css'
})
export class JobComponent extends BaseComponent {
    constructor(
        private session: SessionService,
        private router: Router) {
        super();
    }

    back() {
        this.session.scheduleSessionState.jobId = "";
        this.router.navigate(["/dashboard/schedule"]);
    }
}
