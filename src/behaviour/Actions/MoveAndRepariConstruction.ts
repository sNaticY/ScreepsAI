import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class MoveAndRepairConstruction extends Tree {
    public Execute(name: string, id: string): Status {
        const creep = Board.CurrentCreep;
        if (creep.carry.energy === 0) {
            // creep.say('🔄 harvest');
            return this.ReturnState(Status.Failure, id);
        }

        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (object) => object.hits < object.hitsMax
        });

        if (targets.length === 0) {
            return this.ReturnState(Status.Failure, id);
        }

        targets.sort((a, b) => a.hits - b.hits);
        const result = creep.repair(targets[0]);
        if (result !== 0 && result !== ERR_NOT_IN_RANGE) {
            return this.ReturnState(Status.Failure, id);
        }

        creep.moveTo(BaseActions.RandomPosNearTarget(targets[0].pos, creep.room));
        if (result === ERR_NOT_IN_RANGE) {
            return this.ReturnState(Status.Running, id);
        }
        creep.say("🔄 Repairing");
        return this.ReturnState(Status.Succeed, id);
    }
}
