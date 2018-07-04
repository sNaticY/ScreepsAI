
import Status from "./../Status";
import Tree from "../Tree";

export default class Sequence extends Tree {
    public Execute(name: string, id: string): Status {
        let tree: Tree;
        if (this.State[id] === Status.Running) {
            let runningProcessed = false;
            for (tree of this.SubTrees) {
                if (runningProcessed) {
                    const result = tree.Execute(name + "Sequence-", id);
                    if (result === Status.Running || result === Status.Failure) {
                        return this.ReturnState(result, id);
                    }
                } else {
                    if (tree.State[id] === Status.Running) {
                        const result = tree.Execute(name + "Sequence-", id);
                        runningProcessed = true;
                        if (result === Status.Running || result === Status.Failure) {
                            return this.ReturnState(result, id);
                        }
                    }
                }
            }
            return this.ReturnState(Status.Succeed, id);
        } else {
            for (tree of this.SubTrees) {
                const result = tree.Execute(name + "Sequence-", id);
                if (result === Status.Failure || result === Status.Running) {
                    return this.ReturnState(result, id);
                }
            }
            return this.ReturnState(Status.Succeed, id);
        }
    }
}
