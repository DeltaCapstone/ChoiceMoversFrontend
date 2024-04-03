import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { MoveButtonComponent } from '../../../../shared/components/move-button/move-button.component';

@Component({
  selector: 'app-packing',
  standalone: true,
  imports: [TuiSvgModule, MoveButtonComponent],
  templateUrl: './packing.component.html',
  styleUrl: './packing.component.css'
})
export class PackingComponent {

}
