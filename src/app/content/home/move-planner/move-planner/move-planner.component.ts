import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { PageService } from '../../../../shared/services/page.service';
import { PageComponent } from '../../../../shared/components/page-component';
import { TuiStepperModule, TuiCheckboxBlockModule, TuiInputDateModule, TuiInputTimeModule, TuiInputModule, TuiAccordionModule, TuiSelectModule, TuiInputNumberModule, tuiInputNumberOptionsProvider } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TUI_BUTTON_OPTIONS, TuiButtonModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { Room } from '../../../../models/room.model';

@Component({
  selector: 'app-move-planner',
  standalone: true,
  imports: [CommonModule, NgFor, TuiStepperModule, TuiCheckboxBlockModule, FormsModule, ReactiveFormsModule, TuiButtonModule, TuiSvgModule, TuiInputDateModule, TuiTextfieldControllerModule, TuiInputTimeModule, TuiInputModule, TuiAccordionModule, TuiSelectModule, TuiInputNumberModule],
  templateUrl: './move-planner.component.html',
  styleUrl: './move-planner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiInputNumberOptionsProvider({
      decimal: 'never',
      step: 1,
    }),
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        appearance: 'flat',
        size: 'm',
        shape: 'rounded'
      }
    }
  ]
})

export class MovePlannerComponent extends PageComponent {

  servicesGroup: FormGroup;

  moveDateGroup: FormGroup;

  fromAddressGroup: FormGroup;

  toAddressGroup: FormGroup;

  roomsGroup: FormGroup;

  itemsGroup: FormGroup;

  specialtyGroup: FormGroup;

  specialRequestGroup: FormGroup;

  roomItems: { roomItems: Room, count: number }[] = [];

  activeStepIndex: number = 0;

  checkedRooms: string[] = [];

  specialtyItems: { specialtyItem: string, count: number }[] = [];

  get roomItemsFiltered(): { roomItems: Room, count: number }[] {
    return this.roomItems.filter(item => this.checkedRooms.includes(item.roomItems.roomName));
  }

  /**
   * Constructor method that injects dependencies needed in the MovePlannerComponent
   * @param pageService A service that handles basic page-related behavior such as setting the title and interacting with the window
   */
  constructor(pageService: PageService, private _formBuilder: FormBuilder, private _router: Router) {
    super(pageService);

  }

  ngOnInit(): void {
    this.setTitle("Move Planner");
    this.initRoomItems();
    this.initSpecialtyItems();
    this.buildForm();
  }

  buildForm(): void {
    this.servicesGroup = this._formBuilder.group({
      moving: new FormControl(false),
      packing: new FormControl(false),
      unpack: new FormControl(false),
      storage: new FormControl(false)
    });

    this.moveDateGroup = this._formBuilder.group({
      date: new FormControl(),
      time: new FormControl()
    });

    this.fromAddressGroup = this._formBuilder.group({
      fromAddress: new FormControl('123 Main St.'),
      fromCity: new FormControl('Akron'),
      fromState: new FormControl('OH'),
      fromZip: new FormControl('44333'),
      fromResidenceType: new FormControl('House'),
      fromFlights: new FormControl('2'),
      fromApartmentNumber: new FormControl('N/A'),
    });

    this.toAddressGroup = this._formBuilder.group({
      toAddress: new FormControl('234 Smith Rd.'),
      toCity: new FormControl('Solon'),
      toState: new FormControl('OH'),
      toZip: new FormControl('44139'),
      toResidenceType: new FormControl('Apartment'),
      toFlights: new FormControl('3'),
      toApartmentNumber: new FormControl('Apt 321')
    })

    this.roomsGroup = this._formBuilder.group({
      Bedroom: new FormControl(false),
      Kitchen: new FormControl(false),
      Dining: new FormControl(false),
      Family: new FormControl(false),
      Living: new FormControl(false),
      Laundry: new FormControl(false),
      Bathroom: new FormControl(false),
      Office: new FormControl(false),
      Patio: new FormControl(false),
      Garage: new FormControl(false),
      Attic: new FormControl(false),
    })

    this.specialtyGroup = this._formBuilder.group({
      keyboard: new FormControl(false),
      spinetPiano: new FormControl(false),
      consolePiano: new FormControl(false),
      studioPiano: new FormControl(false),
      organ: new FormControl(false),
      safe3: new FormControl(false),
      safe4: new FormControl(false),
      poolTable: new FormControl(false),
      arcadeGames: new FormControl(false),
      weightEquipment: new FormControl(false),
      machinery: new FormControl(false),
    })

    this.specialRequestGroup = this._formBuilder.group({
      specialTextArea: new FormControl('Enter and special requests here', Validators.required)
    })
    console.log(this.specialRequestGroup);
  }

