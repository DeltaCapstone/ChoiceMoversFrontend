import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-move-button',
  standalone: true,
  imports: [],
  templateUrl: './start-move-button.component.html',
  styleUrl: './start-move-button.component.css'
})
export class StartMoveButtonComponent {
  constructor(private router: Router) { }

  navigateToMovePlannerPage() {
    this.router.navigate(['/home/move-planner'])
  }
}
