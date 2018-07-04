import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class CheckCreepNum extends Tree {
    public role: string;
    public level: number | undefined;
    public isTrue: boolean;

    constructor(role: string, isTrueWhenEqual: boolean, level: number | undefined) {
        super();
        this.role = role;
        if (level) {
            this.level = level;
        }
        this.isTrue = isTrueWhenEqual;
    }
    public Execute(name: string, id: string): Status {
        let targetNumber: number = 0;
        let creepsNumber: number = 0;
        if (this.level) {
            creepsNumber = BaseActions.GetCreepNumber(this.role, this.level);
            targetNumber = Board.CreepNumber[this.role][this.level];
        } else {
            creepsNumber = BaseActions.GetCreepNumberIgnoreLevel(this.role);
            targetNumber = Board.CreepNumber[this.role][0];
        }
        // console.log("Need Role", this.role, "\t[ level", this.level, "]", targetNumber, "\thave", creepsNumber)
        if (creepsNumber < targetNumber) {
            return this.isTrue ? this.ReturnState(Status.Failure, id) : this.ReturnState(Status.Succeed, id);
        }
        return this.isTrue ? this.ReturnState(Status.Succeed, id) : this.ReturnState(Status.Failure, id);
    }
}
