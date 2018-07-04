import Status from "./../Status";
import Tree from "../Tree";
export class Repeat extends Tree {
    public tree: Tree;
    public num: number;
    public failStop: boolean;
    constructor(num: number, failStop: boolean, tree: Tree) {
        super();
        this.tree = tree;
        this.num = num;
        this.failStop = failStop;
    }
    public Execute(name: string, id: string): Status {
        for (let i = 0; i < this.num; i++) {
            const result = this.tree.Execute(name + "Repeat-", id);
            if (this.failStop && result === Status.Failure) {
                return this.ReturnState(Status.Failure, id);
            }
        }
        return this.ReturnState(Status.Succeed, id);
    }
}
