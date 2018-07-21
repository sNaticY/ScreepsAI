import { Dictionary } from "lodash";
import { Area } from "../areas/Area";

export class Sector {
    public id: string;
    // Key = roomId. value = area
    public mainArea: Area;
    public reservedArea: Dictionary<Area> = {};

    constructor(room: Room, memory: SectorMemory|undefined) {
        this.id = room.name;
        this.mainArea = new Area(room);
        this.addMainRoom(room);

        if (memory) {
            for (const roomId of memory.subRoomIds) {
                if (Game.rooms[roomId]) {
                    this.addSubRoom(Game.rooms[roomId]);
                }
            }
        }

        if (Memory.purifier.sectorIds.indexOf(this.id) === -1) {
            Memory.purifier.sectorIds.push(this.id);
        }
    }

    protected addMainRoom(room: Room) {
        if (Memory.purifier.managedRoomIds.indexOf(room.name) === -1) {
            Memory.purifier.managedRoomIds.push(room.name);
        }
    }

    public addSubRoom(room: Room) {
        // TODO: Set Room Plans for a New Room
        if (room.controller) {
            this.reservedArea[room.name] = new Area(room);
        }
        if (Memory.sectors[this.id].subRoomIds.indexOf(room.name) === -1) {
            Memory.sectors[this.id].subRoomIds.push(room.name);
        }

        if (Memory.purifier.managedRoomIds.indexOf(room.name) === -1) {
            Memory.purifier.managedRoomIds.push(room.name);
        }
    }
}
