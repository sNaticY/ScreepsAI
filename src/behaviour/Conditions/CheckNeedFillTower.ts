import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class CheckNeedFillTower extends Tree {
    public ifNeed: boolean;

    constructor(ifNeed: boolean) {
        super();
        this.ifNeed = ifNeed;
    }

    public Execute(name: string, id: string): Status {
        const needFilledTowers = Board.CurrentRoom.find<StructureTower>(FIND_STRUCTURES, {
            filter: (s) => {
                return s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity - 50;
            }
        });
        const result = needFilledTowers.length > 0;
        return this.ifNeed ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id);
    }
}
