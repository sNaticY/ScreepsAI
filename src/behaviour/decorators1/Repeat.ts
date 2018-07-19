import { Status } from "../Status";
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
    public execute(name: string, id: string): Status {
        for (let i = 0; i < this.num; i++) {
            const result = this.tree.execute(name + "Repeat-", id);
            if (this.failStop && result === Status.Failure) {
                return this.returnState(Status.Failure, id);
            }
        }
        return this.returnState(Status.Succeed, id);
    }
}
