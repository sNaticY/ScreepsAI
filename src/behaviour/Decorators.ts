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
	public Execute(name: string, id: string): Status {
		if (this.tree) {
			var res = this.tree.Execute(name + "Result-", id)
			if (res == Status.Running) {
				return this.ReturnState(Status.Running, id);
			}
		}
		return this.result ? this.ReturnState(Status.Succeed, id) : this.ReturnState(Status.Failure, id);
	}
}

export class NotNode extends Tree {
	tree: Tree
	constructor(tree: Tree) {
		super();
		this.tree = tree;
	}
	public Execute(name: string, id: string): Status {
		var result = this.tree.Execute(name + "NotNode-", id);
		switch (result) {
			case Status.Succeed:
				return this.ReturnState(Status.Failure, id);
			case Status.Failure:
				return this.ReturnState(Status.Succeed, id);

			default:
				return this.ReturnState(Status.Running, id);
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

	public Execute(name: string, id: string): Status {
		for (let i = 0; i < this.num; i++) {
			var result = this.tree.Execute(name + "Repeat-", id);
			if (this.failStop && result == Status.Failure) {
				return this.ReturnState(Status.Failure, id);
			}
		}
		return this.ReturnState(Status.Succeed, id);
	}
}

export class Convert extends Tree {
	tree: Tree;
	equal: boolean;
	fromState: Status;
	targetState: Status;

	constructor(equal: boolean, fromState: Status, targetState: Status, tree: Tree) {
		super();
		this.tree = tree;
		this.equal = equal;
		this.fromState = fromState;
		this.targetState = targetState;
	}

	public Execute(name: string, id: string): Status {
		var result = this.tree.Execute(name + "Convert-", id);
		if (this.equal) {
			if (result == this.fromState) {
				return this.ReturnState(this.targetState, id);
			}
		}
		else {
			if (result != this.fromState) {
				return this.ReturnState(this.targetState, id);
			}
		}
		return this.ReturnState(result, id);
	}
}