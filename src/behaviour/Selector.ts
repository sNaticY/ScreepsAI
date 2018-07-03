
import Status from "./Status";
import Tree from "./Tree";

export default class Selector extends Tree {
    public Execute(name: string, id: string): Status {
        if(id == "5b3aaf785c2b1a6b84a93c0a"){
			console.log(name + "Selector")
		}
        let subTree: Tree;
        if (this.State[id] == Status.Running) {
            var runningProcessed = false;
            for (subTree of this.SubTrees) {
                if (runningProcessed) {
                    var result = subTree.Execute(name + "Selector-", id);
                    if (result == Status.Succeed || result == Status.Running) {
                        return this.ReturnState(result, id);
                    }
                }
                else {
                    if (subTree.State[id] == Status.Running) {
                        var result = subTree.Execute(name + "Selector-", id);
                        runningProcessed = true;
                        if (result == Status.Running || result == Status.Succeed) {
                            return this.ReturnState(result, id);
                        }
                    }
                }
            }
            return this.ReturnState(Status.Failure, id);
        }
        else {
            for (subTree of this.SubTrees) {
                var result = subTree.Execute(name + "Selector-", id);
                if (result == Status.Succeed || result == Status.Running) {
                    return this.ReturnState(result, id);
                }
            }
            return this.ReturnState(Status.Failure, id);
        }

    }
}