export class Room {
    roomName: string;
    items: string[];

    constructor(roomName: string, items: string[]) {
        this.roomName = roomName;
        this.items = items;
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
}
