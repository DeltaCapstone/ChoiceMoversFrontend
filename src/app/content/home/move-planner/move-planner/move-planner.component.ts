import { Component, ChangeDetectionStrategy, ElementRef, Inject, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { PageService } from '../../../../shared/services/page.service';
import { PageComponent } from '../../../../shared/components/page-component';
import { TuiStepperModule, TuiCheckboxBlockModule, TuiInputDateModule, TuiInputTimeModule, TuiInputModule, TuiAccordionModule, TuiSelectModule, TuiInputNumberModule, tuiInputNumberOptionsProvider, TUI_DATE_TIME_VALUE_TRANSFORMER, TuiInputDateTimeModule, tuiInputTimeOptionsProvider, TuiToggleModule, TuiRadioBlockModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { TUI_BUTTON_OPTIONS, TuiButtonModule, TuiSvgModule, TuiTextfieldControllerModule, TUI_FIRST_DAY_OF_WEEK } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { Room } from '../../../../models/room.model';
import { TuiDay, TuiDayOfWeek, TuiTime, TuiValidatorModule } from '@taiga-ui/cdk';
import { CreateJobEstimate } from '../../../../models/create-job-estimate.model';
import { Customer } from '../../../../models/customer.model';
import { ValueTransformerService } from '../../../../shared/services/value-transformer.service';
import { GoogleMapsLoaderService } from '../../../../shared/services/google-maps-loader.service';
import { SessionService } from '../../../../shared/services/session.service';
import { CreateEstimateSessionState, SessionType } from '../../../../models/session.model';
import { Observable, Subscription } from 'rxjs';
import { CustomerSessionServiceToken } from '../../../../app.config';
import { JobsService } from '../../../../shared/services/jobs.service';


@Component({
  selector: 'app-move-planner',
  standalone: true,
  imports: [CommonModule, NgFor, TuiStepperModule, TuiCheckboxBlockModule, FormsModule, ReactiveFormsModule, TuiButtonModule, TuiSvgModule, TuiInputDateModule, TuiTextfieldControllerModule, TuiInputTimeModule, TuiInputModule, TuiAccordionModule, TuiSelectModule, TuiInputNumberModule, TuiValidatorModule, TuiInputDateTimeModule, TuiToggleModule, TuiRadioBlockModule],
  templateUrl: './move-planner.component.html',
  styleUrl: './move-planner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiInputNumberOptionsProvider({
      decimal: 'never',
      step: 1,
    }), tuiInputTimeOptionsProvider({
      mode: 'HH:MM',
      maxValues: { HH: 11, MM: 59, SS: 59, MS: 999 },
    }),
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        appearance: 'primary',
        size: 'm',
        shape: 'rounded',
      }
    },
    {
      provide: TUI_FIRST_DAY_OF_WEEK,
      useValue: TuiDayOfWeek.Sunday,
    },
    {
      provide: TUI_DATE_TIME_VALUE_TRANSFORMER,
      useClass: ValueTransformerService,
    }
  ]
})

export class MovePlannerComponent extends PageComponent {

  activeUser$: Observable<Customer | undefined>;

  currentCustomer: Customer = new Customer();

  currentFormGroup: FormGroup;

  servicesGroup: FormGroup;

  needTruckGroup: FormGroup;

  moveDateGroup: FormGroup;

  currentDay: TuiDay = TuiDay.currentLocal();

  currentTime: TuiTime = TuiTime.currentLocal();

  get postfix(): string {
    return this.moveDateGroup.value?.isPm ? 'PM' : 'AM';
  }

  fromAddressResType: FormGroup;

  fromAddressFlights: FormGroup;

  fromAddressGroup: FormGroup;

  toAddressResType: FormGroup;

  toAddressFlights: FormGroup;

  toAddressGroup: FormGroup;

  roomsGroup: FormGroup;

  itemsGroup: FormGroup;

  boxesGroup: FormGroup;

  specialtyGroup: FormGroup;

  specialRequestGroup: FormGroup;

  specialRequestSubmissionSuccess: boolean = false;

  roomItems: Room[] = [];

  activeStepIndex: number = 0;

  checkedRooms: string[] = [];

