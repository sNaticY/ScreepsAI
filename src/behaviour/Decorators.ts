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
	public Execute(id: string): Status {
		if (this.tree) {
			var res = this.tree.Execute("Result-", id)
			if (res == Status.Running) {
				return Status.Running;
			}
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
	public Execute(id: string): Status {
		var result = this.tree.Execute("NotNode-", id);
		switch (result) {
			case Status.Succeed:
				return Status.Failure;
			case Status.Failure:
				return Status.Succeed;

			default:
				return Status.Running;
		}
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

	public Execute(id: string): Status {
		for (let i = 0; i < this.num; i++) {
			var result = this.tree.Execute("Repeat", id);
			if (this.failStop && result == Status.Failure) {
				return Status.Failure;
			}
		}
		return Status.Succeed;
	}
}