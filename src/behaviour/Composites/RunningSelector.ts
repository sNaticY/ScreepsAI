
import Status from "./../Status";
import Tree from "../Tree";

export default class RunningSelector extends Tree {
    public Execute(name: string, id: string): Status {
        let subTree: Tree;

        for (subTree of this.SubTrees) {
            const result = subTree.Execute(name + "Selector-", id);
            if (result === Status.Succeed || result === Status.Running) {
                return this.ReturnState(result, id);
            }
        }
        return this.ReturnState(Status.Failure, id);

    }
}
