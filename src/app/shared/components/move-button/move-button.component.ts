import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-move-button',
  standalone: true,
  imports: [],
  templateUrl: './move-button.component.html',
  styleUrl: './move-button.component.css'
})
export class MoveButtonComponent {

  constructor(private router: Router) { }

  navigateToMovingPage() {
    this.router.navigate(['/home/moving'])
  }
}
