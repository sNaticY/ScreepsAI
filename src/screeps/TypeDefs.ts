export type PosFilter = (pos: RoomPosition) => boolean;
export type CubePosFilter = (pos: RoomPosition, i: number) => boolean;
export type RhumbusPosFilter = (pos: RoomPosition, i: number, j: number) => boolean;

export type RoomPlanFunc = (roomName: string) => void;
export type TaskChangeFunc = (provinceName: string) => void;

export interface RoomPlanAction {
    obj: any;
    func: RoomPlanFunc;
}

export interface TaskChangeAction {
    obj: any;
    func: TaskChangeFunc;
}

export interface CreepPrototype {
    taskType: TaskType;
    econemyLevel: number;
    workPoint: number;
    body: BodyPartConstant[];
    role: RoleType;
    level: number;
}

export class TaskTypeString {
    public static Harvest: TASK_HARVEST = "TASK_HARVEST";
    public static Carry: TASK_CARRY = "TASK_CARRY";
    public static Upgrade: TASK_UPGRADE = "TASK_UPGRADE";
    public static Build: TASK_BUILD = "TASK_BUILD";
    public static Reserve: TASK_RESERVE = "TASK_RESERVE";
    public static Claim: TASK_CLAIM = "TASK_CLAIM";
}

// tslint:disable-next-line:max-classes-per-file
export class RoleTypeString {
    public static Harvester: ROLE_HARVESTER = "ROLE_HARVESTER";
    public static Carrier: ROLE_CARRIER = "ROLE_CARRIER";
    public static Builder: ROLE_BUILDER = "ROLE_BUILDER";
    public static Upgrader: ROLE_UPGRADER = "ROLE_UPGRADER";
}

// tslint:disable-next-line:max-classes-per-file
export class RoomPlanString {
    public static Major: ROOMPLAN_MAJOR = "ROOMPLAN_MAJOR";
    public static Minor: ROOMPLAN_MINOR = "ROOMPLAN_MINOR";
    public static Junior: ROOMPLAN_JUNIOR = "ROOMPLAN_JUNIOR";
    public static Unmanaged: ROOMPLAN_UNMANAGED = "ROOMPLAN_UNMANAGED";
}

// tslint:disable-next-line:max-classes-per-file
export class RoomStateString {
    public static Core: ROOMSTATE_CORE = "ROOMSTATE_CORE";
}
