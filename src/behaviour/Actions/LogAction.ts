import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class LogAction extends Tree {
    public log: string;
    public result: Status;
    constructor(log: string, result: Status) {
        super();
        this.log = log;
        this.result = result;
    }
    public Execute(name: string, id: string): Status {
        console.log(this.log);
        return this.result;
    }
}
