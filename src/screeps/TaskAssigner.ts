import { CreepLibaray } from "./CreepLibaray";
import { TaskFinder } from "./TaskFinder";

export class TaskAssigner {
    public static InitNewProvince(provinceName: string) {
        TaskFinder.AddTaskChangeListener(provinceName, this, this.OnTaskChanged);
    }

    public static OnTaskChanged(provinceName: string) {
        const province = Memory.provinces[provinceName];
        for (const roomId in province.taskIds) {
            if (province.taskIds.hasOwnProperty(roomId)) {
                const roomTasks = province.taskIds[roomId];
                for (const sourceId in roomTasks) {
                    if (roomTasks.hasOwnProperty(sourceId)) {
                        const sourceTasks = roomTasks[sourceId];
                        for (const taskType in sourceTasks) {
                            if (sourceTasks.hasOwnProperty(taskType)) {
                                const taskId = sourceTasks[taskType];
                                const type = taskType as TaskType;
                                TaskAssigner.AssignIdleCreepTask(taskId, sourceId, type);
                                TaskAssigner.AssignSpawnTask(province.capitalRoomName, taskId, sourceId, type);
                            }
                        }
                    }
                }
            }
        }
    }

    public static AssignIdleCreepTask(taskId: string, sourceId: string, taskType: TaskType) {
        const task = Memory.tasks[taskId];
        const idleCreeps: Creep[] = [];
        const workRoom = Game.rooms[task.workPos.roomName];

        if (task.curWorkPoint + task.planWorkPoint >= task.targetWorkPoint) {
            return;
        }

        if (workRoom) {
            const creeps = workRoom.find(FIND_MY_CREEPS, { filter: (s) => {
                return s.memory.taskId == null || s.memory.taskId === "";
            }});
            idleCreeps.push(...creeps);
        }
        const homeRoom = Game.rooms[task.homePos.roomName];
        if (homeRoom) {
            const creeps = homeRoom.find(FIND_MY_CREEPS, { filter: (s) => {
                return s.memory.taskId == null || s.memory.taskId === "";
            }});
            idleCreeps.push(...creeps);
        }

        for (const idleCreep of idleCreeps) {
            if (task.curWorkPoint + task.planWorkPoint >= task.targetWorkPoint) {
                return;
            }

            // TODO: Assign idle creeps a task;
            if (idleCreep.memory.taskType === task.type) {
                idleCreep.memory.taskId = task.id;
                task.curWorkPoint += idleCreep.memory.workPoint;
            }
        }
    }

    public static AssignSpawnTask(capitaolRoomId: string, taskId: string, sourceId: string, taskType: TaskType) {
        const task = Memory.tasks[taskId];
        for (let i = 0; i < 5; i++) {
            if (task.curWorkPoint + task.planWorkPoint >= task.targetWorkPoint) {
                return;
            }
            const room = Game.rooms[capitaolRoomId];
            // room.memory.spawning[]
            if (room.memory.spawning[taskType] == null) {
                room.memory.spawning[taskType] = [];
            }
            const level = room.memory.econemyLevel;
            console.log("EconomyLevel = ", level);
            console.log("WorkPoint = ", CreepLibaray.Prototypes[taskType][level].workPoint);
            room.memory.spawning[taskType].push({taskType, level, taskId});
            task.planWorkPoint += CreepLibaray.Prototypes[taskType][level].workPoint;

        }
    }
}
