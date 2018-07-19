
import { Status } from "../Status";
import Tree from "../Tree";

export default class Selector extends Tree {
    public execute(name: string, id: string): Status {
        let subTree: Tree;
        if (this.state[id] === Status.Running) {
            let runningProcessed = false;
            for (subTree of this.subTrees) {
                if (runningProcessed) {
                    const result = subTree.execute(name + "Selector-", id);
                    if (result === Status.Succeed || result === Status.Running) {
                        return this.returnState(result, id);
                    }
                } else {
                    if (subTree.state[id] === Status.Running) {
                        const result = subTree.execute(name + "Selector-", id);
                        runningProcessed = true;
                        if (result === Status.Running || result === Status.Succeed) {
                            return this.returnState(result, id);
                        }
                    }
                }
            }
            return this.returnState(Status.Failure, id);
        } else {
            for (subTree of this.subTrees) {
                const result = subTree.execute(name + "Selector-", id);
                if (result === Status.Succeed || result === Status.Running) {
                    return this.returnState(result, id);
                }
            }
            return this.returnState(Status.Failure, id);
        }

    }
}
