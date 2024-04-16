import { Address } from "./address.model";
import { Customer } from "./customer.model";
import { AssignedEmployee } from "./employee";
import { Room } from "./room.model";

/**
 * Interface that describes the Job type
 */
export interface IJob {
    estimateId: number;
    jobId: string;
    jobManHours: number;
    jobRate: number;
    jobCost: number;
    finalized: boolean;
    actualManHours: string;
    finalCost: number;
    amountPaid: number;
    notes: string;
}

/**
 * Interface that describes the estimate type
 */
export interface IEstimate {
    estimateId: number;
    customer: Customer;
    loadAddr: Address;
    unloadAddr: Address;
    startTime: string;
    endTime: string;

    rooms: Array<Room>
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


    needTruck: boolean;
    numberWorkers: number;
    distToJob: number;
    distMove: number;

    estimateManHours: number;
    estimateRate: number;
    estimateCost: number;
}

export class Estimate implements IEstimate {
    estimateId: number;
    customer: Customer;
    loadAddr: Address;
    unloadAddr: Address;
    startTime: string;
    endTime: string;

    rooms: Array<Room>
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

    needTruck: boolean;
    numberWorkers: number;
    distToJob: number;
    distMove: number;

    estimateManHours: number;
    estimateRate: number;
    estimateCost: number;

    constructor(
        estimateId: number = 0,
        customer: Customer = new Customer(),
        loadAddr: Address = new Address(),
        unloadAddr: Address = new Address(),
        startTime: string = '',
        endTime: string = '',
        rooms: Array<Room> = [],
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
        this.estimateId = estimateId;
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
    jobManHours: number;
    jobRate: number;
    jobCost: number;
    finalized: boolean;
    actualManHours: string;
    finalCost: number;
    amountPaid: number;
    assignedEmployees: AssignedEmployee[];
    notes: string;

    constructor(jobId: string = "", jobManHours: number = 0, rate: number = 0, cost: number = 0, finalized: boolean = false, actualManHours: string = "P0T0h0m0s",
        finalCost: number = 0, amountPaid: number = 0, assignedEmployees: AssignedEmployee[] = [], notes: string = "") {
        super();
        this.jobId = jobId;
        this.jobManHours = jobManHours;
        this.jobRate = rate;
        this.jobCost = cost;
        this.finalized = finalized;
        this.actualManHours = actualManHours;
        this.finalCost = finalCost;
        this.amountPaid = amountPaid;
        this.assignedEmployees = assignedEmployees;
        this.notes = notes;
    }

    //Getters and setters
}

export enum AssignmentConflictType {
    JobFull = "JOB_FULL",
    ManagerAssigned = "MANAGER_ASSIGNED",
    AlreadyAssigned = "ALREADY_ASSIGNED"
}
