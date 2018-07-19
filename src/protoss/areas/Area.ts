import { Dictionary } from "lodash";
import { Unit } from "../units/Unit";

export class Area {
    // RoomId
    public id: string;
    public room: Room;
    // Key = UnitId, value = Unit
    public units: Dictionary<Unit> = {};

    /**
     * Init
     */
    constructor(room: Room) {
        this.id = room.name;
        this.room = room;
    }
}
