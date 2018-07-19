
import { Status } from "../Status";
import Tree from "../Tree";

export default class RunningSelector extends Tree {
    public execute(name: string, id: string): Status {
        let subTree: Tree;

        for (subTree of this.subTrees) {
            const result = subTree.execute(name + "Selector-", id);
            if (result === Status.Succeed || result === Status.Running) {
                return this.returnState(result, id);
            }
        }
        return this.returnState(Status.Failure, id);

    }
}
