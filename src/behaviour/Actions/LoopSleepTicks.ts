import Status from "../Status";
import Tree from "../Tree";

export class LoopSleepTicks extends Tree {
    public tick: number = 0;
    public maxTick: number;
    public afterResult: boolean;

    constructor(tick: number, afterResult: boolean) {
        super();
        this.tick = tick;
        this.maxTick = tick;
        this.afterResult = afterResult;
    }

    public Execute(name: string, id: string) {
        this.tick++;
        if (this.tick >= this.maxTick) {
            this.tick = 0;
            return this.afterResult ? this.ReturnState(Status.Succeed, id) : this.ReturnState(Status.Failure, id);
        } else {
            return this.afterResult ? this.ReturnState(Status.Failure, id) : this.ReturnState(Status.Succeed, id);
        }
    }
}
