import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class CheckNeedRepair extends Tree {
    public ifNeed: boolean;

    constructor(ifNeed: boolean) {
        super();
        this.ifNeed = ifNeed;
    }

    public Execute(name: string, id: string): Status {
        const needRepairStructures = Board.CurrentRoom.find(FIND_STRUCTURES, {
            filter: (s) => {
                return s.hits < s.hitsMax - 300;
            }
        });
        const result = needRepairStructures.length > 0;
        return this.ifNeed ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id);
    }
}
