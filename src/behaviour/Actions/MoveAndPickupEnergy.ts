import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

// Going Pickup returns running, finish returns true, other issue returns false
export class MoveAndPickupEnergy extends Tree {
    public Execute(name: string, id: string): Status {
        const creep = Board.CurrentCreep;
        if (creep.carry.energy >= creep.carryCapacity) {
            return this.ReturnState(Status.Failure, id);
        }

        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (resource) => {
                return resource.resourceType === RESOURCE_ENERGY && resource.amount >= creep.carryCapacity;
            }
        });

        if (!target) {
            return this.ReturnState(Status.Failure, id);
        }

        const result = creep.pickup(target);
        if (result !== 0 && result !== ERR_NOT_IN_RANGE) {
            return this.ReturnState(Status.Failure, id);
        }

        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            return this.ReturnState(Status.Running, id);
        }

        creep.say("🔄 Picking up");
        // console.log("MoveAndPickupEnergy Failed", result)
        return this.ReturnState(Status.Succeed, id);
    }
}
