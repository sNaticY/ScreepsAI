import { SpawnUtils } from "utils/SpawnUtils";
import { TaskTypeString } from "./TypeDefs";

export class SpawnManager {
    public static Execute(spawn: StructureSpawn) {
        if (spawn.spawning) {
            return;
        }
        const spawnQueue = spawn.room.memory.spawning;
        if (spawnQueue && spawnQueue[TaskTypeString.Harvest].length > 0) {
            const spawnPlan = spawnQueue[TaskTypeString.Harvest][0];
            const result = SpawnUtils.SpawnCreep(spawnPlan, spawn);
            if (result === OK) {
                spawnQueue[TaskTypeString.Harvest].splice(0, 1);
            }
        }
    }
}