  specialtyItems: { specialtyItem: string, count: number, control: string }[] = [];

  boxes: Map<string, number>;

  get roomItemsFiltered(): Room[] {
    return this.roomItems.filter(item => this.checkedRooms.includes(item.roomName));
  }

  choiceMoversAddress: string = '1726 Marks Ave Akron OH 44305';

  newJob: CreateJobEstimate = new CreateJobEstimate();

  jobSessionState = this._customerSession.movePlannerSessionState;

  subscriptions: Subscription[] = [];

  /**
   * Constructor method that injects dependencies needed in the MovePlannerComponent
   * @param pageService A service that handles basic page-related behavior such as setting the title and interacting with the window
   * @param _formBuilder A utility used to simplify the process of creating and managing reactive forms
   * @param _router A module that provides a powerful way to handle navigation within the component page
   */
  constructor(pageService: PageService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _valueTransformerService: ValueTransformerService,
    private _googleMapsLoaderService: GoogleMapsLoaderService,
    private _elementRef: ElementRef,
    @Inject(CustomerSessionServiceToken) private _customerSession: SessionService<Customer>,
    private _jobsService: JobsService,
  ) {
    super(pageService);

    this.activeUser$ = new Observable<Customer | undefined>;

    // Initialize the itemsGroup FormGroup
    this.itemsGroup = this._formBuilder.group({});
  }

  ngOnInit(): void {
    this.setTitle("Move Planner");

    this.initRoomItems();

    this.initSpecialtyItems();

    this.buildForm();

    this.subscibeAllFormGroupsToValueChanges();

    this.activeUser$ = this._customerSession.getUser();
    console.log('Active user is:', this.activeUser$);
    const userSubscription = this.activeUser$.subscribe({
      next: (customer) => {
        console.log(customer);
        if (customer) {
          this.currentCustomer = customer;
        } else {
          console.log('hitting else block for customer assignment')
          this.currentCustomer = new Customer();
        }
      },
      error: (error) => {
        console.error('An error occurred in creating active user:', error);
      }
    });;

    this.subscriptions.push(userSubscription);


  }

  ngAfterViewInit() {
    this.refreshMovePlannerState(this.jobSessionState);
  }

