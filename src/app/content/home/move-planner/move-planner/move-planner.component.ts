import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { MoveBlowoutDropdownComponent } from '../../../../shared/components/move-blowout-dropdown/move-blowout-dropdown.component';
import { MatDialog } from '@angular/material/dialog';
import { MovePlannerModalComponent } from '../../move-planner-modal/move-planner-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { PageService } from '../../../../shared/services/page.service';
import { PageComponent } from '../../../../shared/components/page-component';


type DropDownItem = {
  readonly room: string;
  readonly route: string;
  readonly roomItems: { itemName: string, icon: string }[];
  readonly icon: string;
}

@Component({
  selector: 'app-move-planner',
  standalone: true,

  imports: [CommonModule, NgFor, MoveBlowoutDropdownComponent, MatMenuModule, MatDialogModule, MatIconModule, MatButtonModule, MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatCardModule],
  templateUrl: './move-planner.component.html',
  styleUrl: './move-planner.component.css'
})

export class MovePlannerComponent extends PageComponent {

  firstFormGroup: FormGroup;

  secondFormGroup: FormGroup;

  isMenuOpen: boolean = false;

  isLinear: boolean = true;

  moveService: boolean = false;

  cleanOutService: boolean = false;

  storageService: boolean = false;

  packingService: boolean = false;

  labelPosition: 'before' | 'after' = 'after';

  disabled: boolean = false;

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

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, pageService: PageService) {
    super(pageService);
  }

  override ngOnInit(): void {
    this.setTitle("Move Planner");
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
      moveService: [false],
      cleanOutService: [false],
      packingService: [false],
      storageService: [false]
    });

    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }


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

