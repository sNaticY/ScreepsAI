
import Status from "./Status";
import Tree from "./Tree";
import { Dictionary } from "lodash";

export default class Parallel extends Tree {
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
        if(id == "5b3aaf785c2b1a6b84a93c0a"){
			console.log(name + "Parallel")
		}
        if (this.State[id] == Status.Running) {
            var hasRunning = false;
            for (var tree of this.SubTrees) {
                if (tree.State[id] == Status.Running) {
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
                            return this.ReturnState(Status.Succeed, id)
                        }
                        if (this.failureNum[id] >= this.failure) {
                            return this.ReturnState(Status.Failure, id);
                        }
                    }
                }
            }
            if (hasRunning) {
                return this.ReturnState(Status.Running, id)
            }
            else {
                if (this.succeedNum[id] >= this.succeed) {
                    return this.ReturnState(Status.Succeed, id)
                }
                else if (this.failureNum[id] >= this.failure) {
                    return this.ReturnState(Status.Failure, id);
                }
                else {
                    return this.ReturnState(this.default, id);
                }
            }
        }
        else {
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
                        return this.ReturnState(Status.Succeed, id)
                    }
                    if (this.failureNum[id] >= this.failure) {
                        return this.ReturnState(Status.Failure, id);
                    }
                }
            }
            if (hasRunning) {
                return this.ReturnState(Status.Running, id)
            }
            else {
                if (this.succeedNum[id] >= this.succeed) {
                    return this.ReturnState(Status.Succeed, id)
                }
                else if (this.failureNum[id] >= this.failure) {
                    return this.ReturnState(Status.Failure, id);
                }
                else {
                    return this.ReturnState(this.default, id);
                }
            }
        }
    }
}