  /**
   * Checks that at least one checkbox of the FormGroup that it is assigned to is checked
   * @returns A function that is used for checking the validation of a checkbox group
   */
  atLeastOneCheckboxChecked(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      if (formGroup instanceof FormGroup) {
        const hasChecked = Object.keys(formGroup.controls).some(controlName => {
          const control = formGroup.controls[controlName];
          return control.value === true;
        });

        //no validation error
        if (hasChecked) {
          return null;
        }
      }

      //validation error
      return { requiredTrue: true };
    };
  }

  /**
   * Builds the form groups, creating an AbstractControl from a user-specified configuration
   */
  buildForm(): void {
    this.servicesGroup = this._formBuilder.group({
      packing: new FormControl(false, Validators.required),
      unpack: new FormControl(false, Validators.required),
      load: new FormControl(false, Validators.required),
      unload: new FormControl(false, Validators.required),
    });

    this.servicesGroup.setValidators(this.atLeastOneCheckboxChecked());

    this.needTruckGroup = this._formBuilder.group({
      needTruck: new FormControl(false)
    });

    this.moveDateGroup = this._formBuilder.group({
      dateTime: new FormControl('', Validators.required),
      isPm: new FormControl(false),
    });

    this.fromAddressResType = this._formBuilder.group({
      fromResType: new FormControl('House', Validators.required),
    });

    this.fromAddressFlights = this._formBuilder.group({
      fromNumberOfFlights: new FormControl(0, Validators.required)
    });


    this.fromAddressGroup = this._formBuilder.group({
      fromAddressStreetNumber: new FormControl('', Validators.required),
      fromAddressStreetName: new FormControl('', Validators.required),
      fromCity: new FormControl('', Validators.required),
      fromState: new FormControl('', Validators.required),
      fromZip: new FormControl('', Validators.required),
      fromResidenceType: new FormControl(''),
      fromFlights: new FormControl(0),
      fromAptNumUnitOrSuite: new FormControl('', Validators.required),
    });

    this.toAddressResType = this._formBuilder.group({
      toResType: new FormControl('House', Validators.required),
    })

    this.toAddressFlights = this._formBuilder.group({
      toNumberOfFlights: new FormControl(0, Validators.required)
    });

    this.toAddressGroup = this._formBuilder.group({
      toAddressStreetNumber: new FormControl('', Validators.required),
      toAddressStreetName: new FormControl('', Validators.required),
      toCity: new FormControl('', Validators.required),
      toState: new FormControl('', Validators.required),
      toZip: new FormControl('', Validators.required),
      toResidenceType: new FormControl(''),
      toFlights: new FormControl(0),
      toAptNumUnitOrSuite: new FormControl('', Validators.required)
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

    this.roomsGroup.setValidators(this.atLeastOneCheckboxChecked());

    this.boxesGroup = this._formBuilder.group({
      smBox: new FormControl(0),
      mdBox: new FormControl(0),
      lgBox: new FormControl(0),
    })

    this.specialtyGroup = this._formBuilder.group({
      keyboard: new FormControl(0),
      spinetPiano: new FormControl(0),
      consolePiano: new FormControl(0),
      studioPiano: new FormControl(0),
      organ: new FormControl(0),
      safe300lb: new FormControl(0),
      safe400lb: new FormControl(0),
      poolTable: new FormControl(0),
      arcadeGames: new FormControl(0),
      weightEquipment: new FormControl(0),
      machinery: new FormControl(0),
    });

    this.specialRequestGroup = this._formBuilder.group({
      specialTextArea: new FormArray([])
    });
  }

  /**
   * Changes the activeStepIndex based on which stepper step the user is on currently
   * @param index The current index to which the activeStepIndex will be set.
   */
  onActiveStepIndexChange(index: number): void {

    this.activeStepIndex = index;

    if (this.activeStepIndex === 5) {
      this._googleMapsLoaderService.initFromAutoComplete();
    }

    if (this.activeStepIndex === 8) {
      this._googleMapsLoaderService.initToAutoComplete();
    }

    if (this.activeStepIndex === 9) {
      this.writeFromAddressValuesToForm(this._googleMapsLoaderService.fromAutocomplete);
      this.writeToAddressValuesToForm(this._googleMapsLoaderService.toAutocomplete);
      this.extractDistanceToJobMileage();
      this.extractDistanceBetweenAddressesMileage();
      this.totalJobDistanceCalculation();
    }

    if (this.activeStepIndex === 10) {
      this.populateRoomItems();
      console.log('Job Session State at index 11:', this.jobSessionState);
    }

    this.specialRequestSubmissionSuccess = false;
    this.saveMovePlannerState();

  }

  /**
  * Subscribes to value changes of each FormGroup and calls saveMovePlannerState to set session state of session object.
  * Used for refreshing if needed when customer navigates away from and back to the move planner in the middle of a move 
  */
  subscibeAllFormGroupsToValueChanges(): void {
    const allFormGroups = [
      this.servicesGroup,
      this.needTruckGroup,
      this.moveDateGroup,
      this.fromAddressResType,
      this.fromAddressFlights,
      this.fromAddressGroup,
      this.toAddressResType,
      this.toAddressFlights,
      this.toAddressGroup,
      this.roomsGroup,
      this.itemsGroup,
      this.boxesGroup,
      this.specialtyGroup
    ];

    allFormGroups.forEach(formGroup => {
      this.subscriptions.push(
        formGroup.valueChanges.subscribe(_ => {
          this.saveMovePlannerState();
        })
      )
    });
  }

  /**
   * Saves the current state of the move for to a session variable in case the customer navigates away from the move planner
   * in the middle of the move planning process
   */
  saveMovePlannerState(): CreateEstimateSessionState {
    //Customer
    this.jobSessionState.currentCustomer = this.currentCustomer;

    //ServicesGroup
    this.jobSessionState.currentJob.pack = this.servicesGroup.get('packing')?.value;
    this.jobSessionState.currentJob.unpack = this.servicesGroup.get('unpack')?.value;
    this.jobSessionState.currentJob.load = this.servicesGroup.get('load')?.value;
    this.jobSessionState.currentJob.unload = this.servicesGroup.get('unload')?.value;

    //NeedTruckGroup
    this.jobSessionState.currentJob.needTruck = this.needTruckGroup.get('needTruck')?.value;

    //MoveDateGroup
    this.jobSessionState.currentJob.startTime = this.moveDateGroup.get('dateTime')?.value;

    //FromAddressResTypeGroup
    this.jobSessionState.currentJob.loadAddr.resType = this.fromAddressResType.get('fromResType')?.value;

    //FromAddressFlightsGroup
    this.jobSessionState.currentJob.loadAddr.flights = this.fromAddressFlights.get('fromNumberOfFlights')?.value;

    //FromAddressGroup
    this.jobSessionState.currentJob.loadAddr.street = this.fromAddressGroup.get('fromAddressStreetNumber')?.value + ' ' + this.fromAddressGroup.get('fromAddressStreetName')?.value;
    this.jobSessionState.currentJob.loadAddr.city = this.fromAddressGroup.get('fromCity')?.value;
    this.jobSessionState.currentJob.loadAddr.state = this.fromAddressGroup.get('fromState')?.value;
    this.jobSessionState.currentJob.loadAddr.zip = this.fromAddressGroup.get('fromZip')?.value;
    this.jobSessionState.currentJob.loadAddr.aptNum = this.fromAddressGroup.get('fromAptNumUnitOrSuite')?.value ?? '';

    //ToAddressResTypeGroup
    this.jobSessionState.currentJob.unloadAddr.resType = this.toAddressResType.get('toResType')?.value;

    //ToAddressFlightsGroup
    this.jobSessionState.currentJob.unloadAddr.flights = this.toAddressFlights.get('toNumberOfFlights')?.value;

    //ToAddressGroup
    this.jobSessionState.currentJob.unloadAddr.street = this.toAddressGroup.get('toAddressStreetNumber')?.value + ' ' + this.toAddressGroup.get('toAddressStreetName')?.value;
    this.jobSessionState.currentJob.unloadAddr.city = this.toAddressGroup.get('toCity')?.value;
    this.jobSessionState.currentJob.unloadAddr.state = this.toAddressGroup.get('toState')?.value;
    this.jobSessionState.currentJob.unloadAddr.zip = this.toAddressGroup.get('toZip')?.value;
    this.jobSessionState.currentJob.unloadAddr.aptNum = this.toAddressGroup.get('toAptNumUnitOrSuite')?.value ?? '';

    //RoomsGroup
    this.jobSessionState.currentJob.rooms = this.populateFormItems(this.populateFormRooms()) ?? [];

    console.log('Current Job.rooms is:', this.jobSessionState.currentJob.rooms);

    //ItemsGroup
    this.jobSessionState.currentJob.rooms.forEach(room => {
      const roomFormGroup = this.roomsGroup.get(room.roomName);

      if (roomFormGroup) {
        room.items.forEach((count, itemName) => {
          const itemControl = roomFormGroup.get(itemName);
          if (itemControl) {
            itemControl.patchValue(count);
          }
        });
      }
    });

    //BoxesGroup
    this.jobSessionState.currentJob.boxes = new Map<string, number>(Object.entries(this.boxesGroup.value)) ?? new Map<string, number>;

    //SpecialtyGroup
    this.jobSessionState.currentJob.special = this.specialtyGroup.value ?? [];

    //TODO:Need to add special requests group once it is created on the backend

    //ActiveStepIndex
    this.jobSessionState.activeStepIndex = this.activeStepIndex;

    return this.jobSessionState;
  }

  /**
   * Refreshes move planner state if the customer navigates away from the move planner in the middle of planning the move
   * @param sessionStateObject The session object that holds the current move planner session values
   */
  refreshMovePlannerState(sessionStateObject: CreateEstimateSessionState): void {
    console.log('In refreshMovePlanner');
    console.log('Session state object in function is:', sessionStateObject);
    //Customer
    console.log('this.currentCustomer in refreshMovePlanner is:', this.currentCustomer)
    this.currentCustomer = sessionStateObject.currentCustomer;

    // ServicesGroup
    this.servicesGroup.patchValue({
      'packing': sessionStateObject.currentJob.pack !== null ? sessionStateObject.currentJob.pack : false,
      'unpack': sessionStateObject.currentJob.unpack !== null ? sessionStateObject.currentJob.unpack : false,
      'load': sessionStateObject.currentJob.load !== null ? sessionStateObject.currentJob.load : false,
      'unload': sessionStateObject.currentJob.unload !== null ? sessionStateObject.currentJob.unload : false
    }, { emitEvent: false });

    // NeedTruckGroup
    this.needTruckGroup.patchValue({
      'needTruck': sessionStateObject.currentJob.needTruck !== null ? sessionStateObject.currentJob.needTruck : false
    }, { emitEvent: false });

    // MoveDateGroup
    this.moveDateGroup.patchValue({
      'dateTime': sessionStateObject.currentJob.startTime !== null ? sessionStateObject.currentJob.startTime : ''
    }, { emitEvent: false });

    // FromAddressResTypeGroup
    this.fromAddressResType.patchValue({
      'fromResType': sessionStateObject.currentJob.loadAddr.resType !== null ? sessionStateObject.currentJob.loadAddr.resType : 'House'
    }, { emitEvent: false });

    // FromAddressFlightsGroup
    this.fromAddressFlights.patchValue({
      'fromNumberOfFlights': sessionStateObject.currentJob.loadAddr.flights !== null ? sessionStateObject.currentJob.loadAddr.flights : 0
    }, { emitEvent: false });

    // FromAddressGroup
    this.fromAddressGroup.patchValue({
      'fromAddressStreetNumber': sessionStateObject.currentJob.loadAddr.street !== null ? sessionStateObject.currentJob.loadAddr.street : '',
      'fromCity': sessionStateObject.currentJob.loadAddr.city !== null ? sessionStateObject.currentJob.loadAddr.city : '',
      'fromState': sessionStateObject.currentJob.loadAddr.state !== null ? sessionStateObject.currentJob.loadAddr.state : '',
      'fromZip': sessionStateObject.currentJob.loadAddr.zip !== null ? sessionStateObject.currentJob.loadAddr.zip : '',
      'fromAptNumUnitOrSuite': sessionStateObject.currentJob.loadAddr.aptNum !== null ? sessionStateObject.currentJob.loadAddr.aptNum : ''
    }, { emitEvent: false });

    // ToAddressResTypeGroup
    this.toAddressResType.patchValue({
      'toResType': sessionStateObject.currentJob.unloadAddr.resType !== null ? sessionStateObject.currentJob.unloadAddr.resType : 'House'
    }, { emitEvent: false });

    // ToAddressFlightsGroup
    this.toAddressFlights.patchValue({
      'toNumberOfFlights': sessionStateObject.currentJob.unloadAddr.flights !== null ? sessionStateObject.currentJob.unloadAddr.flights : 0
    }, { emitEvent: false });

    // ToAddressGroup
    this.toAddressGroup.patchValue({
      'toAddressStreetNumber': sessionStateObject.currentJob.unloadAddr.street !== null ? sessionStateObject.currentJob.unloadAddr.street : '',
      'toCity': sessionStateObject.currentJob.unloadAddr.city !== null ? sessionStateObject.currentJob.unloadAddr.city : '',
      'toState': sessionStateObject.currentJob.unloadAddr.state !== null ? sessionStateObject.currentJob.unloadAddr.state : '',
      'toZip': sessionStateObject.currentJob.unloadAddr.zip !== null ? sessionStateObject.currentJob.unloadAddr.zip : '',
      'toAptNumUnitOrSuite': sessionStateObject.currentJob.unloadAddr.aptNum !== null ? sessionStateObject.currentJob.unloadAddr.aptNum : ''
    }, { emitEvent: false });

    //RoomsGroup
    console.log('Right before refreshing rooms group value is:', sessionStateObject);
    sessionStateObject.currentJob.rooms.forEach(room => {
      const roomControls = this.roomsGroup.controls;
      if (roomControls.hasOwnProperty(room.roomName)) {
        this.roomsGroup.get(room.roomName)?.patchValue(true, { emitEvent: false });
      } else {
        console.log('error patching rooms')
      }
    });

    //ItemsGroup
    sessionStateObject.currentJob.rooms.forEach(room => {
      room.items.forEach((value, name) => {
        const itemControl = this.itemsGroup.get(name);
        console.log('ItemControl in refreshMovePlannerState is:', itemControl);
        if (itemControl && itemControl instanceof FormControl) {
          itemControl.patchValue(value, { emitEvent: false });
        } else {
          console.log('error patching item values');
        }
      });
    });

    //BoxesGroup
    sessionStateObject.currentJob.boxes.forEach((value, name) => {
      const boxControl = this.boxesGroup.get(name);
      if (boxControl && boxControl instanceof FormControl) {
        boxControl.patchValue(value, { emitEvent: false });
      } else {
        console.log('error patching box value');
      }
    })

    //SpecialtyGroup
    this.specialtyGroup.patchValue(sessionStateObject.currentJob.special);

    //TODO:Need to add special requests group once it is created on the backend

    //ActiveStepIndex
    this.activeStepIndex = sessionStateObject.activeStepIndex;

  }

  /**
   * Populates the room items stepper accordion section based on the rooms selected in the Rooms stepper step
   */
  populateRoomItems(): void {

    // Filter out the unchecked rooms
    this.checkedRooms = Object.entries(this.roomsGroup.controls)
      .filter(([roomName, roomControl]) => roomControl.value)
      .map(([roomName]) => roomName);

    // Iterate over the selected rooms
    this.checkedRooms.forEach(roomName => {
      // Retrieve room items based on the roomName
      const itemsMap = this.getRoomItems(roomName);

      for (const item of itemsMap.keys()) {
        this.itemsGroup.addControl(item, new FormControl());
      }
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
      new Room('Family', new Map([['Couch', 0], ['Rugs', 0], ['Lighting', 0], ['Pillows', 0], ['Blankets', 0], ['Bookshelves', 0], ['Entertainment Center', 0], ['Consoles', 0], ['DVD or Blu-ray Player', 0], ['TV', 0], ['Armchairs', 0], ['Recliners', 0]])),
      new Room('Living', new Map([['Couch', 0], ['Rugs', 0], ['Lighting', 0], ['Pillows', 0], ['Blankets', 0], ['Bookshelves', 0], ['Entertainment Center', 0], ['Consoles', 0], ['DVD or Blu-ray Player', 0], ['TV', 0], ['Armchairs', 0], ['Recliners', 0]])),
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
  boolToString(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(control => {
      const roomValue = this.roomsGroup.get(control)?.value;
      roomValue ? this.roomsGroup.get(control)?.setValue(control) : '';
    });
  }

  /**
   * Adds special requests FormControls from the form text area to the specialRequestGroup 
   * @param requests Special requests inputted byt the customer in the special requests text area of the move form
   */
  addSpecialRequest(requests: string): void {

    const specialRequest = this.specialRequestGroup.get('specialTextArea') as FormArray

    specialRequest.push(this._formBuilder.control(requests));

    this.specialRequestSubmissionSuccess = true;
  }

  /**
   * Concatenates all address fields into a single string for the CreateJobEstimate object
   * @param addressGroup Specifies the toAddress or fromAddress FormGroups
   */
  concatenateAddresses(addressGroup: FormGroup): string {
    let fullAddress: string = '';

    const addressControls = Object.keys(addressGroup.controls)

    addressControls.forEach(control => {
      fullAddress += addressGroup.get(control)?.value + ' ';
    });

    addressGroup.addControl('fullAddress', new FormControl(fullAddress));

    return fullAddress;
  }

  /**
   * Sets the user's chosen rooms for the move and the associated items for those rooms
   * @returns An array of Room objects that the user chose via the form
   */
  populateFormRooms(): Room[] {
    let chosenRooms: Room[] = [];

    //create room objects with the given room name based on rooms the customer check in the form
    this.checkedRooms.forEach(roomName => {
      let roomToAdd = new Room(roomName, new Map<string, number>());
      chosenRooms.push(roomToAdd);
    });

    console.log('checked rooms is:', this.checkedRooms);
    return chosenRooms;
  }

  /**
   * Populates room items based on user input from the move planner form
   * @param formRooms An array of rooms of type Room the user selected for their move 
   */
  populateFormItems(formRooms: Room[]): Room[] {
    let itemsForRooms: Room[] = [];
    //for each checked room, iterate over the checked rooms to populate the itemsMap
    formRooms.forEach(formRoom => {
      let room = this.roomItems.find(item => item.roomName === formRoom.roomName)
      if (room) {
        let itemsMap = new Map<string, number>();

        //iterate over room's associated items
        room.items.forEach((value, name) => {
          //get user input count for number of items based on FormControl
          let control = this.itemsGroup.get(name);
          let itemCount = control ? (control.value as number) : 0;

          itemsMap.set(name, itemCount);

        });
        formRoom.setItems(itemsMap);
        itemsForRooms.push(formRoom);
      }
    });
    return itemsForRooms;
  }

  /**
   * Takes a google maps autocomplete object and writes the associated 'from' address components to the Move Planner form
   * @param autocomplete Autocomplete object that contains the user's 'moving from' address
   */
  writeFromAddressValuesToForm(autocomplete: google.maps.places.Autocomplete): void {
    const place = autocomplete.getPlace();
    console.log('From Place object value:', place);
    place.address_components?.forEach(component => {
      switch (component.types[0]) {
        case 'street_number':
          this.fromAddressGroup.get('fromAddressStreetNumber')?.setValue(component.short_name);
          break;
        case 'route':
          this.fromAddressGroup.get('fromAddressStreetName')?.setValue(component.short_name);
          break;
        case 'locality':
          this.fromAddressGroup.get('fromCity')?.setValue(component.short_name);
          break;
        case 'administrative_area_level_1':
          this.fromAddressGroup.get('fromState')?.setValue(component.short_name);
          break;
        case 'postal_code':
          this.fromAddressGroup.get('fromZip')?.setValue(component.short_name);
          break;
        default:
          break;
      }
    });
  }

  /**
   * Takes a google maps autocomplete object and writes the associated 'to' address components to the Move Planner form
   * @param autocomplete Autocomplete object that contains the user's 'moving to' address
   */
  writeToAddressValuesToForm(autocomplete: google.maps.places.Autocomplete): void {
    const place = autocomplete.getPlace();
    console.log('To Place object value:', place);
    place.address_components?.forEach(component => {
      switch (component.types[0]) {
        case 'street_number':
          this.toAddressGroup.get('toAddressStreetNumber')?.setValue(component.short_name);
          break;
        case 'route':
          this.toAddressGroup.get('toAddressStreetName')?.setValue(component.short_name);
          break;
        case 'locality':
          this.toAddressGroup.get('toCity')?.setValue(component.short_name);
          break;
        case 'administrative_area_level_1':
          this.toAddressGroup.get('toState')?.setValue(component.short_name);
          break;
        case 'postal_code':
          this.toAddressGroup.get('toZip')?.setValue(component.short_name);
          break;
        default:
          break;
      }
    });
  }

  /**
   * Function that extracts the numerical value of the Promise<number> and sets the distanceToJob
   */
  async extractDistanceToJobMileage(): Promise<number | undefined> {
    try {
      const distance = await this._googleMapsLoaderService.geocodeAndCalculateDistance(
        this.choiceMoversAddress,
        this.concatenateAddresses(this.fromAddressGroup)
      );
      //console.log('Distance To Job Mileage value is:', distance)

      this.newJob.distanceToJob = distance !== undefined ? Math.floor(distance) : 0;
      this.jobSessionState.currentJob.distanceToJob = distance !== undefined ? Math.floor(distance) : 0;

      return distance;
    } catch (error) {
      console.error('Error', error);
      return undefined;
    }
  }

  /**
  * Function that extracts the numerical value of the Promise<number> and sets the distanceToJob
  */
  async extractDistanceBetweenAddressesMileage(): Promise<number | undefined> {
    try {
      const distance = await this._googleMapsLoaderService.geocodeAndCalculateDistance(
        this.concatenateAddresses(this.fromAddressGroup),
        this.concatenateAddresses(this.toAddressGroup)
      );
      //console.log('Distance Between Addresses Mileage value is:', distance)

      return distance;

    } catch (error) {
      console.error('Error', error);
      return undefined;
    }
  }

  /**
   * Calculates total job distance
   */
  async totalJobDistanceCalculation() {
    try {
      let totalJobDistance: number | undefined = await this.extractDistanceBetweenAddressesMileage();
      let distanceToJob: number | undefined = await this.extractDistanceToJobMileage();
      //console.log('Total Job distance after initialization', totalJobDistance);

      totalJobDistance !== undefined && distanceToJob !== undefined ? totalJobDistance += distanceToJob : 0;
      //console.log('Total Job distance first assignment', totalJobDistance);

      totalJobDistance !== undefined ? this.newJob.distanceMove += Math.floor(totalJobDistance) : 0;
      //console.log('Total Job distance second assignment', totalJobDistance);
      this.jobSessionState.currentJob.distanceMove = totalJobDistance !== undefined ? Math.floor(totalJobDistance) : 0;

    } catch (error) {
      console.error('Error:', error);
    }
  }

  /**
   * Final form submission. Sets the value of the master object newJob, and sends the newly created estimate to the backend database.
   */
  submitForm(): void {
    console.log('In submit form, customer value is', this.currentCustomer);
    this.boolToString(this.roomsGroup);

    this.newJob.customer = this.currentCustomer;

    this.newJob.loadAddr.street = this.fromAddressGroup.get('fromAddressStreetNumber')?.value + ' ' + this.fromAddressGroup.get('fromAddressStreetName')?.value;
    this.newJob.loadAddr.city = this.fromAddressGroup.get('fromCity')?.value;
    this.newJob.loadAddr.state = this.fromAddressGroup.get('fromState')?.value;
    this.newJob.loadAddr.zip = this.fromAddressGroup.get('fromZip')?.value;
    this.newJob.loadAddr.aptNum = this.fromAddressGroup.get('fromAptNumUnitOrSuite')?.value ?? '';
    this.newJob.loadAddr.resType = this.fromAddressResType.get('fromResType')?.value;
    this.newJob.loadAddr.flights = this.fromAddressFlights.get('fromNumberOfFlights')?.value;

    this.newJob.unloadAddr.street = this.toAddressGroup.get('toAddressStreetNumber')?.value + ' ' + this.toAddressGroup.get('toAddressStreetName')?.value;
    this.newJob.unloadAddr.city = this.toAddressGroup.get('toCity')?.value;
    this.newJob.unloadAddr.state = this.toAddressGroup.get('toState')?.value;
    this.newJob.unloadAddr.zip = this.toAddressGroup.get('toZip')?.value;
    this.newJob.unloadAddr.aptNum = this.toAddressGroup.get('toAptNumUnitOrSuite')?.value ?? '';
    this.newJob.unloadAddr.resType = this.toAddressResType.get('toResType')?.value;
    this.newJob.unloadAddr.flights = this.toAddressFlights.get('toNumberOfFlights')?.value;

    this.newJob.startTime = this.moveDateGroup.value.dateTime + ' ' + this.postfix;
    this.newJob.endTime = '';

    this.newJob.rooms = this.populateFormItems(this.populateFormRooms()) ?? [];

    this.newJob.special = this.specialtyGroup.value ?? [];

    this.newJob.boxes = this.boxesGroup.value ?? new Map();

    this.newJob.pack = this.servicesGroup.value.packing;
    this.newJob.unpack = this.servicesGroup.value.unpack;
    this.newJob.load = this.servicesGroup.value.load;
    this.newJob.unload = this.servicesGroup.value.unload;

    this.newJob.clean = false;

    this.newJob.needTruck = this.needTruckGroup.value.needTruck;

    console.log('New Job object value:', this.newJob);

    console.log('Job session state value:', this.jobSessionState);

    this._jobsService.createCustomerEstimate(this.newJob).subscribe({
      next: (response) => {
        console.log('Customer estimate created successfully', response);
      },
      error: (error) => {
        console.error('Error creating customer estimate', error);
      }
    });

    this._router.navigate(['home/customer-summary']);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

