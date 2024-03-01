import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { MoveBlowoutDropdownComponent } from '../../../../shared/components/move-blowout-dropdown/move-blowout-dropdown.component';

@Component({
  selector: 'app-move-planner',
  standalone: true,
  imports: [CommonModule, NgFor, MoveBlowoutDropdownComponent],
  templateUrl: './move-planner.component.html',
  styleUrl: './move-planner.component.css'
})

export class MovePlannerComponent {

}
