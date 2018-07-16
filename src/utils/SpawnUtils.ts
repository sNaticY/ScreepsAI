import { CreepLibaray } from "screeps/CreepLibaray";

export class SpawnUtils {
    public static SpawnCreep(plan: SpawnPlan, spawn: StructureSpawn): ScreepsReturnCode {
        const prototype = CreepLibaray.Prototypes[plan.taskType][plan.level];
        const result = spawn.spawnCreep(prototype.body, prototype.role + Game.time, { memory: {
            level: prototype.level,
            role: prototype.role,
            taskId: plan.taskId,
            taskType: plan.taskType,
            workPoint: prototype.workPoint
        }});
        if (result === OK) {
            const task = Memory.tasks[plan.taskId];
            task.curWorkPoint += prototype.workPoint;
            task.planWorkPoint -= prototype.workPoint;
        }
        return result;
    }
}
