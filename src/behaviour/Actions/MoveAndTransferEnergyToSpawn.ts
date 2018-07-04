import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class MoveAndTransferEnergyToSpawn extends Tree {
    public Execute(name: string, id: string): Status {
        const creep = Board.CurrentCreep;

        // if creep dont have energy
        if (creep.carry.energy === 0) {
            return this.ReturnState(Status.Failure, id);
        }

        const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_SPAWN &&
                    structure.energy < structure.energyCapacity);
            }
        });

        // if can not find target
        if (!target) {
            // console.log("MoveAndTransferBackToSpawnAndExtension Failed, Didn't find target to transfer")
            return this.ReturnState(Status.Failure, id);
        }

        const result = creep.transfer(target, RESOURCE_ENERGY);

        // if result has problem
        if (result !== 0 && result !== ERR_NOT_IN_RANGE) {
            return this.ReturnState(Status.Failure, id);
        }

        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
            return this.ReturnState(Status.Running, id);
        }

        creep.say("🔄 Transfering");
        return this.ReturnState(Status.Succeed, id);
    }
}
