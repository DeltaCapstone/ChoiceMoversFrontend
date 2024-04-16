import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { MoveButtonPlannerComponent } from '../../../../shared/components/move-button-planner/move-button-planner.component';

@Component({
  selector: 'app-packing',
  standalone: true,
  imports: [TuiSvgModule, MoveButtonPlannerComponent],
  templateUrl: './packing.component.html',
  styleUrl: './packing.component.css'
})
export class PackingComponent {

}
