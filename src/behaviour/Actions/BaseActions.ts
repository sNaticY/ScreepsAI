import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";

export default class BaseActions {
    public static BuildCreep(role: string, name: string, level: number): Status {
        const newName = "LV" + level + "-" + name + "-" + Game.time;
        // console.log("Try Build Creep " + newName);
        const returnCode = BuildHelper.BuildCreep(role, level, Board.CurrentSpawn, newName);
        if (returnCode === 0) {
            return Status.Succeed;
        } else {
            // console.log("Try Build Creep " + newName + " Failed code = " + returnCode);
            return Status.Failure;
        }
    }

    public static GetCreepNumber(role: string, level: number): number {
        const creeps = _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.level === level);
        let deadNumber: number = 0;
        for (const creep of creeps) {
            if (creep.ticksToLive && creep.ticksToLive < 100) {
                deadNumber++;
            }
        }
        return creeps.length - deadNumber;
    }

    public static GetCreepNumberIgnoreLevel(role: string): number {
        const creeps = _.filter(Game.creeps, (creep) => creep.memory.role === role);
        let deadNumber: number = 0;
        for (const creep of creeps) {
            if (creep.ticksToLive && creep.ticksToLive < 100) {
                deadNumber++;
            }
        }
        return creeps.length - deadNumber;
    }

    public static RandomPosNearTarget(target: RoomPosition, room: Room): RoomPosition {
        while (true) {
            const offsetX = random(-3, 3);
            const offsetY = random(-3, 3);
            const roomPos = room.getPositionAt(target.x + offsetX, target.y + offsetY);
            if (roomPos && Game.map.getTerrainAt(roomPos.x, roomPos.y, room.name) !== "wall") {
                return roomPos;
            }
        }
    }

    public static IfCreepEnergyFull(creep: Creep): boolean {
        return creep.carry.energy === creep.carryCapacity;
    }

    public static IfCreepEnergyEmpty(creep: Creep): boolean {
        return creep.carry.energy === 0;
    }
}
