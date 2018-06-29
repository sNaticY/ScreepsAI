import Board from "behaviour/Board";
import { random, List, Dictionary } from "lodash";

const BodyParts : Dictionary<List<BodyPartConstant[]>> = {
    worker : [
        [], 
        [WORK, WORK, CARRY, MOVE],
        [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    ],
    miner: [
        [],
        [WORK, WORK, WORK, WORK, WORK, MOVE],
        [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
    ],
    carrier: [
        [],
        [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    ]
}

export class BuildHelper {
    public static BuildCreep(role: string,level: number, spawn: StructureSpawn, name: string): ScreepsReturnCode {
        if(role == "harvester" || role == "upgrader" || role == "builder")
        {
            var result = spawn.spawnCreep(BodyParts["worker"][level], name, {memory: BuildHelper.GenScreepsMemory(role, level)});
            return result;
        }
        var result = spawn.spawnCreep(BodyParts[role][level], name, {memory: BuildHelper.GenScreepsMemory(role, level)});
        return result;
    }

    public static BuildRoad(path:PathStep[], room: Room) {
        for (let k = 0; k < path.length; k++) {
            const roadPos = path[k];
            room.createConstructionSite(roadPos.x, roadPos.y, STRUCTURE_ROAD);
        }
    }

    private static GenScreepsMemory(role: string, level: number) : CreepMemory {
        var minerIndex = 0;
        if(role == "miner"){
            minerIndex = Board.MinerIndex;
        }
        else{
            minerIndex = random(0,1);
        }
        return {role: role, upgrading: false, building: false, transfering: false, fromContainer: false, harvestIndex: minerIndex, level: level};
    }
}