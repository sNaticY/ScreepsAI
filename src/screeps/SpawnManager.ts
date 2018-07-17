import { SpawnUtils } from "utils/SpawnUtils";
import { TaskTypeString } from "./TypeDefs";

export class SpawnManager {
    public static Execute(spawn: StructureSpawn) {
        if (spawn.spawning) {
            return;
        }
        const spawnQueue = spawn.room.memory.spawning;
        if (this.TrySpawnCreepFromPlan(spawn, TaskTypeString.BootStrap)) {
            return;
        } else if (this.TrySpawnCreepFromPlan(spawn, TaskTypeString.Harvest)) {
            return;
        } else if (this.TrySpawnCreepFromPlan(spawn, TaskTypeString.Carry)) {
            return;
        }
    }

    private static TrySpawnCreepFromPlan(spawn: StructureSpawn, taskType: string): boolean {
        const spawnQueue = spawn.room.memory.spawning;
        if (spawnQueue && spawnQueue[taskType] && spawnQueue[taskType].length > 0) {
            const spawnPlan = spawnQueue[taskType][0];
            const result = SpawnUtils.SpawnCreep(spawnPlan, spawn);
            if (result === OK) {
                spawnQueue[taskType].splice(0, 1);
                return true;
            }
        }
        return false;
    }
}
