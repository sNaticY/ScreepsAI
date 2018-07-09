import Status from "../Status";
import Tree from "../Tree";
export class NotNode extends Tree {
    public tree: Tree;
    constructor(tree: Tree) {
        super();
        this.tree = tree;
    }
    public Execute(name: string, id: string): Status {
        const result = this.tree.Execute(name + "NotNode-", id);
        switch (result) {
            case Status.Succeed:
                return this.ReturnState(Status.Failure, id);
            case Status.Failure:
                return this.ReturnState(Status.Succeed, id);
            default:
                return this.ReturnState(Status.Running, id);
        }
    }
}
