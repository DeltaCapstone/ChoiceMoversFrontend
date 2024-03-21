import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { PageService } from '../../../../shared/services/page.service';
import { PageComponent } from '../../../../shared/components/page-component';
import { TuiStepperModule, TuiCheckboxBlockModule, TuiInputDateModule, TuiInputTimeModule, TuiInputModule, TuiAccordionModule, TuiSelectModule, TuiInputNumberModule, tuiInputNumberOptionsProvider } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { TUI_BUTTON_OPTIONS, TuiButtonModule, TuiSvgModule, TuiTextfieldControllerModule, TUI_FIRST_DAY_OF_WEEK } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { Room } from '../../../../models/room.model';
import { TuiDayOfWeek } from '@taiga-ui/cdk';
import { CreateJobEstimate } from '../../../../models/create-job-estimate.model';
import { Customer } from '../../../../models/customer.model';
import { Address } from '../../../../models/address.model';

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
    },
    {
      provide: TUI_FIRST_DAY_OF_WEEK,
      useValue: TuiDayOfWeek.Sunday,
    }
  ]
})

export class MovePlannerComponent extends PageComponent {

  currentFormGroup: FormGroup;

  servicesGroup: FormGroup;

  needTruckGroup: FormGroup;

  moveDateGroup: FormGroup;

  fromAddressGroup: FormGroup;

  toAddressGroup: FormGroup;

  roomsGroup: FormGroup;

  itemsGroup: FormGroup;

  boxesGroup: FormGroup;

  specialtyGroup: FormGroup;

  specialRequestGroup: FormGroup;

  specialRequestSubmissionSuccess: boolean = false;

  masterForm: FormGroup;

  roomItems: Room[] = [];

  activeStepIndex: number = 0;

  checkedRooms: string[] = [];

  specialtyItems: { specialtyItem: string, count: number, control: string }[] = [];

