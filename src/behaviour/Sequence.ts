
import Status from "./Status";
import Tree from "./Tree";

export default class Sequence extends Tree{
    public Execute () : Status {
        let tree : Tree;
        for(tree of this.SubTrees){
            var result = tree.Execute();
            if(result == Status.Failure){
                return Status.Failure;
            }
        };
        return Status.Succeed;
    }
}