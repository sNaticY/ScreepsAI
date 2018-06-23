
import Status from "./Status";
import Tree from "./Tree";

export default class Selector extends Tree{
    public Execute () : Status {
        let tree : Tree;
        for(tree of this.SubTrees){
            if(tree.Execute() == Status.Succeed){
                return Status.Succeed;
            }
        }
        return Status.Failure;
    }
}