import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { MoveBlowoutDropdownComponent } from '../../../../shared/components/move-blowout-dropdown/move-blowout-dropdown.component';
import { MatDialog } from '@angular/material/dialog';
import { MovePlannerModalComponent } from '../../move-planner-modal/move-planner-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'

type DropDownItem = {
  readonly room: string;
  readonly route: string;
  readonly roomItems: string[];
}

@Component({
  selector: 'app-move-planner',
  standalone: true,
  imports: [CommonModule, NgFor, MoveBlowoutDropdownComponent, MatMenuModule, MatDialogModule, MatIconModule],
  templateUrl: './move-planner.component.html',
  styleUrl: './move-planner.component.css'
})

export class MovePlannerComponent {

  isMenuOpen: boolean = false;

  items: DropDownItem[] = [
    {
      room: 'Bedroom', route: 'move-planner-modal', roomItems: [
        'Bed Frame', 'Mattress', 'Paintings', 'Chairs', 'T.V.', 'Nightstand', 'Dresser', 'Lighting'
      ]
    },
    {
      room: 'Bathroom', route: 'move-planner-modal', roomItems: [
        'Bed Frame', 'Mattress', 'Paintings', 'Chairs', 'T.V.', 'Nightstand', 'Dresser', 'Lighting'
      ]
    },
    {
      room: 'Garage', route: 'move-planner-modal', roomItems: [
        'Bed Frame', 'Mattress', 'Paintings', 'Chairs', 'T.V.', 'Nightstand', 'Dresser', 'Lighting'
      ]
    },
    {
      room: 'Utility Room', route: 'move-planner-modal', roomItems: [
        'Bed Frame', 'Mattress', 'Paintings', 'Chairs', 'T.V.', 'Nightstand', 'Dresser', 'Lighting'
      ]
    },
    {
      room: 'Patio/Deck', route: 'move-planner-modal', roomItems: [
        'Bed Frame', 'Mattress', 'Paintings', 'Chairs', 'T.V.', 'Nightstand', 'Dresser', 'Lighting'
      ]
    },
    {
      room: 'Study', route: 'move-planner-modal', roomItems: [
        'Bed Frame', 'Mattress', 'Paintings', 'Chairs', 'T.V.', 'Nightstand', 'Dresser', 'Lighting'
      ]
    },
    {
      room: 'Kitchen', route: 'move-planner-modal', roomItems: [
        'Bed Frame', 'Mattress', 'Paintings', 'Chairs', 'T.V.', 'Nightstand', 'Dresser', 'Lighting'
      ]
    },
    {
      room: 'Living Room', route: 'move-planner-modal', roomItems: [
        'Bed Frame', 'Mattress', 'Paintings', 'Chairs', 'T.V.', 'Nightstand', 'Dresser', 'Lighting'
      ]
    }
  ]

  constructor(public dialog: MatDialog) { }

  openRoomModal(room: string, roomItems: string[]): void {
    const dialogRef = this.dialog.open(MovePlannerModalComponent, {
      width: '800px',
      height: '600px',
      data: { room, roomItems }
    });
  }
}


