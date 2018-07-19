import { Dictionary } from "lodash";
import { Area } from "../areas/Area";

export class Sector {
    public id: string;
    // Key = roomId. value = area
    public areas: Dictionary<Area> = {};

    constructor(room: Room|undefined, memory: SectorMemory|undefined) {
        if (room) {
            this.id = room.name;
            this.addNewRoom(room);
        } else if (memory) {
            this.id = memory.name;
            for (const roomId of memory.roomNames) {
                if (Game.rooms[roomId]) {
                    this.addNewRoom(Game.rooms[roomId]);
                }
            }
        } else {
            this.id = "";
            return;
        }

        if (Memory.purifier.sectorIds.indexOf(this.id) === -1) {
            Memory.purifier.sectorIds.push(this.id);
        }
    }

    public addNewRoom(room: Room) {
        // TODO: Set Room Plans for a New Room
    }

}
