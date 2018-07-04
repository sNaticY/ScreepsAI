import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class MoveAndWithdrawNearestAllEnergy extends Tree {
    public Execute(name: string, id: string): Status {
        const creep = Board.CurrentCreep;
        if (creep.carry.energy >= creep.carryCapacity) {
            return this.ReturnState(Status.Failure, id);
        }

        const target = creep.pos.findClosestByPath<FIND_STRUCTURES>(FIND_STRUCTURES, {
            filter: (s) => {
                return ((s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN) &&
                    s.energy >= 50) ||
                    (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) &&
                    s.store.energy >= 50;
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

        return this.ReturnState(Status.Succeed, id);
    }
}
