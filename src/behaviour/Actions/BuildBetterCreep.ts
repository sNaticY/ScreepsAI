import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";
import BaseActions from "./BaseActions";

export class BuildBetterCreep extends Tree {
    public role: string;
    public name: string;
    constructor(role: string, name: string) {
        super();
        this.role = role;
        this.name = name;
    }
    public Execute(name: string, id: string): Status {
        const creeps = Board.CurrentRoom.find(FIND_CREEPS, { filter: (c) => c.memory.role === this.role });
        let maxLevel: number = 0;
        for (const cr of creeps) {
            if (cr.memory.level > maxLevel) {
                maxLevel = cr.memory.level;
            }
        }
        for (let i = Board.EnconemyLevel; i > maxLevel; i--) {
            const result = BaseActions.BuildCreep(this.role, this.name, i);
            if (result === 0) {
                return this.ReturnState(result, id);
            }
        }
        if (Board.EnconemyLevel === maxLevel) {
            const result = BaseActions.BuildCreep(this.role, this.name, maxLevel);
        }
        return this.ReturnState(Status.Failure, id);
    }
}
