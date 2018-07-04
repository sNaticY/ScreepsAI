import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class CheckUseableEnergy extends Tree {
    public ifEqual: boolean;

    constructor(ifEqual: boolean) {
        super();
        this.ifEqual = ifEqual;
    }
    public Execute(name: string, id: string): Status {
        const result = Board.CurrentRoom.energyAvailable === Board.CurrentRoom.energyCapacityAvailable;
        return this.ifEqual ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id);
    }
}
