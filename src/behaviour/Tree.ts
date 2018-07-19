import { Dictionary } from "lodash";
import TreeNode from "./Node";
import { Status } from "./Status";

// ...
export default abstract class Tree implements TreeNode {

    protected subTrees: Tree[];

    public state: Dictionary<Status>;

    constructor() {
        this.subTrees = [];
        this.state = {};
    }

    public abstract execute(name: string, id: string): Status;

    public addSubTree(...subtrees: Tree[]): Tree {
        this.subTrees.push(...subtrees);
        return this;
    }

    protected returnState(state: Status, id: string): Status {
        this.state[id] = state;
        return state;
    }

    protected returnStateBoolean(state: boolean, id: string): Status {
        const result = state ? Status.Succeed : Status.Failure;
        this.state[id] = result;
        return result;
    }

    public clearStates() {
        const newStates: Dictionary<Status> = {};
        for (const index in this.state) {
            if (this.state.hasOwnProperty(index) && this.state[index] === Status.Running) {
                newStates[index] = Status.Running;
            }
        }
        this.state = newStates;
    }
}
