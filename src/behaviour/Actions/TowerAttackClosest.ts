import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class TowerAttackClosest extends Tree {
    public Execute(name: string, id: string): Status {
        const tower = Board.CurrentTower;
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            const result = tower.attack(closestHostile);
            if (result === 0) {
                return this.ReturnState(Status.Succeed, id);
            }
        }
        return this.ReturnState(Status.Failure, id);
    }
}
