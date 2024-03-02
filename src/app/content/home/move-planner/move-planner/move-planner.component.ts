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
  readonly roomItems: { itemName: string, icon: string }[];
  readonly icon: string;
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
      room: 'Bedroom', route: 'move-planner-modal', icon: 'bed', roomItems: [
        { itemName: 'Bed Frame', icon: 'bed' }, { itemName: 'Mattress', icon: 'single_bed' }, { itemName: 'Paintings', icon: 'chair' }, { itemName: 'Chairs', icon: 'chair' }, { itemName: 'T.V.', icon: 'tv' }, { itemName: 'Nightstand', icon: 'table_restaurant' }, { itemName: 'Dresser', icon: 'chair' }, { itemName: 'Lighting', icon: 'chair' }
      ]
    },
    {
      room: 'Bathroom', route: 'move-planner-modal', icon: 'soap', roomItems: [
        { itemName: 'Bed Frame', icon: 'bed' }, { itemName: 'Mattress', icon: 'single_bed' }, { itemName: 'Paintings', icon: 'wall_art' }, { itemName: 'Chairs', icon: 'chair' }, { itemName: 'T.V.', icon: 'tv' }, { itemName: 'Nightstand', icon: 'table_restaurant' }, { itemName: 'Dresser', icon: 'dresser' }, { itemName: 'Lighting', icon: 'floor_lamp' }
      ]
    },
    {
      room: 'Garage', route: 'move-planner-modal', icon: 'garage', roomItems: [
        { itemName: 'Bed Frame', icon: 'bed' }, { itemName: 'Mattress', icon: 'single_bed' }, { itemName: 'Paintings', icon: 'wall_art' }, { itemName: 'Chairs', icon: 'chair' }, { itemName: 'T.V.', icon: 'tv' }, { itemName: 'Nightstand', icon: 'table_restaurant' }, { itemName: 'Dresser', icon: 'dresser' }, { itemName: 'Lighting', icon: 'floor_lamp' }
      ]
    },
    {
      room: 'Utility Room', route: 'move-planner-modal', icon: 'local_laundry_service', roomItems: [
        { itemName: 'Bed Frame', icon: 'bed' }, { itemName: 'Mattress', icon: 'single_bed' }, { itemName: 'Paintings', icon: 'wall_art' }, { itemName: 'Chairs', icon: 'chair' }, { itemName: 'T.V.', icon: 'tv' }, { itemName: 'Nightstand', icon: 'table_restaurant' }, { itemName: 'Dresser', icon: 'dresser' }, { itemName: 'Lighting', icon: 'floor_lamp' }
      ]
    },
    {
      room: 'Patio/Deck', route: 'move-planner-modal', icon: 'deck', roomItems: [
        { itemName: 'Bed Frame', icon: 'bed' }, { itemName: 'Mattress', icon: 'single_bed' }, { itemName: 'Paintings', icon: 'wall_art' }, { itemName: 'Chairs', icon: 'chair' }, { itemName: 'T.V.', icon: 'tv' }, { itemName: 'Nightstand', icon: 'table_restaurant' }, { itemName: 'Dresser', icon: 'dresser' }, { itemName: 'Lighting', icon: 'floor_lamp' }
      ]
    },
    {
      room: 'Study', route: 'move-planner-modal', icon: 'book', roomItems: [
        { itemName: 'Bed Frame', icon: 'bed' }, { itemName: 'Mattress', icon: 'single_bed' }, { itemName: 'Paintings', icon: 'wall_art' }, { itemName: 'Chairs', icon: 'chair' }, { itemName: 'T.V.', icon: 'tv' }, { itemName: 'Nightstand', icon: 'table_restaurant' }, { itemName: 'Dresser', icon: 'dresser' }, { itemName: 'Lighting', icon: 'floor_lamp' }
      ]
    },
    {
      room: 'Kitchen', route: 'move-planner-modal', icon: 'kitchen', roomItems: [
        { itemName: 'Bed Frame', icon: 'bed' }, { itemName: 'Mattress', icon: 'single_bed' }, { itemName: 'Paintings', icon: 'wall_art' }, { itemName: 'Chairs', icon: 'chair' }, { itemName: 'T.V.', icon: 'tv' }, { itemName: 'Nightstand', icon: 'table_restaurant' }, { itemName: 'Dresser', icon: 'dresser' }, { itemName: 'Lighting', icon: 'floor_lamp' }
      ]
    },
    {
      room: 'Living Room', route: 'move-planner-modal', icon: 'chair', roomItems: [
        { itemName: 'Bed Frame', icon: 'bed' }, { itemName: 'Mattress', icon: 'single_bed' }, { itemName: 'Paintings', icon: 'wall_art' }, { itemName: 'Chairs', icon: 'chair' }, { itemName: 'T.V.', icon: 'tv' }, { itemName: 'Nightstand', icon: 'table_restaurant' }, { itemName: 'Dresser', icon: 'dresser' }, { itemName: 'Lighting', icon: 'floor_lamp' }
      ]
    }
  ]

  constructor(public dialog: MatDialog) { }

  getIconName(itemName: string): string {
    const item = this.items.find(item => item.room === itemName);
    return item ? item.icon : 'house';
  }

  getRoomItem(roomItems: { itemName: string, icon: string }[]): string[] {
    return roomItems.map(item => item.itemName);
  }

  getListIcon(roomItems: { itemName: string, icon: string }): string {
    return roomItems.icon;
  }

  openRoomModal(room: string, roomItems: { itemName: string, icon: string }[]): void {
    //Getting the icon for the room title
    const iconName = this.getIconName(room);
    //Getting icons for the specific room items
    const iconsList = roomItems.map(item => ({ itemName: item.itemName, icon: this.getListIcon(item) }));
    const dialogRef = this.dialog.open(MovePlannerModalComponent, {
      width: '800px',
      height: '600px',
      data: { room, roomItems, iconName, iconsList }
    });
  }
}


