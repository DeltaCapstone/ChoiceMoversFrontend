/**
 * Interface that describes the Room type 
 */
export interface IRoom {
    roomName: string;
    items: string[];
    itemCounts: { [item: string]: number };
}

/**
 * Class that defines a Room object and its properties and methods
 */
export class Room implements IRoom {
    roomName: string;
    items: string[];
    itemCounts: { [item: string]: number };

    constructor(roomName: string, items: string[]) {
        this.roomName = roomName;
        this.items = items;
        this.itemCounts = {};
        this.initializeItemCounts();
    }

    initializeItemCounts(): void {
        this.items.forEach(item => {
            this.itemCounts[item] = 0
        });
    }

    getRoomName(): string {
        return this.roomName;
    }

    setRoomName(roomName: string): void {
        this.roomName = roomName;
    }

    getItems(): string[] {
        return this.items;
    }

    setItems(item: string): void {
        this.items.push(item);
    }

    getItemCounts(item: string): number {
        return this.itemCounts[item] ? this.itemCounts[item] : 0;
    }

    setItemCounts(item: string, count: number): void {
        this.itemCounts[item] = count;
    }
}
