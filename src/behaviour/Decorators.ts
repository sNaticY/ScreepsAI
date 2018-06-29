import Tree from "./Tree";
import Status from "./Status";

export class Result extends Tree {
	result: boolean
	tree: Tree | null
	constructor(result: boolean, tree: Tree | null) {
		super();
		this.result = result;
		this.tree = tree;
	}
	public Execute(): Status {
		if (this.tree) {
			this.tree.Execute()
		}
		return this.result ? Status.Succeed : Status.Failure;
	}
}

export class NotNode extends Tree {
	tree: Tree
	constructor(tree: Tree) {
		super();
		this.tree = tree;
	}
	public Execute(): Status {
		return this.tree.Execute() == Status.Succeed?Status.Failure:Status.Succeed;
	}
}

export class Repeat extends Tree {
	tree: Tree;
	num: number;
	failStop: boolean;
	constructor(num: number, failStop: boolean, tree: Tree) {
		super();
		this.tree = tree;
		this.num = num;
		this.failStop = failStop;
	}

	public Execute(): Status {
        for (let i = 0; i < this.num; i++) {
            var result = this.tree.Execute();
            if(this.failStop && result == Status.Failure)
            {
                return Status.Failure;
            }
        }
		return Status.Succeed;
	}
}