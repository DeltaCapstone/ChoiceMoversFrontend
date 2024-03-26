import { Address } from "./address.model";
import { Customer } from "./customer.model";
import { Employee } from "./employee";
import { Room } from "./room.model";


/**
 * Interface that describes the CreateJobType
 */

export interface ICreateJob {
    manHours: number;
    rate: number;
    cost: number;
    finalized: boolean;
    actualManHours: number;
    finalCost: number;
    amountPaid: number;
    assignedEmp: Employee[];
    notes: string;
}
/**
 * Interface that describes the CreateJobEstimate type
 */

export interface ICreateJobEstimate {
    customer: Customer;
    loadAddr: Address;
    unloadAddr: Address;
    startTime: string;
    endTime: string;

    rooms: Room[];
    special: Object[]; //change to array of objects
    boxes: Map<string, number>

    pack: boolean;
    unpack: boolean;
    load: boolean;
    unload: boolean;

    clean: boolean;

    needTruck: boolean;
    distanceToJob: number;
    distanceTotal: number;
}

/**
 * Class that defines a CreateJobEstimate object and its properties and methods
 */
export class CreateJobEstimate implements ICreateJobEstimate {
    customer: Customer;
    loadAddr: Address;
    unloadAddr: Address;
    startTime: string;
    endTime: string;

    rooms: Room[] = [];
    special: Object[];
    boxes: Map<string, number>

    pack: boolean;
    unpack: boolean;
    load: boolean;
    unload: boolean;

    clean: boolean;

    needTruck: boolean;
    distanceToJob: number;
    distanceTotal: number;

    constructor(
        customer: Customer = new Customer(),
        loadAddr: Address = new Address(),
        unloadAddr: Address = new Address(),
        startTime: string = '',
        endTime: string = '',

        rooms: Room[] = [],
        special: Object[] = [],
        boxes: Map<string, number> = new Map(),

        pack: boolean = false,
        unpack: boolean = false,
        load: boolean = false,
        unload: boolean = false,

        clean: boolean = false,

        needTruck: boolean = false,
        distanceToJob: number = 0,
        distanceTotal: number = 0
    ) {
        this.customer = customer;
        this.loadAddr = loadAddr;
        this.unloadAddr = unloadAddr;
        this.startTime = startTime;
        this.endTime = endTime;

        this.rooms = rooms;
        this.special = special;
        this.boxes = boxes;

        this.pack = pack;
        this.unpack = unpack;
        this.load = load;
        this.unload = unload;

        this.clean = clean;

        this.needTruck = needTruck;
        this.distanceToJob = distanceToJob;
        this.distanceTotal = distanceTotal

    }
}

export class CreateJob extends CreateJobEstimate implements ICreateJob {
    manHours: number;
    rate: number;
    cost: number;
    finalized: boolean;
    actualManHours: number;
    finalCost: number;
    amountPaid: number;
    assignedEmp: Employee[];
    notes: string;

    constructor(
        manHours: number = 0,
        rate: number = 0,
        cost: number = 0,
        finalized: boolean = false,
        actualManHours: number = 0,
        finalCost: number = 0,
        amountPaid: number = 0,
        assignedEmp: Employee[] = [],
        notes: string = ''
    ) {
        super();
        this.manHours = manHours;
        this.rate = rate;
        this.cost = cost;
        this.finalized = finalized;
        this.actualManHours = actualManHours;
        this.finalCost = finalCost;
        this.amountPaid = amountPaid;
        this.assignedEmp = assignedEmp;
        this.notes = notes;
    }
}