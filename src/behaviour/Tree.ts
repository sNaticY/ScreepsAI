import { Dictionary } from "lodash";
import TreeNode from "./Node";
import Status from "./Status";

// ...
export default abstract class Tree implements TreeNode {

    protected SubTrees: Tree[];

    public State: Dictionary<Status>;

    constructor() {
        this.SubTrees = [];
        this.State = {};
    }

    public abstract Execute(name: string, id: string): Status;

    public AddSubTree(...subtrees: Tree[]): Tree {
        this.SubTrees.push(...subtrees);
        return this;
    }

    protected ReturnState(state: Status, id: string): Status {
        this.State[id] = state;
        return state;
    }

    protected ReturnStateBoolean(state: boolean, id: string): Status {
        const result = state ? Status.Succeed : Status.Failure;
        this.State[id] = result;
        return result;
    }

    public ClearStates() {
        const newStates: Dictionary<Status> = {};
        for (const index in this.State) {
            if (this.State.hasOwnProperty(index) && this.State[index] === Status.Running) {
                newStates[index] = Status.Running;
            }
        }
        this.State = newStates;
    }
}
