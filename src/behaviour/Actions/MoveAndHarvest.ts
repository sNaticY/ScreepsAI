import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class MoveAndHarvest extends Tree {
    public Execute(name: string, id: string): Status {
        const creep = Board.CurrentCreep;

        // if creep energy is full
        if ((creep.memory.role !== "HARVESTER" && creep.carry.energy >= creep.carryCapacity)) {
            return this.ReturnState(Status.Failure, id);
        }

        const targets = creep.room.find(FIND_SOURCES);

        // if can not find energy
        if (targets.length === 0) {
            return this.ReturnState(Status.Failure, id);
        }

        const target = targets[1];
        const result = creep.harvest(target);

        // if not succeess and not because range
        if (result !== 0 && result !== ERR_NOT_IN_RANGE) {
            return this.ReturnState(Status.Failure, id);
        }

        // move harvester near target or container
        if (creep.memory.role === "HARVESTER") {
            const container = target.pos.findInRange<Structure>(FIND_STRUCTURES, 1,
                { filter: (s) => s.structureType === STRUCTURE_CONTAINER }
            );
            if (container.length > 0) {
                creep.moveTo(container[0].pos, { visualizePathStyle: { stroke: "#ffaa00" } });
            } else {
                creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
            }
        } else {
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
            }
        }

        if (result === ERR_NOT_IN_RANGE) {
            return this.ReturnState(Status.Running, id);
        }

        creep.say("🔄 Harvesting");
        return this.ReturnState(Status.Succeed, id);
    }
}
