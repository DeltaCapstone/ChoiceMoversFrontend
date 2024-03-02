import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatFormFieldModule } from '@angular/material/form-field'
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-move-planner-modal',
  standalone: true,
  imports: [MatIconModule, NgFor, MatListModule, MatFormFieldModule],
  templateUrl: './move-planner-modal.component.html',
  styleUrl: './move-planner-modal.component.css'
})

export class MovePlannerModalComponent {
  constructor(
    public dialogRef: MatDialogRef<MovePlannerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { room: string, roomItems: { itemName: string, icon: string }[], iconName: string, listIconName: string[] }
  ) { }
}
