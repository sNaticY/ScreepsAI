import { Status } from "../Status";
import Tree from "../Tree";
export class NotNode extends Tree {
    public tree: Tree;
    constructor(tree: Tree) {
        super();
        this.tree = tree;
    }
    public execute(name: string, id: string): Status {
        const result = this.tree.execute(name + "NotNode-", id);
        switch (result) {
            case Status.Succeed:
                return this.returnState(Status.Failure, id);
            case Status.Failure:
                return this.returnState(Status.Succeed, id);
            default:
                return this.returnState(Status.Running, id);
        }
    }
}
