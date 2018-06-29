
import Status from "./Status";
import Tree from "./Tree";

export default class Parallel extends Tree {
    private succeed: number;
    private failure: number;
    private default: boolean;
    
    constructor(succeed: number, failure: number, defalut: boolean) {
        super();
        this.SubTrees = [];
        this.succeed = succeed;
        this.failure = failure
        this.default = defalut;
    }
    
    public Execute(): Status {
        let s = 0;
        let f = 0;
        for (var tree of this.SubTrees) {
            if (tree.Execute() == Status.Succeed) {
                s++;
            }
            else {
                f++;
            }
            
            if (s > this.succeed) {
                return Status.Succeed;
            }
            if (f > this.failure) {
                return Status.Failure;
            }
        }
        return this.default ? Status.Succeed : Status.Failure;
    }
}