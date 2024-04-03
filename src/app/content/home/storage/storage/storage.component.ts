import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { MoveButtonComponent } from '../../../../shared/components/move-button/move-button.component';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [TuiSvgModule, MoveButtonComponent], 
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})
export class StorageComponent {
}
