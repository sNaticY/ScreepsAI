import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class MoveAndUpgradeController extends Tree {
    public Execute(name: string, id: string): Status {
        const creep = Board.CurrentCreep;
        if (creep.carry.energy === 0) {
            // creep.say('🔄 harvest');
            return this.ReturnState(Status.Failure, id);
        }

        if (!creep.room.controller) {
            return this.ReturnState(Status.Failure, id);
        }
        const result = creep.upgradeController(creep.room.controller);
        if (result !== 0 && result !== ERR_NOT_IN_RANGE) {
            return this.ReturnState(Status.Failure, id);
        }

        creep.moveTo(BaseActions.RandomPosNearTarget(creep.room.controller.pos, creep.room),
            { visualizePathStyle: { stroke: "#ffffff" } }
        );
        if (result === ERR_NOT_IN_RANGE) {
            return this.ReturnState(Status.Running, id);
        }

        return this.ReturnState(Status.Succeed, id);
    }
}
