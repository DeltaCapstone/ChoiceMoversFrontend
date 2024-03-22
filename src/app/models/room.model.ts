/**
 * Interface that describes the Room type 
 */
export interface IRoom {
    roomName: string;
    items: Map<string, number>;
}

/**
 * Class that defines a Room object and its properties and methods
 */
export class Room implements IRoom {
    roomName: string;
    items: Map<string, number>;

    constructor(roomName: string, items: Map<string, number>) {
        this.roomName = roomName;
        this.items = items;
    }

    getRoomName(): string {
        return this.roomName;
    }

    setRoomName(roomName: string): void {
        this.roomName = roomName;
    }

    getItems(): Map<string, number> {
        return this.items;
    }

    setItems(items: Map<string, number>): void {
        this.items = items;
    }

}
