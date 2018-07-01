
import Status from "./Status";
import Tree from "./Tree";

export default class Selector extends Tree {
    public Execute(id: string): Status {
        let subTree: Tree;
        if (this.State[id] == Status.Running) {
            var runningProcessed = false;
            for (subTree of this.SubTrees) {
                if (runningProcessed) {
                    var result = subTree.Execute(id);
                    if (result == Status.Succeed || result == Status.Running) {
                        return this.ReturnState(result, id);
                    }
                }
                else {
                    if (subTree.State[id] == Status.Running) {
                        var result = subTree.Execute(id);
                        runningProcessed = true;
                        if (result = Status.Running || result == Status.Succeed) {
                            return this.ReturnState(result, id);
                        }
                    }
                }
            }
            return this.ReturnState(Status.Failure, id);
        }
        else {
            for (subTree of this.SubTrees) {
                var result = subTree.Execute(id);
                if (result == Status.Succeed || result == Status.Running) {
                    return this.ReturnState(result, id);
                }
            }
            return this.ReturnState(Status.Failure, id);
        }

    }
}