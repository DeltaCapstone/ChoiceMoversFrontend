import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { MoveBlowoutDropdownComponent } from '../../../../shared/components/move-blowout-dropdown/move-blowout-dropdown.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MovePlannerModalComponent } from '../../move-planner-modal/move-planner-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'

type DropDownItem = {
  readonly room: string;
  readonly route: string;
}

@Component({
  selector: 'app-move-planner',
  standalone: true,
  imports: [CommonModule, NgFor, MoveBlowoutDropdownComponent, MatMenuModule, MatDialogModule, MatIconModule],
  templateUrl: './move-planner.component.html',
  styleUrl: './move-planner.component.css'
})

export class MovePlannerComponent {
  items: DropDownItem[] = [
    { room: 'Bedroom', route: 'move-planner-modal' },
    { room: 'Bathroom', route: 'move-planner-modal' },
    { room: 'Garage', route: 'move-planner-modal' },
    { room: 'Utility Room', route: 'move-planner-modal' },
    { room: 'Patio/Deck', route: 'move-planner-modal' },
    { room: 'Study', route: 'move-planner-modal' },
    { room: 'Kitchen', route: 'move-planner-modal' },
    { room: 'Living Room', route: 'move-planner-modal' }
  ]

  constructor(public dialog: MatDialog) { }

  openRoomModal(room: string): void {
    const dialogRef = this.dialog.open(MovePlannerModalComponent, {
      width: '250px',
      data: { room }
    });
  }
}


