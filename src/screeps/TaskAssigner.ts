export class TaskAssigner {
    public static Execute(provinceName: string) {
        const province = Memory.provinces[provinceName];
        for (const sourceId in province.taskIds) {
            if (province.taskIds.hasOwnProperty(sourceId)) {
                const sourceTasks = province.taskIds[sourceId];
                for (const taskType in sourceTasks) {
                    if (sourceTasks.hasOwnProperty(taskType)) {
                        const taskId = sourceTasks[taskType];
                        TaskAssigner.AssignIdleCreepTask(taskId, sourceId, taskType);
                        TaskAssigner.AssignSpawnTask(province.capitalRoomName, taskId, sourceId, taskType);
                    }
                }
            }
        }
    }

    public static AssignIdleCreepTask(taskId: string, sourceId: string, taskType: string) {
        const task = Memory.tasks[taskId];
        while (true) {
            if (task.CurWorkPoint >= task.TargetWorkPoint) {
                return;
            }
            const idleCreeps: Creep[] = [];
            const workRoom = Game.rooms[task.WorkPos.roomName];
            if (workRoom) {
                const creeps = workRoom.find(FIND_MY_CREEPS, { filter: (s) => {
                    return s.memory.taskId == null || s.memory.taskId === "";
                }});
                idleCreeps.push(...creeps);
            }
            const homeRoom = Game.rooms[task.HomePos.roomName];
            if (homeRoom) {
                const creeps = homeRoom.find(FIND_MY_CREEPS, { filter: (s) => {
                    return s.memory.taskId == null || s.memory.taskId === "";
                }});
                idleCreeps.push(...creeps);
            }

            for (const idleCreep of idleCreeps) {
                // TODO: Assign idle creeps a task;
            }
        }

    }

    public static AssignSpawnTask(capitaolRoomId: string, taskId: string, sourceId: string, taskType: string) {
        const task = Memory.tasks[taskId];
        if (task.CurWorkPoint >= task.TargetWorkPoint) {
            return;
        }
        const room = Game.rooms[capitaolRoomId];
        if (task && task.CurWorkPoint < task.TargetWorkPoint) {
            // room.memory.spawning[]
            const idleSpawns = room.find(FIND_MY_SPAWNS, { filter: (s) => {
                return s.spawning == null;
            }});
            for (const idleSpawn of idleSpawns) {
                // TODO: Spawn create a creep and assign taskid
            }
        }
    }
}