  onActiveStepIndexChange(index: number): void {
    this.activeStepIndex = index;
    if (this.activeStepIndex === 5) {
      this.populateRoomItems();
    }
  }

  populateRoomItems(): void {
    // Reset the itemsGroup FormGroup
    this.itemsGroup = this._formBuilder.group({});

    // Filter out the unchecked rooms
    this.checkedRooms = Object.entries(this.roomsGroup.controls)
      .filter(([roomName, roomControl]) => roomControl.value)
      .map(([roomName]) => roomName);

    // Iterate over the selected rooms
    this.checkedRooms.forEach(roomName => {
      // Retrieve room items based on the roomName
      const items = this.getRoomItems(roomName);
      // Dynamically add FormControls for each item
      items.forEach(item => {
        // Add a FormControl for the item to the itemsGroup FormGroup
        this.itemsGroup.addControl(item, new FormControl());
      });
    });
  }

  initRoomItems(): void {
    this.roomItems = [
      { roomItems: new Room('Bedroom', ['Bed', 'Bed Frame', 'Lighting', 'Arm Chair', 'T.V.', 'Dresser']), count: 0 },
      { roomItems: new Room('Kitchen', ['Table', 'Chairs', 'Refridgerator', 'Stove', 'Microwave', 'Dishwasher', 'Pots and Pans', 'Dishes', 'Trash Can']), count: 0 },
      { roomItems: new Room('Dining', ['Table', 'Chairs', 'Lighting', 'China', 'Art', 'Chadelier', 'Centerpieces', 'Tablecloths', 'Cabinets', 'Shelving']), count: 0 },
      { roomItems: new Room('Family', ['Couch', 'Rugs', 'Lighting', 'Pillows', 'Blankets', 'Bookshelves', 'Entertainment Center', 'Consoles', 'DVD/Blu-ray Player', 'T.V.', 'Armchairs', 'Recliners', 'Lighting']), count: 0 },
      { roomItems: new Room('Living', ['Couch', 'Rugs', 'Lighting', 'Pillows', 'Blankets', 'Bookshelves', 'Entertainment Center', 'Consoles', 'DVD/Blu-ray Player', 'T.V.', 'Armchairs', 'Recliners', 'Lighting']), count: 0 },
      { roomItems: new Room('Laundry', ['Washer', 'Dryer', 'Ironing Board', 'Laundry Sink', 'Cleaning Supplies']), count: 0 },
      { roomItems: new Room('Bathroom', ['Bath rugs/mats', 'Shower Curtains', 'Shower Curtain Rod', 'Trash Can', 'Scale', 'Toilet Brush', 'Plunger', 'Bathroom Accessories']), count: 0 },
      { roomItems: new Room('Office', ['Computer', 'Desk', 'Lighting', 'Arm Chair', 'T.V.', 'Cabinets', 'Bookeshelves', 'Printer', 'Keyboard and Mouse', 'Cables/Wiring', 'Office Chair']), count: 0 },
      { roomItems: new Room('Patio', ['Outdoor Tables', 'Chairs', 'Umbrella', 'Grill', 'Grill Accessories', 'Outdoor Furniture', 'Storage Containers', 'Gardening Tools']), count: 0 },
      { roomItems: new Room('Garage', ['Tools', 'Toolbox', 'Gardening Equipment', 'Workbench', 'Sports Equipment', 'Outdoor Furniture', 'Lawn Care Equipment', 'Automotive Supplies']), count: 0 },
      { roomItems: new Room('Attic', ['Seasonal Decorations', 'Stored Clothing', 'Furniture', 'Lighting', 'Boxed Items', 'Miscellaneous Items']), count: 0 }
    ]
  }

  initSpecialtyItems(): void {
    this.specialtyItems = [
      { specialtyItem: 'Keyboard', count: 0 },
      { specialtyItem: 'Spinet Piano', count: 0 },
      { specialtyItem: 'Console Piano', count: 0 },
      { specialtyItem: 'Studio Piano', count: 0 },
      { specialtyItem: 'Organ', count: 0 },
      { specialtyItem: 'Safe >300lb', count: 0 },
      { specialtyItem: 'Safe >400lb', count: 0 },
      { specialtyItem: 'Pool Table', count: 0 },
      { specialtyItem: 'Arcade Games', count: 0 },
      { specialtyItem: 'Weight Equipment', count: 0 },
      { specialtyItem: 'Machinery', count: 0 },
    ]
  }

  getRoomItems(roomName: string): string[] {
    //retreive room items based on roomName
    const room = this.roomItems.find(item => item.roomItems.roomName === roomName);
    return room ? room.roomItems.items : [];
  }

  submitForm(): void {
    console.log('Form submitted');
  }

}

