import Status from "./../Status";
import Tree from "../Tree";
export class Convert extends Tree {
    public tree: Tree;
    public equal: boolean;
    public fromState: Status;
    public targetState: Status;
    constructor(equal: boolean, fromState: Status, targetState: Status, tree: Tree) {
        super();
        this.tree = tree;
        this.equal = equal;
        this.fromState = fromState;
        this.targetState = targetState;
    }
    public Execute(name: string, id: string): Status {
        const result = this.tree.Execute(name + "Convert-", id);
        if (this.equal) {
            if (result === this.fromState) {
                return this.ReturnState(this.targetState, id);
            }
        } else {
            if (result !== this.fromState) {
                return this.ReturnState(this.targetState, id);
            }
        }
        return this.ReturnState(result, id);
    }
}
