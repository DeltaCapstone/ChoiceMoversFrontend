import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { MoveButtonPlannerComponent } from '../../../../shared/components/move-button-planner/move-button-planner.component';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [TuiSvgModule, MoveButtonPlannerComponent], 
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})
export class StorageComponent {
}
