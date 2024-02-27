import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-move-planner',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './move-planner.component.html',
  styleUrl: './move-planner.component.css'
})
export class MovePlannerComponent {
  dropdownOptions: string[] = ['Bedroom', 'Bathroom', 'Garage', 'Utility Room', 'Patio/Deck', 'Study', 'Kitchen', 'Living Room'];
  selectedOption: string;

}
