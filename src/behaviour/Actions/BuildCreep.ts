import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class BuildCreep extends Tree {
    public role: string;
    public name: string;
    public level: number;
    constructor(role: string, name: string, level: number) {
        super();
        this.role = role;
        this.name = name;
        this.level = level;
    }
    public Execute(name: string, id: string): Status {
        const result = BaseActions.BuildCreep(this.role, this.name, this.level);
        // console.log("Try build", this.role, "\t[level", this.level, "]" , result);
        return this.ReturnState(result, id);
    }
}
