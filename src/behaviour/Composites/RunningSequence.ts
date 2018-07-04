
import Status from "./../Status";
import Tree from "../Tree";

export default class RunningSequence extends Tree {
    public Execute(name: string, id: string): Status {
        let tree: Tree;

        for (tree of this.SubTrees) {
            const result = tree.Execute(name + "Sequence-", id);
            if (result === Status.Failure || result === Status.Running) {
                return this.ReturnState(result, id);
            }
        }
        return this.ReturnState(Status.Succeed, id);

    }
}
