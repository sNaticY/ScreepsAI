import { Dictionary } from "lodash";
import { Status } from "../Status";
import Tree from "../Tree";

export default class RunningParallel extends Tree {
    private succeed: number;
    private failure: number;
    private canbreak: boolean;
    private default: boolean;
    private succeedNum: Dictionary<number>;
    private failureNum: Dictionary<number>;

    constructor(succeed: number, failure: number, canbreak: boolean, defaultValue: boolean) {
        super();
        this.subTrees = [];
        this.succeed = succeed;
        this.failure = failure;
        this.canbreak = canbreak;
        this.default = defaultValue;

        this.succeedNum = {};
        this.failureNum = {};
    }

    public execute(name: string, id: string): Status {
        let hasRunning = false;
        for (const tree of this.subTrees) {
            const result = tree.execute(name + "parallel-", id);
            if (result === Status.Succeed) {
                this.succeedNum[id]++;
            } else if (result === Status.Failure) {
                this.failureNum[id]++;
            } else {
                hasRunning = true;
            }

            if (this.canbreak) {
                if (this.succeedNum[id] >= this.succeed) {
                    this.succeedNum[id] = 0;
                    this.failureNum[id] = 0;
                    return this.returnState(Status.Succeed, id);
                }
                if (this.failureNum[id] >= this.failure) {
                    this.succeedNum[id] = 0;
                    this.failureNum[id] = 0;
                    return this.returnState(Status.Failure, id);
                }
            }
        }
        if (hasRunning) {
            return this.returnState(Status.Running, id);
        } else {
            if (this.succeedNum[id] >= this.succeed) {
                this.succeedNum[id] = 0;
                this.failureNum[id] = 0;
                return this.returnState(Status.Succeed, id);
            } else if (this.failureNum[id] >= this.failure) {
                this.succeedNum[id] = 0;
                this.failureNum[id] = 0;
                return this.returnState(Status.Failure, id);
            } else {
                this.succeedNum[id] = 0;
                this.failureNum[id] = 0;
                return this.returnStateBoolean(this.default, id);
            }
        }
    }
}
