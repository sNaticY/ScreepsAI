import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class MoveAndBuildExtension extends Tree {
    public Execute(name: string, id: string): Status {
        const creep = Board.CurrentCreep;
        if (creep.carry.energy === 0) {
            // creep.say('🔄 harvest');
            return this.ReturnState(Status.Failure, id);
        }

        const target = creep.pos.findClosestByRange<FIND_CONSTRUCTION_SITES>(FIND_CONSTRUCTION_SITES,
            { filter: (s) => s.structureType === STRUCTURE_EXTENSION }
        );
        if (!target) {
            return this.ReturnState(Status.Failure, id);
        }

        const result = creep.build(target);
        if (result !== 0 && result !== ERR_NOT_IN_RANGE) {
            return this.ReturnState(Status.Failure, id);
        }

        creep.moveTo(BaseActions.RandomPosNearTarget(target.pos, creep.room),
            { visualizePathStyle: { stroke: "#ffffff" } }
        );
        if (result === ERR_NOT_IN_RANGE) {
            return this.ReturnState(Status.Running, id);
        }

        return this.ReturnState(Status.Succeed, id);
    }
}
