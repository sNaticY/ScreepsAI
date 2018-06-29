import TreeNode from "./Node";
import Status from "./Status";


// ...
export default abstract class Tree implements TreeNode {
    
    SubTrees: Array<Tree>;

    constructor() {
        this.SubTrees = [];
    }

    abstract Execute() : Status;

    public AddSubTree(...subtrees:Tree[]) :Tree {
        this.SubTrees.push(...subtrees);
        return this;
    }
}
	