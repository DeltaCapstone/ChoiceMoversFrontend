import { Component, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
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
        appearance: 'primary',
        size: 'm',
        shape: 'rounded'
      }
    }
  ]
})

export class MovePlannerComponent extends PageComponent {

  currentFormGroup: FormGroup;

  servicesGroup: FormGroup;

  moveDateGroup: FormGroup;

  fromAddressGroup: FormGroup;

  toAddressGroup: FormGroup;

  roomsGroup: FormGroup;

  itemsGroup: FormGroup;

  specialtyGroup: FormGroup;

  specialRequestGroup: FormGroup;

  masterForm: FormGroup;

  roomItems: Room[] = [];

  activeStepIndex: number = 0;

  checkedRooms: string[] = [];

  specialtyItems: { specialtyItem: string, count: number, control: string }[] = [];

  get roomItemsFiltered(): Room[] {
    return this.roomItems.filter(item => this.checkedRooms.includes(item.roomName));
  }

  /**
   * Constructor method that injects dependencies needed in the MovePlannerComponent
   * @param pageService A service that handles basic page-related behavior such as setting the title and interacting with the window
   * @param _formBuilder A utility used to simplify the process of creating and managing reactive forms
   * @param _router A module that provides a powerful way to handle navigation within the component page
   */
  constructor(pageService: PageService, private _formBuilder: FormBuilder, private _router: Router) {
    super(pageService);
  }

  ngOnInit(): void {
    this.setTitle("Move Planner");

    this.initRoomItems();

    this.initSpecialtyItems();

    this.buildForm();

    this.masterForm = this._formBuilder.group({
      servicesGroup: this._formBuilder.group({
        moving: [''],
        packing: [''],
        unpack: [''],
        storage: ['']
      }),

      moveDateGroup: this._formBuilder.group({
        date: [''],
        time: ['']
      }),

      fromAddressGroup: this._formBuilder.group({
        fromAddress: [''],
        fromCity: [''],
        fromState: [''],
        fromZip: [''],
        fromResidenceType: [''],
        fromFlights: [''],
        fromApartmentNumber: [''],
      }),

      toAddressGroup: this._formBuilder.group({
        toAddress: [''],
        toCity: [''],
        toState: [''],
        toZip: [''],
        toResidenceType: [''],
        toFlights: [''],
        toApartmentNumber: ['']
      }),

      roomsGroup: this._formBuilder.group({
        Bedroom: [''],
        Kitchen: [''],
        Dining: [''],
        Family: [''],
        Living: [''],
        Laundry: [''],
        Bathroom: [''],
        Office: [''],
        Patio: [''],
        Garage: [''],
        Attic: [''],
      }),

      itemsGroup: this._formBuilder.group({
        items: ['']
      }),

      specialtyGroup: this._formBuilder.group({
        keyboard: [''],
        spinetPiano: [''],
        consolePiano: [''],
        studioPiano: [''],
        organ: [''],
        safe300lb: [''],
        safe400lb: [''],
        poolTable: [''],
        arcadeGames: [''],
        weightEquipment: [''],
        machinery: [''],
      }),

      specialRequestGroup: this._formBuilder.group({
        specialTextArea: ['']
      }),
    });
  }

