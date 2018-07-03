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

    abstract Execute(name:string, id: string): Status;

    public AddSubTree(...subtrees: Tree[]): Tree {
        this.SubTrees.push(...subtrees);
        return this;
    }

    protected ReturnState(state: Status, id: string): Status {
        if(id == "5b3aaf785c2b1a6b84a93c0a") {
            console.log("Set Return State", state)
        }
        this.State[id] = state;
        return state;
    }

    protected ReturnStateBoolean(state: Boolean, id: string): Status {
        var result = state ? Status.Succeed : Status.Failure;
        this.State[id] = result;
        return result;
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
