/**
 * Class that defines a Job object and its properties and methods
 */
import { Room } from "./room.model";
export class Job {
    id: number;
    customerID: number;
    loadAddr: number; //string?
    unloadAddr: number; //string?
    startTime: Date;
    hoursLabor: number;
    finalized: boolean;
    rooms: Room[];
    pack: boolean;
    unpack: boolean;
    load: boolean;
    unload: boolean;
    clean: boolean;
    mileage: number;
    cost: number;

    constructor(id: number, customerID: number, loadAddr: number, unloadAddr: number, startTime: Date, hoursLabor: number, finalized: boolean, rooms: Room[], pack: boolean, unpack: boolean, load: boolean, unload: boolean, clean: boolean, mileage: number, cost: number) {
        this.id = id;
        this.customerID = customerID;
        this.loadAddr = loadAddr;
        this.unloadAddr = unloadAddr;
        this.startTime = startTime;
        this.hoursLabor = hoursLabor;
        this.finalized = finalized;
        this.rooms = rooms;
        this.pack = pack;
        this.unpack = unpack;
        this.load = load;
        this.unload = unload;
        this.clean = clean;
        this.mileage = mileage;
        this.cost = cost;
    }

    //Getters and setters

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }


    getCustomerID(): number {
        return this.customerID;
    }

    setCustomerID(customerID: number): void {
        this.customerID = customerID;
    }


    getLoadAddr(): number {
        return this.loadAddr;
    }

    setLoadAddr(loadAddr: number): void {
        this.loadAddr = loadAddr;
    }

    getUnloadAddr(): number {
        return this.unloadAddr;
    }

    setUnloadAddr(unloadAddr: number): void {
        this.unloadAddr = unloadAddr;
    }

    getStartTime(): Date {
        return this.startTime;
    }

    setStartTime(startTime: Date): void {
        this.startTime = startTime;
    }

    getHoursLabor(): number {
        return this.hoursLabor;
    }

    setHoursLabor(hoursLabor: number): void {
        this.hoursLabor = hoursLabor;
    }

    getFinalized(): boolean {
        return this.finalized;
    }

    setFinalized(finalized: boolean): void {
        this.finalized = finalized;
    }

    //maybe rework this set of getters and setters (Rooms is an array of objects)

    getPack(): boolean {
        return this.pack;
    }

    setPack(pack: boolean): void {
        this.pack = pack;
    }

    getUnpack(): boolean {
        return this.unpack;
    }

    setUnpack(unpack: boolean): void {
        this.unpack = unpack;
    }

    getLoad(): boolean {
        return this.load;
    }

    setLoad(load: boolean): void {
        this.load = load;
    }

    getUnload(): boolean {
        return this.unload;
    }

    setUnload(unload: boolean): void {
        this.unload = unload;
    }

    getClean(): boolean {
        return this.clean;
    }

    setClean(clean: boolean): void {
        this.clean = clean;
    }

    getMileage(): number {
        return this.mileage;
    }

    setMileage(mileage: number): void {
        this.mileage = mileage;
    }

    getCost(): number {
        return this.cost;
    }

    setCost(cost: number): void {
        this.cost = cost;
    }
}

