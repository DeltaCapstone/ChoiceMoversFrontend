import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-customer-summary',
  standalone: true,
  imports: [TuiSvgModule],
  templateUrl: './customer-summary.component.html',
  styleUrl: './customer-summary.component.css'
})
export class CustomerSummaryComponent {
  constructor(private _router: Router) { }

  navigateBackToMovePlanner() {
    this._router.navigate(['/home/move-planner'])
  }
}
