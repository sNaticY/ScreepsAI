import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class CheckCondition extends Tree {
    public condition: Condition;
    public ifMatch: boolean;
    constructor(ifMatch: boolean, condition: Condition) {
        super();
        this.condition = condition;
        this.ifMatch = ifMatch;
    }
    public Execute(name: string, id: string): Status {
        const result = this.condition();
        return this.ifMatch ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id);
    }
}
