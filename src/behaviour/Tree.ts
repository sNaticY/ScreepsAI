import TreeNode from "./Node";
import Status from "./Status";
import { Dictionary } from "lodash";


// ...
export default abstract class Tree implements TreeNode {
    
    protected SubTrees: Array<Tree>;

    public State: Dictionary<Status>;

    constructor() {
        this.SubTrees = [];
        this.State = {};
    }

    abstract Execute(id: string) : Status;

    public AddSubTree(...subtrees:Tree[]) :Tree {
        this.SubTrees.push(...subtrees);
        return this;
    }

    protected ReturnState(state: Status, id:string) :Status {
        this.State[id] = state;
        return state;
    }

    public ClearStates() {
        var newStates: Dictionary<Status> = {};
        for (const index in this.State) {
            if (this.State.hasOwnProperty(index) && this.State[index] == Status.Running) {
                newStates[index] = Status.Running;
            }
        }
        this.State = newStates;
    }
}
	