
import Status from "./Status";
import Tree from "./Tree";

export default class Parallel extends Tree {
    private succeed: number;
    private failure: number;

    constructor(succeed: number, failure: number) {
        super();
        this.SubTrees = [];
        this.succeed = succeed;
        this.failure = failure
    }

    public Execute(): Status {
        let s = 0;
        let f = 0;
        for(var tree of this.SubTrees){
            if (tree.Execute() == Status.Succeed) {
                s++;
            }
            else{
                f++;
            }

            if(s > this.succeed)
            {
                return Status.Succeed;
            }
            if(f > this.failure)
            {
                return Status.Failure;
            }
        }
        return Status.Failure;
    }
}