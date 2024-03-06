export class Room {
    roomName: string;
    items: string[];

    constructor(roomName: string, items: string[]) {
        this.roomName = roomName;
        this.items = items;
    }
}
