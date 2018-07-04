import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class MoveAndWithdrawEnergyFromStorage extends Tree {
    public Execute(name: string, id: string): Status {
        const creep = Board.CurrentCreep;
        if (creep.carry.energy >= creep.carryCapacity) {
            return this.ReturnState(Status.Failure, id);
        }

        const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_STORAGE) &&
                    structure.store[RESOURCE_ENERGY] > 50;
            }
        });

        if (!target) {
            return this.ReturnState(Status.Failure, id);
        }

        const result = creep.withdraw(target, RESOURCE_ENERGY);
        if (result !== 0 && result !== ERR_NOT_IN_RANGE) {
            return this.ReturnState(Status.Failure, id);
        }

        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
            return this.ReturnState(Status.Running, id);
        }

        creep.say("🔄 Withdrawing");
        return this.ReturnState(Status.Succeed, id);
    }
}
