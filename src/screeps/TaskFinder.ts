export class TaskFinder {
    public static Execute(provinceName: string) {
        const province = Memory.provinces[provinceName];
        if (province == null) {return; }
        const roomNames = province.roomNames;
        for (const roomName of roomNames) {
            const room = Game.rooms[roomName];
            if (room && room.memory.roomPlanDirty) {
                const controller = room.controller;
                if (controller) {
                    TaskFinder.CheckRoomTask(provinceName, room, controller.level);
                }

                room.memory.roomPlanDirty = false;
                room.memory.roomTaskDirty = true;
            }
        }
    }

    public static CheckRoomTask(provinceName: string, room: Room, level: number) {
        TaskFinder.CheckHarvestTask(provinceName, room);
    }

    public static CheckHarvestTask(provinceName: string, room: Room) {
        const sources = room.find(FIND_SOURCES);
        const province = Memory.provinces[provinceName];
        for (const source of sources) {
            if (province.taskIds[source.id] == null) {
                province.taskIds[source.id] = {};
            }

            const sourceTasks = province.taskIds[source.id];
            const type: TaskType = "TASK_HARVEST";
            if (sourceTasks[type] == null) {
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

        if (Memory.tasks == null) {
            Memory.tasks = {};
        }
        Memory.tasks[id] = {Id: id, Type: type, WorkSource: workSource,
            // tslint:disable-next-line:object-literal-sort-keys
            HomePos: homePos, WorkPos: workPos, PathLength: pathLength.path.length,
            TargetWorkPoint: workPoint, CurWorkPoint: curPoint
        };

        return id;
    }
}
