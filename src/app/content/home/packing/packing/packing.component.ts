import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { StartMoveButtonComponent } from '../../../../shared/components/start-move-button/start-move-button.component';

@Component({
  selector: 'app-packing',
  standalone: true,
  imports: [TuiSvgModule, StartMoveButtonComponent],
  templateUrl: './packing.component.html',
  styleUrl: './packing.component.css'
})
export class PackingComponent {

}
