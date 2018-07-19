
import { Status } from "../Status";
import Tree from "../Tree";

export default class Sequence extends Tree {
    public execute(name: string, id: string): Status {
        let tree: Tree;
        if (this.state[id] === Status.Running) {
            let runningProcessed = false;
            for (tree of this.subTrees) {
                if (runningProcessed) {
                    const result = tree.execute(name + "Sequence-", id);
                    if (result === Status.Running || result === Status.Failure) {
                        return this.returnState(result, id);
                    }
                } else {
                    if (tree.state[id] === Status.Running) {
                        const result = tree.execute(name + "Sequence-", id);
                        runningProcessed = true;
                        if (result === Status.Running || result === Status.Failure) {
                            return this.returnState(result, id);
                        }
                    }
                }
            }
            return this.returnState(Status.Succeed, id);
        } else {
            for (tree of this.subTrees) {
                const result = tree.execute(name + "Sequence-", id);
                if (result === Status.Failure || result === Status.Running) {
                    return this.returnState(result, id);
                }
            }
            return this.returnState(Status.Succeed, id);
        }
    }
}
