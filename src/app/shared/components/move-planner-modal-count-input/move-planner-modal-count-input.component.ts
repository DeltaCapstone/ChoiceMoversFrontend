import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-move-planner-modal-count-input',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './move-planner-modal-count-input.component.html',
  styleUrl: './move-planner-modal-count-input.component.css',
})
export class MovePlannerModalCountInputComponent {
  value = 0;
}
