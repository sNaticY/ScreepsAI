
import Status from "./Status";
import Tree from "./Tree";

export default class Sequence extends Tree {
    public Execute(id: string): Status {
        let tree: Tree;
        if (this.State[id] == Status.Running) {
            var runningProcessed = false;
            for (tree of this.SubTrees) {
                if (runningProcessed) {
                    var result = tree.Execute(id);
                    if (result == Status.Running || result == Status.Failure) {
                        return this.ReturnState(result, id);
                    }
                }
                else{
                    if (tree.State[id] == Status.Running) {
                        var result = tree.Execute(id);
                        runningProcessed = true;
                        if (result == Status.Running || result == Status.Failure) {
                            return this.ReturnState(result, id);
                        }
                    }
                }
            }
            return this.ReturnState(Status.Succeed, id);
        }
        else {
            for (tree of this.SubTrees) {
                var result = tree.Execute(id);
                if (result == Status.Failure || result == Status.Running) {
                    return this.ReturnState(result, id);
                }
            };
            return this.ReturnState(Status.Succeed, id);
        }
    }
}