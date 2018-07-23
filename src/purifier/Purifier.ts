import { Dictionary } from "lodash";
import { Sector } from "./sectors/Sector";

export class Purifier {
    // Key = id, value = Sector
    public static sectors: Dictionary<Sector> = {};

    public static initialize() {
        // if just resplawned, clear memroies from last game.
        this.checkRespawn();

        // tslint:disable-next-line:no-debugger
        debugger;

        // Load existed sectors
        for (const sectorId of Memory.purifier.sectorIds) {
            const sector = Memory.sectors[sectorId];
            if (!Game.rooms[sectorId]) {
                continue;
            }
            this.sectors[sector.name] = new Sector(Game.rooms[sectorId], sector);
        }

        // Load All Known Rooms.
        for (const id in Game.rooms) {
            if (Game.rooms.hasOwnProperty(id)) {
                const room = Game.rooms[id];
                if (this.findRoomInSectors(room.name) === undefined) {
                    this.planNewRoom(room);
                }
            }
        }
    }

    public static planNewRoom(room: Room) {
        let routeLength = 999;
        let minCapitalName = "";

        // calc nerest capital name
        for (const capitalName in Memory.sectors) {
            const route = Game.map.findRoute(room, capitalName);
            if (route !== -2) {
                if (route.length < routeLength) {
                    routeLength = route.length;
                    minCapitalName = capitalName;
                }
            }
        }

        if (minCapitalName === "") {
            this.sectors[room.name] = new Sector(room, undefined);
        } else {
            if (routeLength <= 1) {
                this.sectors[minCapitalName].addSubRoom(room);
            } else {
                const sourceCount = room.find(FIND_SOURCES).length;
                if (sourceCount >= 2 && room.controller) {
                    this.sectors[room.name] = new Sector(room, undefined);
                }
            }
        }
    }

    private static findRoomInSectors(roomId: string): string|undefined {
        for (const key in Memory.sectors) {
            if (Memory.sectors.hasOwnProperty(key)) {
                const sector = Memory.sectors[key];
                for (const roomName of sector.subRoomIds) {
                    if (roomName === roomId) {
                        return sector.name;
                    }
                }
            }
        }
        return undefined;
    }

    private static checkRespawn() {
        if (Memory.forceClear) {
            this.clearMemory();
        } else if (_.size(Game.rooms) === 1 && _.size(Game.creeps) === 0) {
            const initRoom = _.find(Game.rooms);
            if (initRoom && initRoom.controller && initRoom.controller.level === 1) {
                this.clearMemory();
            }
        }
    }

    private static clearMemory() {
        Memory.creeps = {};
        Memory.flags = {};
        Memory.sectors = {};
        Memory.tasks = {};
        Memory.spawns = {};
        Memory.rooms = {};
        Memory.purifier = {
            managedRoomIds: [],
            sectorIds: []
        };
    }
}
