import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class NothingToDoWarning extends Tree {
    public Execute(name: string, id: string): Status {
        const creep = Board.CurrentCreep;
        creep.say("Sleep!");
        return this.ReturnState(Status.Failure, id);
    }
}
