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
    { room: 'Bedroom', route: 'move-planner-modal' },
    { room: 'Bathroom', route: 'move-planner-modal' },
    { room: 'Garage', route: 'move-planner-modal' },
    { room: 'Utility Room', route: 'move-planner-modal' },
    { room: 'Patio/Deck', route: 'move-planner-modal' },
    { room: 'Study', route: 'move-planner-modal' },
    { room: 'Kitchen', route: 'move-planner-modal' },
    { room: 'Living Room', route: 'move-planner-modal' }
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
