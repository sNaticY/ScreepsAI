
import Status from "./Status";
import Tree from "./Tree";
import { Dictionary } from "lodash";

export default class RunningParallel extends Tree {
    private succeed: number;
    private failure: number;
    private canbreak: boolean;
    private default: boolean;
    private succeedNum: Dictionary<number>;
    private failureNum: Dictionary<number>;

    constructor(succeed: number, failure: number, canbreak: boolean, defaultValue: boolean) {
        super();
        this.SubTrees = [];
        this.succeed = succeed;
        this.failure = failure;
        this.canbreak = canbreak;
        this.default = defaultValue;

        this.succeedNum = {};
        this.failureNum = {};
    }

    public Execute(name: string, id: string): Status {
        var hasRunning = false;
        for (var tree of this.SubTrees) {
            var result = tree.Execute(name + "parallel-", id)
            if (result == Status.Succeed) {
                this.succeedNum[id]++;
            }
            else if (result == Status.Failure) {
                this.failureNum[id]++;
            }
            else {
                hasRunning = true;
            }

            if (this.canbreak) {
                if (this.succeedNum[id] >= this.succeed) {
                    this.succeedNum[id] = 0;
                    this.failureNum[id] = 0;
                    return this.ReturnState(Status.Succeed, id)
                }
                if (this.failureNum[id] >= this.failure) {
                    this.succeedNum[id] = 0;
                    this.failureNum[id] = 0;
                    return this.ReturnState(Status.Failure, id);
                }
            }
        }
        if (hasRunning) {
            return this.ReturnState(Status.Running, id)
        }
        else {
            if (this.succeedNum[id] >= this.succeed) {
                this.succeedNum[id] = 0;
                this.failureNum[id] = 0;
                return this.ReturnState(Status.Succeed, id)
            }
            else if (this.failureNum[id] >= this.failure) {
                this.succeedNum[id] = 0;
                this.failureNum[id] = 0;
                return this.ReturnState(Status.Failure, id);
            }
            else {
                this.succeedNum[id] = 0;
                this.failureNum[id] = 0;
                return this.ReturnState(this.default, id);
            }
        }

    }
}