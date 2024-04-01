import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { StartMoveButtonComponent } from '../../../../shared/components/start-move-button/start-move-button.component';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [TuiSvgModule, StartMoveButtonComponent], 
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})
export class StorageComponent {
}
