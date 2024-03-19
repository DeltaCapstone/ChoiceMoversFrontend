import { Address } from "./address.model";
import { Customer } from "./customer.model";
import { Employee } from "./employee";
import { Room } from "./room.model";

/**
 * Interface that describes the Job type
 */
export interface IJob {
    jobId: string;
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
 * Interface that describes the estimate type
 */
export interface IEstimate {
    estimateID: number;
    customer: Customer;
    loadAddr: Address;
    unloadAddr: Address;
    startTime: string;
    endTime: string;

    rooms: Map<string, object>
    special: Map<string, object>
    small: number;
    medium: number;
    large: number;
    boxes: number;
    itemLoad: number;
    flightMult: number;

    pack: boolean;
    unpack: boolean;
    load: boolean;
    unload: boolean;

    clean: boolean;

    needTruck: boolean;
    numberWorkers: number;
    distToJob: number;
    distMove: number;

    estimateManHours: number;
    estimateRate: number;
    estimateCost: number;
}

export class Estimate implements IEstimate {
    estimateID: number;
    customer: Customer;
    loadAddr: Address;
    unloadAddr: Address;
    startTime: string;
    endTime: string;

    rooms: Map<string, object>
    special: Map<string, object>
    small: number;
    medium: number;
    large: number;
    boxes: number;
    itemLoad: number;
    flightMult: number;

    pack: boolean;
    unpack: boolean;
    load: boolean;
    unload: boolean;

    clean: boolean;

    needTruck: boolean;
    numberWorkers: number;
    distToJob: number;
    distMove: number;

    estimateManHours: number;
    estimateRate: number;
    estimateCost: number;

    constructor(
        estimateID: number = 0,
        customer: Customer = new Customer(),
        loadAddr: Address = new Address(),
        unloadAddr: Address = new Address(),
        startTime: string = '',
        endTime: string = '',
        rooms: Map<string, object> = new Map(),
        special: Map<string, object> = new Map(),
        small: number = 0,
        medium: number = 0,
        large: number = 0,
        boxes: number = 0,
        itemLoad: number = 0,
        flightMult: number = 0,
        pack: boolean = false,
        unpack: boolean = false,
        load: boolean = false,
        unload: boolean = false,
        clean: boolean = false,
        needTruck: boolean = false,
        numberWorkers: number = 0,
        distToJob: number = 0,
        distMove: number = 0,
        estimateManHours: number = 0,
        estimateRate: number = 0,
        estimateCost: number = 0
    ) {
        this.estimateID = estimateID;
        this.customer = customer;
        this.loadAddr = loadAddr;
        this.unloadAddr = unloadAddr;
        this.startTime = startTime;
        this.endTime = endTime;
        this.rooms = rooms;
        this.special = special;
        this.small = small;
        this.medium = medium;
        this.large = large;
        this.boxes = boxes;
        this.itemLoad = itemLoad;
        this.flightMult = flightMult;
        this.pack = pack;
        this.unpack = unpack;
        this.load = load;
        this.unload = unload;
        this.clean = clean;
        this.needTruck = needTruck;
        this.numberWorkers = numberWorkers;
        this.distToJob = distToJob;
        this.distMove = distMove;
        this.estimateManHours = estimateManHours;
        this.estimateRate = estimateRate;
        this.estimateCost = estimateCost;
    }
}

/**
 * Class that defines a Job object and its properties and methods
 */
export class Job extends Estimate implements IJob, IEstimate {
    jobId: string;
    manHours: number;
    rate: number;
    cost: number;
    finalized: boolean;
    actualManHours: number;
    finalCost: number;
    amountPaid: number;
    assignedEmp: Employee[];
    notes: string;

    constructor(jobId: string = "", manHours: number = 0, rate: number = 0, cost: number = 0, finalized: boolean = false, actualManHours: number = 0,
        finalCost: number = 0, amountPaid: number = 0, assignedEmp: Employee[] = [], notes: string = "") {
        super();
        this.jobId = jobId;
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

    //Getters and setters
}