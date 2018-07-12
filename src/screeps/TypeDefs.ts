export type PosFilter = (pos: RoomPosition) => boolean;
export type CubePosFilter = (pos: RoomPosition, i: number) => boolean;
export type RhumbusPosFilter = (pos: RoomPosition, i: number, j: number) => boolean;

export interface CreepPrototype {
    taskType: TaskType;
    econemyLevel: number;
    workPoint: number;
    body: BodyPartConstant[];
    memory: CreepMemory;
}
