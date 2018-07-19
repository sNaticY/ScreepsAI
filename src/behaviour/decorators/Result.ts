import { Status } from "../Status";
import Tree from "../Tree";

export class Result extends Tree {
    public result: boolean;
    public tree: Tree | null;
    constructor(result: boolean, tree: Tree | null) {
        super();
        this.result = result;
        this.tree = tree;
    }
    public execute(name: string, id: string): Status {
        if (this.tree) {
            const res = this.tree.execute(name + "Result-", id);
            if (res === Status.Running) {
                return this.returnState(Status.Running, id);
            }
        }
        return this.result ? this.returnState(Status.Succeed, id) : this.returnState(Status.Failure, id);
    }
}
