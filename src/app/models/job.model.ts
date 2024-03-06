
export class Job {
    id: number;
    customerID: number;
    loadAddr: number;
    unloadAddr: number;
    startTime: Date;
    hoursLabor: number;
    finalized: boolean;
    rooms: string[];
    pack: boolean;
    unpack: boolean;
    load: boolean;
    unload: boolean;
    clean: boolean;
    mileage: number;
    cost: number;

    constructor(id: number, customerID: number, loadAddr: number, unloadAddr: number, startTime: Date, hoursLabor: number, finalized: boolean, rooms: string[], pack: boolean, unpack: boolean, load: boolean, unload: boolean, clean: boolean, mileage: number, cost: number) {
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

    //Implement getters and setters for job class
}
