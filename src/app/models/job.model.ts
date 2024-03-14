import { Room } from "./room.model";
/**
 * Interface that describes the Job type
 */
export interface IJobRequest {
    username: string;
    loadAddr: string;
    unloadAddr: string;
    startTime: Date;
    rooms: Room[];
    pack: boolean;
    unpack: boolean;
    load: boolean;
    unload: boolean;
    clean: boolean;
    notes: string;
}

/**
 * Class that defines a Job object and its properties and methods
 */
export class JobRequest {
    username: string;
    loadAddr: string = "";
    unloadAddr: string = "";
    startTime: Date = new Date();
    rooms: Room[] = [];
    pack: boolean = false;
    unpack: boolean = false;
    load: boolean = false;
    unload: boolean = false;
    clean: boolean = false;
    notes: string = "";

    constructor(username: string, loadAddr: string, unloadAddr: string, startTime: Date, rooms: Room[], pack: boolean, unpack: boolean, load: boolean, unload: boolean, clean: boolean, notes: string) {
        this.username = username;
        this.loadAddr = loadAddr;
        this.unloadAddr = unloadAddr;
        this.startTime = startTime;
        this.rooms = rooms;
        this.pack = pack;
        this.unpack = unpack;
        this.load = load;
        this.unload = unload;
        this.clean = clean;
        this.notes = notes;
    }

    //Getters and setters

    getUsername(): string {
        return this.username;
    }

    setUsername(username: string): void {
        this.username = username;
    }

    getLoadAddr(): string {
        return this.loadAddr;
    }

    setLoadAddr(loadAddr: string): void {
        this.loadAddr = loadAddr;
    }

    getUnloadAddr(): string {
        return this.unloadAddr;
    }

    setUnloadAddr(unloadAddr: string): void {
        this.unloadAddr = unloadAddr;
    }

    getStartTime(): Date {
        return this.startTime;
    }

    setStartTime(startTime: Date): void {
        this.startTime = startTime;
    }

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
}

