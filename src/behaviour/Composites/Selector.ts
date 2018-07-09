
import Status from "../Status";
import Tree from "../Tree";

export default class Selector extends Tree {
    public Execute(name: string, id: string): Status {
        let subTree: Tree;
        if (this.State[id] === Status.Running) {
            let runningProcessed = false;
            for (subTree of this.SubTrees) {
                if (runningProcessed) {
                    const result = subTree.Execute(name + "Selector-", id);
                    if (result === Status.Succeed || result === Status.Running) {
                        return this.ReturnState(result, id);
                    }
                } else {
                    if (subTree.State[id] === Status.Running) {
                        const result = subTree.Execute(name + "Selector-", id);
                        runningProcessed = true;
                        if (result === Status.Running || result === Status.Succeed) {
                            return this.ReturnState(result, id);
                        }
                    }
                }
            }
            return this.ReturnState(Status.Failure, id);
        } else {
            for (subTree of this.SubTrees) {
                const result = subTree.Execute(name + "Selector-", id);
                if (result === Status.Succeed || result === Status.Running) {
                    return this.ReturnState(result, id);
                }
            }
            return this.ReturnState(Status.Failure, id);
        }

    }
}
