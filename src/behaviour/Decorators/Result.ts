import Status from "../Status";
import Tree from "../Tree";

export class Result extends Tree {
    public result: boolean;
    public tree: Tree | null;
    constructor(result: boolean, tree: Tree | null) {
        super();
        this.result = result;
        this.tree = tree;
    }
    public Execute(name: string, id: string): Status {
        if (this.tree) {
            const res = this.tree.Execute(name + "Result-", id);
            if (res === Status.Running) {
                return this.ReturnState(Status.Running, id);
            }
        }
        return this.result ? this.ReturnState(Status.Succeed, id) : this.ReturnState(Status.Failure, id);
    }
}
