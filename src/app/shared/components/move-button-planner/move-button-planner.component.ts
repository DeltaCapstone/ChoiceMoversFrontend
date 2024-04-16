import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-move-button-planner',
  standalone: true,
  imports: [],
  templateUrl: './move-button-planner.component.html',
  styleUrl: './move-button-planner.component.css'
})
export class MoveButtonPlannerComponent {

  constructor(private router: Router) { }

  navigateToMovingPage() {
    this.router.navigate(['/home/move-planner'])
  }
}
