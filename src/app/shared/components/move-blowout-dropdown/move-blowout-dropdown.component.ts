import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TuiButtonModule, TuiDropdownModule } from '@taiga-ui/core';
import { NgFor, } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';



type DropDownItem = {
  readonly room: string
  readonly route: string
}

@Component({
  selector: 'app-move-blowout-dropdown',
  standalone: true,
  imports: [TuiButtonModule, TuiDropdownModule, NgFor, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './move-blowout-dropdown.component.html',
  styleUrl: './move-blowout-dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoveBlowoutDropdownComponent {

  items: DropDownItem[] = [
    { room: 'Bedroom', route: 'move-planner-blowout' },
    { room: 'Bathroom', route: 'move-planner-blowout' },
    { room: 'Garage', route: 'move-planner-blowout' },
    { room: 'Utility Room', route: 'move-planner-blowout' },
    { room: 'Patio/Deck', route: 'move-planner-blowout' },
    { room: 'Study', route: 'move-planner-blowout' },
    { room: 'Kitchen', route: 'move-planner-blowout' },
    { room: 'Living Room', route: 'move-planner-blowout' }
  ];

  selectedOption: DropDownItem;
  blowoutIsOpen: boolean = false;
  open: boolean = false;

  onClick(): void {
    this.open = !this.open;
  }

  onObscured(obscured: boolean): void {
    if (obscured) {
      this.open = false;
    }
  }

  onActiveZone(active: boolean): void {
    if (active) {
      this.open = true;
    }
  }

  onSelect(item: DropDownItem): void {
    this.selectedOption = item;
    this.blowoutIsOpen = true;
  }
}
