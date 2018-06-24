export class CreepConfig {
    public static BuildWorkerLv1(role: string, spawn: StructureSpawn, name: string) : ScreepsReturnCode {
        var result = spawn.spawnCreep([WORK, CARRY, MOVE], name, { memory: GenScreepsMemory(role) })
        return result;
    }

    public static BuildMinerLv2(spawn: StructureSpawn, name: string) : ScreepsReturnCode {
        var result = spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], name, { memory: GenScreepsMemory("miner") })
        return result;
    }

    public static BuildCarrierLv2(spawn: StructureSpawn, name: string) : ScreepsReturnCode {
        var result = spawn.spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], name, { memory: GenScreepsMemory("carrier") })
        return result;
    }

    public static BuildWorkerLv2(role: string, spawn: StructureSpawn, name: string) : ScreepsReturnCode {
        var result = spawn.spawnCreep([WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], name, { memory: GenScreepsMemory(role) })
        return result;
    }
}

function GenScreepsMemory(role: string) : CreepMemory {
    return {role: role, upgrading: false, building: false}
}