import Board from "behaviour/Board";
import { random, List, Dictionary } from "lodash";


interface PosFilter {
    (pos:RoomPosition): boolean;
}

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
        var result = spawn.spawnCreep(BodyParts[role][level], name, { memory: BuildHelper.GenScreepsMemory(role, level) });

        if (result == 0 && role == "miner") {
            Board.MinerIndex++;
        }
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
        return { role: role, harvestIndex: minerIndex, level: level };
    }

    public static BuildOneStructureNearPos(originPos: RoomPosition, range: number, type: BuildableStructureConstant, filter: PosFilter): ScreepsReturnCode {
        var room = Board.CurrentRoom;
        var pos: RoomPosition | undefined;
        for (let i = range * -1; i < range; i++) {
            var pos1 = room.getPositionAt(originPos.x + i, originPos.y - range);
            if(pos1 && filter(pos1)) { pos = pos1; break; }
            var pos2 = room.getPositionAt(originPos.x + i, originPos.y + range);
            if(pos2 && filter(pos2)) { pos = pos2; break; }
            var pos3 = room.getPositionAt(originPos.x - range, originPos.y + i);
            if(pos3 && filter(pos3)) { pos = pos3; break; }
            var pos4 = room.getPositionAt(originPos.x + range, originPos.y + i);
            if(pos4 && filter(pos4)) { pos = pos4; break; }
        }
        if (pos) {
            var result = room.createConstructionSite(pos.x, pos.y, type);
            return result;
        }
        return -9;
    }

    public static BuildAllStructureNearPos(originPos: RoomPosition, range: number, type: BuildableStructureConstant, filter: PosFilter) {
        var room = Board.CurrentRoom;
        for (let i = range * -1; i < range; i++) {
            var pos1 = room.getPositionAt(originPos.x + i, originPos.y - range);
            if(pos1 && filter(pos1)) { room.createConstructionSite(pos1, type) }
            var pos2 = room.getPositionAt(originPos.x + i, originPos.y + range);
            if(pos2 && filter(pos2)) { room.createConstructionSite(pos2, type) }
            var pos3 = room.getPositionAt(originPos.x - range, originPos.y + i);
            if(pos3 && filter(pos3)) { room.createConstructionSite(pos3, type) }
            var pos4 = room.getPositionAt(originPos.x + range, originPos.y + i);
            if(pos4 && filter(pos4)) { room.createConstructionSite(pos4, type) }
        }
    }

}