  /**
   * Builds the form groups, creating an AbstractControl from a user-specified configuration
   */
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
    });

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
    });

    this.specialtyGroup = this._formBuilder.group({
      keyboard: new FormControl(false),
      spinetPiano: new FormControl(false),
      consolePiano: new FormControl(false),
      studioPiano: new FormControl(false),
      organ: new FormControl(false),
      safe300lb: new FormControl(false),
      safe400lb: new FormControl(false),
      poolTable: new FormControl(false),
      arcadeGames: new FormControl(false),
      weightEquipment: new FormControl(false),
      machinery: new FormControl(false),
    });

    this.specialRequestGroup = this._formBuilder.group({
      specialTextArea: new FormControl('Enter and special requests here')
    });
  }

  /**
   * Changes the activeStepIndex based on which stepper step the user is on currently, and then sets the FormControls to the user input values
   * @param index The current index to which the activeStepIndex will be set.
   * @param curentGroup The current FormGroup for the associated stepper section
   */
  onActiveStepIndexChange(index: number, currentGroup: FormGroup): void {
    currentGroup = this.findCurrentFormGroup(index);
    this.activeStepIndex = index;
    if (currentGroup != null) {
      const currentControls = Object.keys(currentGroup.controls)

      currentControls.forEach(controlName => {
        const control: FormControl = currentGroup.controls[controlName] as FormControl;

        const userInputValue = control.value;

        control.setValue(userInputValue);
        console.log(userInputValue);
      });
    }

    if (this.activeStepIndex === 5) {
      this.populateRoomItems();
    }
  }

  /**
   * Finds the current form group based on the stepper's current active index
   * @param stepIndex the stepper's current active index
   * @returns The current form group relative to the current active index of the stepper
   */
  findCurrentFormGroup(stepIndex: number): FormGroup {
    switch (stepIndex) {
      case 0:
        this.currentFormGroup = this.servicesGroup;
        break;
      case 1:
        this.currentFormGroup = this.moveDateGroup
        break;
      case 2:
        this.currentFormGroup = this.fromAddressGroup;
        break;
      case 3:
        this.currentFormGroup = this.toAddressGroup;
        break;
      case 4:
        this.currentFormGroup = this.roomsGroup
        break;
      case 5:
        this.currentFormGroup = this.itemsGroup;
        break;
      case 6:
        this.currentFormGroup = this.specialtyGroup;
        break;
      case 7:
        this.currentFormGroup = this.specialRequestGroup;
        break;
      default:
        break;
    }
    return this.currentFormGroup;
  }

  /**
   * Populates the room items stepper accordion section based on the rooms selected in the Rooms stepper step
   */
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

  /**
   * Function that initializes the roomItems property, which will be used to populate the items accordion section of the stepper
   */
  initRoomItems(): void {
    this.roomItems = [
      new Room('Bedroom', ['Bed', 'Bed Frame', 'Lighting', 'Arm Chair', 'T.V.', 'Dresser']),
      new Room('Kitchen', ['Table', 'Chairs', 'Refridgerator', 'Stove', 'Microwave', 'Dishwasher', 'Pots and Pans', 'Dishes', 'Trash Can']),
      new Room('Dining', ['Table', 'Chairs', 'Lighting', 'China', 'Art', 'Chadelier', 'Centerpieces', 'Tablecloths', 'Cabinets', 'Shelving']),
      new Room('Family', ['Couch', 'Rugs', 'Lighting', 'Pillows', 'Blankets', 'Bookshelves', 'Entertainment Center', 'Consoles', 'DVD/Blu-ray Player', 'T.V.', 'Armchairs', 'Recliners', 'Lighting']),
      new Room('Living', ['Couch', 'Rugs', 'Lighting', 'Pillows', 'Blankets', 'Bookshelves', 'Entertainment Center', 'Consoles', 'DVD/Blu-ray Player', 'T.V.', 'Armchairs', 'Recliners', 'Lighting']),
      new Room('Laundry', ['Washer', 'Dryer', 'Ironing Board', 'Laundry Sink', 'Cleaning Supplies']),
      new Room('Bathroom', ['Bath rugs/mats', 'Shower Curtains', 'Shower Curtain Rod', 'Trash Can', 'Scale', 'Toilet Brush', 'Plunger', 'Bathroom Accessories']),
      new Room('Office', ['Computer', 'Desk', 'Lighting', 'Arm Chair', 'T.V.', 'Cabinets', 'Bookeshelves', 'Printer', 'Keyboard and Mouse', 'Cables/Wiring', 'Office Chair']),
      new Room('Patio', ['Outdoor Tables', 'Chairs', 'Umbrella', 'Grill', 'Grill Accessories', 'Outdoor Furniture', 'Storage Containers', 'Gardening Tools']),
      new Room('Garage', ['Tools', 'Toolbox', 'Gardening Equipment', 'Workbench', 'Sports Equipment', 'Outdoor Furniture', 'Lawn Care Equipment', 'Automotive Supplies']),
      new Room('Attic', ['Seasonal Decorations', 'Stored Clothing', 'Furniture', 'Lighting', 'Boxed Items', 'Miscellaneous Items'])
    ]
  }

  /**
   * Initializes the specialty items property that is used in the specialtyGroup form group
   */
  initSpecialtyItems(): void {
    this.specialtyItems = [
      { specialtyItem: 'Keyboard', count: 0, control: 'keyboard' },
      { specialtyItem: 'Spinet Piano', count: 0, control: 'spinetPiano' },
      { specialtyItem: 'Console Piano', count: 0, control: 'consolePiano' },
      { specialtyItem: 'Studio Piano', count: 0, control: 'studioPiano' },
      { specialtyItem: 'Organ', count: 0, control: 'organ' },
      { specialtyItem: 'Safe > 300lb', count: 0, control: 'safe300lb' },
      { specialtyItem: 'Safe > 400lb', count: 0, control: 'safe400lb' },
      { specialtyItem: 'Pool Table', count: 0, control: 'poolTable' },
      { specialtyItem: 'Arcade Games', count: 0, control: 'arcadeGames' },
      { specialtyItem: 'Weight Equipment', count: 0, control: 'weightEquipment' },
      { specialtyItem: 'Machinery', count: 0, control: 'machinery' },
    ]
  }


  /**
   * Retreive room items based on roomName. Used to help with dynamic population of items stepper section
   * @param roomName A specific room name checked by the user in the form
   * @returns The items associated with the selected room names; empty array otherwise
   */
  getRoomItems(roomName: string): string[] {
    const room = this.roomItems.find(item => item.roomName === roomName);
    return room ? room.items : [];
  }

  /**
   * Final form submission
   */
  submitForm(): void {
    console.log('Form submitted');
    console.log(this.servicesGroup);
    console.log(this.moveDateGroup);
    console.log(this.fromAddressGroup);
    console.log(this.toAddressGroup);
    console.log(this.roomsGroup);
    console.log(this.itemsGroup);
    console.log(this.specialtyGroup);
    console.log(this.specialRequestGroup);
    console.log(this.masterForm);
  }

  ngOnDestroy() {

  }
}

