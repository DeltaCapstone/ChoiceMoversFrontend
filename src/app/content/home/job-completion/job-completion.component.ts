import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-completion',
  standalone: true,
  imports: [],
  templateUrl: './job-completion.component.html',
  styleUrl: './job-completion.component.css'
})
export class JobCompletionComponent {
  constructor(private _router: Router) { }

  navigateToHome() {
    this._router.navigate(["/home"]);
  }
}
