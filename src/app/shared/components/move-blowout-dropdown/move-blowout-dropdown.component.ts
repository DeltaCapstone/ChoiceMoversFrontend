import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TuiButtonModule, TuiDropdownModule } from '@taiga-ui/core';

@Component({
  selector: 'app-move-blowout-dropdown',
  standalone: true,
  imports: [TuiButtonModule, TuiDropdownModule],
  templateUrl: './move-blowout-dropdown.component.html',
  styleUrl: './move-blowout-dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoveBlowoutDropdownComponent {
  open = false;

  onClick(): void {
    this.open = !this.open;
  }

  onObscured(obscured: boolean) {
    if (obscured) {
      this.open = false;
    }
  }

  onActiveZone(active: boolean) {
    this.open = active && this.open;
  }
}
