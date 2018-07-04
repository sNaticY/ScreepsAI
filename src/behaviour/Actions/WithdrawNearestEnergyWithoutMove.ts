import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class WithdrawNearestEnergWithoutMove extends Tree {
    public Execute(name: string, id: string): Status {
        const creep = Board.CurrentCreep;
        if (creep.carry.energy >= creep.carryCapacity) {
            return this.ReturnState(Status.Failure, id);
        }
        const target = creep.pos.findClosestByRange<FIND_STRUCTURES>(FIND_STRUCTURES, {
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
        if (result !== 0) {
            return this.ReturnState(Status.Failure, id);
        }

        return this.ReturnState(Status.Succeed, id);
    }
}
