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
    {room: 'Bedroom', route: 'bedroom'},
    {room: 'Bathroom', route: 'bathroom'},
    {room: 'Garage', route: 'garage'},
    {room: 'Utility Room', route: 'utility-room'},
    {room: 'Patio/Deck', route: 'patio'},
    {room: 'Study', route: 'study'},
    {room: 'Kitchen', route: 'kitchen'},
    {room: 'Living Room', route: 'living-room'}     
  ];

  selectedOption: string;

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
    if(active) {
      this.open = true;
    }
  }
}
