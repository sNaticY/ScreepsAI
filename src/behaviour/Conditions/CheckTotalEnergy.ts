import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class CheckTotalEnergy extends Tree {

    public low: number;
    public high: number;

    constructor(low: number, high: number) {
        super();
        this.low = low;
        this.high = high;
    }
    public Execute(name: string, id: string): Status {
        let energyTotal = 0;
        energyTotal = Board.CurrentRoom.energyAvailable;
        if (energyTotal >= this.low && energyTotal < this.high) {
            return this.ReturnState(Status.Succeed, id);
        }
        return this.ReturnState(Status.Failure, id);
    }
}
