import { Dictionary } from "lodash";
import { RoomPlaner } from "./RoomPlaner";
import { TaskChangeAction, TaskChangeFunc } from "./TypeDefs";

export class TaskFinder {
    // Key = provinceName;
    private static TaskChangeFuncs: Dictionary<TaskChangeAction[]> = {};

    public static AddTaskChangeListener(provinceName: string, obj: any, func: TaskChangeFunc) {
        if (TaskFinder.TaskChangeFuncs[provinceName] == null) {
            TaskFinder.TaskChangeFuncs[provinceName] = [];
        }
        TaskFinder.TaskChangeFuncs[provinceName].push({obj, func});
    }

    public static RemoveTaskChangeListener(provinceName: string, obj: any, func: TaskChangeFunc) {
        if (TaskFinder.TaskChangeFuncs[provinceName] != null) {
            const index = TaskFinder.TaskChangeFuncs[provinceName].indexOf({obj, func}, 0);
            if (index > -1) {
                TaskFinder.TaskChangeFuncs[provinceName].splice(index, 1);
            }
        }
    }

    public static InitNewRoom(roomName: string) {
        RoomPlaner.AddRoomPlanListener(roomName, this, this.OnRoomPlanChanged);
    }

    public static OnRoomPlanChanged(roomName: string) {
        console.log("OnRoomPlanChanged ", roomName);
        const room = Game.rooms[roomName];
        if (!room) {
            return;
        }
        const controller = room.controller;
        if (!controller) {
            return;
        }

        TaskFinder.CheckRoomTask(room.memory.provinceName, room, controller.level);
        const provinceTaskChangeFuncs = TaskFinder.TaskChangeFuncs[room.memory.provinceName];
        if (provinceTaskChangeFuncs) {
            for (const func of provinceTaskChangeFuncs) {
                func.func.call(func.obj, room.memory.provinceName);
            }
        }
    }

    public static CheckRoomTask(provinceName: string, room: Room, level: number) {
        console.log("CheckRoomTask");
        TaskFinder.CheckHarvestTask(provinceName, room);
    }

    public static CheckHarvestTask(provinceName: string, room: Room) {
        const sources = room.find(FIND_SOURCES);
        const province = Memory.provinces[provinceName];
        for (const source of sources) {
            if (province.taskIds[room.name] == null) {
                province.taskIds[room.name] = {};
            }
            const roomTasks = province.taskIds[room.name];
            if (roomTasks[source.id] == null) {
                roomTasks[source.id] = {};
            }

            const sourceTasks = roomTasks[source.id];
            const type: TaskType = "TASK_HARVEST";
            if (sourceTasks[type] == null) {
                console.log("NewHarvestTask");
                sourceTasks[type] = TaskFinder.NewHarvestTask(source, provinceName);
            }
        }
    }

    private static NewHarvestTask(source: Source, provinceName: string): string {
        const type: TaskType = "TASK_HARVEST";
        const id = source.id + type;
        const workSource = source.id;
        const capitalName = Memory.provinces[provinceName].capitalRoomName;
        const homePos = Game.rooms[capitalName].memory.origin1Pos;
        const workPos = source.pos;
        const pathLength = PathFinder.search(homePos, {pos: workPos, range: 1}, {plainCost: 1, swampCost: 1});
        const workPoint = source.energyCapacity / 300;
        const curPoint = 0;
        const planPoint = 0;

        if (Memory.tasks == null) {
            Memory.tasks = {};
        }
        Memory.tasks[id] = {id, type, workSource,
            // tslint:disable-next-line:object-literal-sort-keys
            homePos, workPos, pathLength: pathLength.path.length,
            targetWorkPoint: workPoint, planWorkPoint: planPoint, curWorkPoint: curPoint, workingCreepIds: []
        };

        return id;
    }
}