  boxes: Map<string, number>;

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
  }

  /**
   * Builds the form groups, creating an AbstractControl from a user-specified configuration
   */
  buildForm(): void {
    this.servicesGroup = this._formBuilder.group({
      moving: new FormControl(false),
      packing: new FormControl(false),
      unpack: new FormControl(false),
      storage: new FormControl(false),
      load: new FormControl(false),
      unload: new FormControl(false),
    });

    this.needTruckGroup = this._formBuilder.group({
      needTruck: new FormControl(false)
    })

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

    this.boxesGroup = this._formBuilder.group({
      smBox: new FormControl(''),
      mdBox: new FormControl(''),
      lgBox: new FormControl(''),
    })

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
      specialTextArea: new FormArray([])
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
      });
    }

    if (this.activeStepIndex === 6) {
      this.populateRoomItems();
    }

    this.specialRequestSubmissionSuccess = false;
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
      const itemsMap = this.getRoomItems(roomName);

      console.log(itemsMap.keys());

      for (const key of itemsMap.keys()) {
        console.log(key);
        this.itemsGroup.addControl(key, new FormControl());
      }
      console.log(this.itemsGroup);
    });
  }

  /**
   * Function that initializes the roomItems property, which will be used to populate the items accordion section of the stepper
   */
  initRoomItems(): void {
    this.roomItems = [
      new Room('Bedroom', new Map([['Bed', 0], ['Bed Frame', 0], ['Lighting', 0], ['Arm Chair', 0], ['TV', 0], ['Dresser', 0]])),
      new Room('Kitchen', new Map([['Table', 0], ['Chairs', 0], ['Refrigerator', 0], ['Stove', 0], ['Microwave', 0], ['Dishwasher', 0], ['Pots and Pans', 0], ['Dishes', 0], ['Trash Can', 0]])),
      new Room('Dining', new Map([['Table', 0], ['Chairs', 0], ['Lighting', 0], ['China', 0], ['Art', 0], ['Chadelier', 0], ['Centerpieces', 0], ['Tablecloths', 0], ['Cabinets', 0], ['Shelving', 0]])),
      new Room('Family', new Map([['Couch', 0], ['Rugs', 0], ['Lighting', 0], ['Pillows', 0], ['Blankets', 0], ['Bookshelves', 0], ['Entertainment Center', 0], ['Consoles', 0], ['DVD or Blu-ray Player', 0], ['T.V.', 0], ['Armchairs', 0], ['Recliners', 0]])),
      new Room('Living', new Map([['Couch', 0], ['Rugs', 0], ['Lighting', 0], ['Pillows', 0], ['Blankets', 0], ['Bookshelves', 0], ['Entertainment Center', 0], ['Consoles', 0], ['DVD or Blu-ray Player', 0], ['T.V.', 0], ['Armchairs', 0], ['Recliners', 0]])),
      new Room('Laundry', new Map([['Washer', 0], ['Dryer', 0], ['Ironing Board', 0], ['Laundry Sink', 0], ['Cleaning Supplies', 0]])),
      new Room('Bathroom', new Map([['Bath rugs and mats', 0], ['Shower Curtains', 0], ['Shower Curtain Rod', 0], ['Trash Can', 0], ['Scale', 0], ['Toilet Brush', 0], ['Plunger', 0], ['Bathroom Accessories', 0]])),
      new Room('Office', new Map([['Computer', 0], ['Desk', 0], ['Lighting', 0], ['Arm Chair', 0], ['TV', 0], ['Cabinets', 0], ['Bookeshelves', 0], ['Printer', 0], ['Keyboard and Mouse', 0], ['Cables and Wiring', 0], ['Office Chair', 0]])),
      new Room('Patio', new Map([['Outdoor Tables', 0], ['Chairs', 0], ['Umbrella', 0], ['Grill', 0], ['Grill Accessories', 0], ['Outdoor Furniture', 0], ['Storage Containers', 0], ['Gardening Tools', 0]])),
      new Room('Garage', new Map([['Tools', 0], ['Toolbox', 0], ['Gardening Equipment', 0], ['Workbench', 0], ['Sports Equipment', 0], ['Outdoor Furniture', 0], ['Lawn Care Equipment', 0], ['Automotive Supplies', 0]])),
      new Room('Attic', new Map([['Seasonal Decorations', 0], ['Stored Clothing', 0], ['Furniture', 0], ['Lighting', 0], ['Boxed Items', 0], ['Miscellaneous Items', 0]]))
    ]
  }

  /**
   * Initializes the specialty items property that is used in the specialtyGroup form group
   */
  //TODO: Change this to a map initialization
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
  getRoomItems(roomName: string): Map<string, number> {
    const room = this.roomItems.find(item => item.roomName === roomName);
    return room ? room.items : new Map();
  }

  /**
   * Converts the boolean value of the FormControl to its FormControl name if the checkbox value is true
   */
  roomBoolToString(): void {
    Object.keys(this.roomsGroup.controls).forEach(roomControl => {
      const roomValue = this.roomsGroup.get(roomControl)?.value;
      roomValue ? this.roomsGroup.get(roomControl)?.setValue(roomControl) : '';
    });
  }

  addSpecialRequest(requests: string): void {

    const specialRequest = this.specialRequestGroup.get('specialTextArea') as FormArray

    specialRequest.push(this._formBuilder.control(requests));

    console.log(this.specialRequestGroup.value);

    this.specialRequestSubmissionSuccess = true;
  }

  /**
   * Final form submission. Sets the value of the master form and master object newJob, and sends the newly created estimate to the backend database.
   */
  submitForm(): void {
    console.log("Special request controls:", this.specialRequestGroup.controls);
    console.log("Special request values:", this.specialRequestGroup.value);
    this.roomBoolToString();

    this.masterForm = this._formBuilder.group({
      ...this.servicesGroup.controls,
      ...this.moveDateGroup.controls,
      ...this.fromAddressGroup.controls,
      ...this.toAddressGroup.controls,
      ...this.roomsGroup.controls,
      ...this.itemsGroup.controls,
      ...this.boxesGroup.controls,
      ...this.specialtyGroup.controls,
      ...this.specialRequestGroup.controls,
    });
    console.log("MasterForm values:");
    console.log(this.masterForm.value);
    const newJob: CreateJobEstimate = {
      customer: new Customer('janeDoe', '', 'Jane', 'Doe', 'janeDoe@jandDoe.com', '330-330-3300', '330-123-4567'),
      loadAddr: this.masterForm.value.fromAddress ?? '',
      unloadAddr: this.masterForm.value.toAddress ?? '',
      startTime: this.masterForm.value.date ?? '',
      endTime: '' ?? '',

      rooms: this.masterForm.value.rooms ?? [],
      special: this.masterForm.value.specialtyItems ?? [],
      boxes: this.masterForm.value.boxes ?? new Map(),

      pack: this.masterForm.value.pack ?? false,
      unpack: this.masterForm.value.unpack ?? false,
      load: this.masterForm.value.load ?? false,
      unload: this.masterForm.value.unload ?? false,

      clean: false,

      //TODO implement needTruck FormGroup
      needTruck: false,
      distanceToJob: 0,
      distanceTotal: 0

    }

  }

  ngOnDestroy() {

  }
}

