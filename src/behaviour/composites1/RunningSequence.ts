
import { Status } from "../Status";
import Tree from "../Tree";

export default class RunningSequence extends Tree {
    public execute(name: string, id: string): Status {
        let tree: Tree;

        for (tree of this.subTrees) {
            const result = tree.execute(name + "Sequence-", id);
            if (result === Status.Failure || result === Status.Running) {
                return this.returnState(result, id);
            }
        }
        return this.returnState(Status.Succeed, id);

    }
}
