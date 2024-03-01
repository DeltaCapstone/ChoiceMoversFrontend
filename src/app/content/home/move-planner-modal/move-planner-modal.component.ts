import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-move-planner-modal',
  standalone: true,
  imports: [MatIconModule, NgFor],
  templateUrl: './move-planner-modal.component.html',
  styleUrl: './move-planner-modal.component.css'
})

export class MovePlannerModalComponent {
  constructor(
    public dialogRef: MatDialogRef<MovePlannerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { room: string, roomItems: string[] }
  ) { }
}
