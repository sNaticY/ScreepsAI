import Board from "behaviour/Board";
import { random, List, Dictionary } from "lodash";

const BodyParts: Dictionary<List<BodyPartConstant[]>> = {
    worker: [
        [],
        //300, 4
        [
            WORK, //100
            CARRY,  //50
            MOVE, MOVE, //100
        ],
        // 550, 8
        [
            WORK, WORK,  //200
            CARRY, CARRY, //100
            MOVE, MOVE, MOVE, MOVE //200
        ],
        // 800, 12
        [
            WORK, WORK, WORK, WORK, //400
            CARRY, CARRY, CARRY, CARRY, //200
            MOVE, MOVE, MOVE, MOVE, //200
        ],
        // 1300, 18
        [
            WORK, WORK, WORK, WORK, WORK, WORK, //600
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, //300
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,  //300
        ],
        // 1800, 27
        [
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,//900
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,//450
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,//450
        ],
        //2300, 33
        [
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1100
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, //550
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, //550
        ],
        //5300, 50
        [
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,//1700
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,//800
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, //850
        ],
        // 12300, 50  
        [
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,//1700
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,//800
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, //850
        ],
    ],
    miner: [
        [],
        [],
        [WORK, WORK, WORK, WORK, WORK, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    ],
    carrier: [
        [],
        [],
        [ //550
            CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE
        ],
        [ //800
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
        [ //1300
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
        [ //1800 
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
        [ //2300
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
        [ //5300
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
        [ //12300
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
    ]
}

export class BuildHelper {
    public static BuildCreep(role: string, level: number, spawn: StructureSpawn, name: string): ScreepsReturnCode {
        if (role == "harvester" || role == "upgrader" || role == "builder") {
            var result = spawn.spawnCreep(BodyParts["worker"][level], name, { memory: BuildHelper.GenScreepsMemory(role, level) });
            return result;
        }
        if (role == "miner") {
            Board.MinerIndex++;
        }
        var result = spawn.spawnCreep(BodyParts[role][level], name, { memory: BuildHelper.GenScreepsMemory(role, level) });
        return result;
    }

    public static BuildRoad(path: PathStep[], room: Room) {
        for (let k = 0; k < path.length; k++) {
            const roadPos = path[k];
            room.createConstructionSite(roadPos.x, roadPos.y, STRUCTURE_ROAD);
        }
    }

    private static GenScreepsMemory(role: string, level: number): CreepMemory {
        var minerIndex = 0;
        if (role == "miner") {
            minerIndex = Board.MinerIndex;
        }
        else {
            minerIndex = random(0, 1);
        }
        return { role: role, fromContainer: false, harvestIndex: minerIndex, level: level };
    }

    public static BuildExtensionNearPos(originPos: RoomPosition, range: number): ScreepsReturnCode {
        var room = Board.CurrentSpawn.room;
        var pos: RoomPosition | undefined;
        for (let i = range * -1; i < range; i++) {
            var pos1 = room.getPositionAt(originPos.x + i, originPos.y - range);
            if (pos1 && Math.abs(pos1.x - pos1.y) % 2 == 0 && pos1.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 && pos1.lookFor(LOOK_STRUCTURES).length == 0 && Game.map.getTerrainAt(pos1.x, pos1.y, room.name) != "wall") {
                pos = pos1;
                break;
            }
            var pos2 = room.getPositionAt(originPos.x + i, originPos.y + range);
            if (pos2 && Math.abs(pos2.x - pos2.y) % 2 == 0 && pos2.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 && pos2.lookFor(LOOK_STRUCTURES).length == 0 && Game.map.getTerrainAt(pos2.x, pos2.y, room.name) != "wall") {
                pos = pos2;
                break;
            }
            var pos3 = room.getPositionAt(originPos.x - range, originPos.y + i);
            if (pos3 && Math.abs(pos3.x - pos3.y) % 2 == 0 && pos3.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 && pos3.lookFor(LOOK_STRUCTURES).length == 0 && Game.map.getTerrainAt(pos3.x, pos3.y, room.name) != "wall") {
                pos = pos3;
                break;
            }
            var pos4 = room.getPositionAt(originPos.x + range, originPos.y + i);
            if (pos4 && Math.abs(pos4.x - pos4.y) % 2 == 0 && pos4.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 && pos4.lookFor(LOOK_STRUCTURES).length == 0 && Game.map.getTerrainAt(pos4.x, pos4.y, room.name) != "wall") {
                pos = pos4;
                break;
            }
        }
        if (pos) {
            var result = room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION);
            return result;
        }
        return -9;
    }

    public static BuildContainerNearPos(originPos: RoomPosition): ScreepsReturnCode {
        var room = Board.CurrentSpawn.room;
        var pos: RoomPosition | undefined;
        for (let j = -1; j < 1; j++) {
            var pos1 = room.getPositionAt(originPos.x + j, originPos.y - 1);
            if (pos1) {
                var structures = pos1.lookFor(LOOK_STRUCTURES);
                if (Game.map.getTerrainAt(pos1.x, pos1.y, room.name) != "wall" && (structures.length == 0 || (structures.length == 1 && structures[0].structureType == STRUCTURE_ROAD))) {
                    pos = pos1;
                }
            }
            var pos2 = room.getPositionAt(originPos.x + j, originPos.y + 1);
            if (pos2) {
                var structures = pos2.lookFor(LOOK_STRUCTURES);
                if (Game.map.getTerrainAt(pos2.x, pos2.y, room.name) != "wall" && (structures.length == 0 || (structures.length == 1 && structures[0].structureType == STRUCTURE_ROAD))) {
                    pos = pos2;
                }
            }
            var pos3 = room.getPositionAt(originPos.x - 1, originPos.y + j);
            if (pos3) {
                var structures = pos3.lookFor(LOOK_STRUCTURES);
                if (Game.map.getTerrainAt(pos3.x, pos3.y, room.name) != "wall" && (structures.length == 0 || (structures.length == 1 && structures[0].structureType == STRUCTURE_ROAD))) {
                    pos = pos3;
                }
            }
            var pos4 = room.getPositionAt(originPos.x + 1, originPos.y + j);
            if (pos4) {
                var structures = pos4.lookFor(LOOK_STRUCTURES);
                if (Game.map.getTerrainAt(pos4.x, pos4.y, room.name) != "wall" && (structures.length == 0 || (structures.length == 1 && structures[0].structureType == STRUCTURE_ROAD))) {
                    pos = pos4;
                }
            }
        }
        if (pos) {
            var result = room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER);
            return result;
        }
        return -9;
    }

    public static BuildStorageNearPos(originPos: RoomPosition, range: number): ScreepsReturnCode {
        var room = Board.CurrentSpawn.room;
        var pos: RoomPosition | undefined;
        for (let i = range * -1; i < range; i++) {
            var pos1 = room.getPositionAt(originPos.x + i, originPos.y - range);
            if (pos1 && Math.abs(pos1.x - pos1.y) % 2 == 0 && pos1.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 && pos1.lookFor(LOOK_STRUCTURES).length == 0 && Game.map.getTerrainAt(pos1.x, pos1.y, room.name) != "wall") {
                pos = pos1;
                break;
            }
            var pos2 = room.getPositionAt(originPos.x + i, originPos.y + range);
            if (pos2 && Math.abs(pos2.x - pos2.y) % 2 == 0 && pos2.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 && pos2.lookFor(LOOK_STRUCTURES).length == 0 && Game.map.getTerrainAt(pos2.x, pos2.y, room.name) != "wall") {
                pos = pos2;
                break;
            }
            var pos3 = room.getPositionAt(originPos.x - range, originPos.y + i);
            if (pos3 && Math.abs(pos3.x - pos3.y) % 2 == 0 && pos3.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 && pos3.lookFor(LOOK_STRUCTURES).length == 0 && Game.map.getTerrainAt(pos3.x, pos3.y, room.name) != "wall") {
                pos = pos3;
                break;
            }
            var pos4 = room.getPositionAt(originPos.x + range, originPos.y + i);
            if (pos4 && Math.abs(pos4.x - pos4.y) % 2 == 0 && pos4.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 && pos4.lookFor(LOOK_STRUCTURES).length == 0 && Game.map.getTerrainAt(pos4.x, pos4.y, room.name) != "wall") {
                pos = pos4;
                break;
            }
        }
        if (pos) {
            var result = room.createConstructionSite(pos.x, pos.y, STRUCTURE_STORAGE);
            return result;
        }
        return -9;
    }

}