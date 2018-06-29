import Board from "behaviour/Board";
import { random, List, Dictionary } from "lodash";

const BodyParts: Dictionary<List<BodyPartConstant[]>> = {
    worker: [
        [],
        [
            WORK, WORK, 
            CARRY, 
            MOVE
        ],
        [
            WORK, WORK, WORK, WORK, 
            CARRY, 
            MOVE, MOVE
        ],
        [
            WORK, WORK, WORK, WORK, WORK, 
            CARRY, CARRY, 
            MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK, WORK, WORK, WORK, 
            CARRY, CARRY, CARRY, CARRY, 
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK, WORK, WORK, WORK, 
            CARRY, CARRY, CARRY, CARRY, CARRY, 
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK, WORK, WORK, WORK, 
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK, WORK, WORK, WORK, 
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        [
            WORK, WORK, WORK, WORK, WORK, WORK, 
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    ],
    miner: [
        [],
        [],
        [WORK, WORK, WORK, WORK, WORK, MOVE],
        [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
    ],
    carrier: [
        [],
        [],
        [
            CARRY, CARRY, CARRY, 
            MOVE, MOVE, MOVE
        ],
        [
            CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE
        ],
        [
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
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
        return { role: role, upgrading: false, building: false, transfering: false, fromContainer: false, harvestIndex: minerIndex, level: level };
    }

    public static BuildExtensionNearPos(originPos: RoomPosition, range: number): ScreepsReturnCode {
        var room = Board.CurrentSpawn.room;
        var pos: RoomPosition | undefined;
        for (let i = range * -1; i <= range; i++) {
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
}