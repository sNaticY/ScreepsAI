import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class CheckNeedBuild extends Tree {
    public ifNeed: boolean;

    constructor(ifNeed: boolean) {
        super();
        this.ifNeed = ifNeed;
    }

    public Execute(name: string, id: string): Status {
        const needBuildStructures = Board.CurrentRoom.find(FIND_CONSTRUCTION_SITES);
        const result = needBuildStructures.length > 0;
        return this.ifNeed ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id);
    }
}
