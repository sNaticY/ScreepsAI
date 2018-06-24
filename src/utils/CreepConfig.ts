import Board from "behaviour/Board";
import { random } from "lodash";

export class CreepConfig {
    public static BuildWorkerLv1(role: string, spawn: StructureSpawn, name: string) : ScreepsReturnCode {
        var result = spawn.spawnCreep([WORK, WORK, CARRY, MOVE], name, { memory: GenScreepsMemory(role, 1) });
        return result;
    }

    public static BuildWorkerLv2(role: string, spawn: StructureSpawn, name: string) : ScreepsReturnCode {
        var result = spawn.spawnCreep([WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], name, { memory: GenScreepsMemory(role, 2) });
        return result;
    }

    public static BuildWorkerLv3(role: string, spawn: StructureSpawn, name: string): ScreepsReturnCode {
        var result = spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], name, { memory: GenScreepsMemory(role, 3) });
        return result;
    }

    public static BuildWorkerLv4(role: string, spawn: StructureSpawn, name: string): ScreepsReturnCode {
        var result = spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], name, { memory: GenScreepsMemory(role, 3) });
        return result;
    }

    public static BuildMinerLv2(spawn: StructureSpawn, name: string) : ScreepsReturnCode {
        var result = spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], name, { memory: GenScreepsMemory("miner", 2) });
        if(result == 0)
        {
            Board.MinerIndex++;
        }
        return result;
    }

    public static BuildCarrierLv2(spawn: StructureSpawn, name: string) : ScreepsReturnCode {
        var result = spawn.spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], name, { memory: GenScreepsMemory("carrier", 2) });
        return result;
    }

    public static BuildCarrierLv3(spawn: StructureSpawn, name: string) : ScreepsReturnCode {
        var result = spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], name, { memory: GenScreepsMemory("carrier", 3) });
        return result;
    }

    public static BuildCarrierLv4(spawn: StructureSpawn, name: string) : ScreepsReturnCode {
        var result = spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], name, { memory: GenScreepsMemory("carrier", 4) });
        return result;
    }
}

function GenScreepsMemory(role: string, level: number) : CreepMemory {
    var minerIndex = 0;
    if(role == "miner"){
        minerIndex = Board.MinerIndex;
    }
    else{
        minerIndex = random(0,1);
    }
    return {role: role, upgrading: false, building: false, harvestIndex: minerIndex, level: level};
}