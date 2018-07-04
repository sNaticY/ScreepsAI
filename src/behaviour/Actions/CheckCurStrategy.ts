import Board, { Strategy } from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class CheckCurStrategy extends Tree {
    public targetStrategys: Strategy[];
    public ifMatch: boolean;
    constructor(ifMatch: boolean, ...target: Strategy[]) {
        super();
        this.targetStrategys = target;
        this.ifMatch = ifMatch;
    }
    public Execute(name: string, id: string): Status {
        let match = false;
        for (const str of this.targetStrategys) {
            if (str === Board.Strategy) {
                match = true;
                break;
            }
        }
        if (this.ifMatch) {
            return match ? this.ReturnState(Status.Succeed, id) : this.ReturnState(Status.Failure, id);
        } else {
            return match ? this.ReturnState(Status.Failure, id) : this.ReturnState(Status.Succeed, id);
        }
    }
}
