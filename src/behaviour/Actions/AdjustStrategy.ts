import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class AdjustStrategy extends Tree {
    public level: number;
    constructor(level: number) {
        super();
        this.level = level;
    }
    public Execute(name: string, id: string): Status {
        Board.EnconemyLevel = this.level;
        // console.log("SetLevel = ", Board.EnconemyLevel, "Current Energy = ", Board.CurrentRoom.energyAvailable)
        switch (Board.EnconemyLevel) {
            case 1:
                Board.CreepNumber.harvester = [7, 0, 0, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.upgrader = [0, 3, 0, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.builder = [0, 1, 0, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.miner = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.carrier = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                break;
            case 2:
                Board.CreepNumber.harvester = [6, 0, 0, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.upgrader = [0, 0, 3, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.builder = [0, 0, 1, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.miner = [0, 0, 2, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.carrier = [0, 0, 1, 0, 0, 0, 0, 0, 0];
                break;
            case 3:
                Board.CreepNumber.harvester = [5, 0, 0, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.upgrader = [0, 0, 0, 3, 0, 0, 0, 0, 0];
                Board.CreepNumber.builder = [0, 0, 0, 1, 0, 0, 0, 0, 0];
                Board.CreepNumber.miner = [0, 0, 2, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.carrier = [0, 0, 0, 1, 0, 0, 0, 0, 0];
                break;
            case 4:
                Board.CreepNumber.harvester = [4, 0, 0, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.upgrader = [0, 0, 0, 0, 3, 0, 0, 0, 0];
                Board.CreepNumber.builder = [0, 0, 0, 0, 1, 0, 0, 0, 0];
                Board.CreepNumber.miner = [0, 0, 2, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.carrier = [0, 0, 0, 0, 1, 0, 0, 0, 0];
                break;
            case 5:
                Board.CreepNumber.harvester = [3, 0, 0, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.upgrader = [0, 0, 0, 0, 0, 2, 0, 0, 0];
                Board.CreepNumber.builder = [0, 0, 0, 0, 0, 1, 0, 0, 0];
                Board.CreepNumber.miner = [0, 0, 2, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.carrier = [0, 0, 0, 0, 0, 1, 0, 0, 0];
                break;
            case 6:
                Board.CreepNumber.harvester = [2, 0, 0, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.upgrader = [0, 0, 0, 0, 0, 0, 2, 0, 0];
                Board.CreepNumber.builder = [0, 0, 0, 0, 0, 0, 1, 0, 0];
                Board.CreepNumber.miner = [0, 0, 2, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.carrier = [0, 0, 0, 0, 0, 0, 1, 0, 0];
                break;
            case 7:
                Board.CreepNumber.harvester = [1, 0, 0, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.upgrader = [0, 0, 0, 0, 0, 0, 0, 1, 0];
                Board.CreepNumber.builder = [0, 0, 0, 0, 0, 0, 0, 1, 0];
                Board.CreepNumber.miner = [0, 0, 2, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.carrier = [0, 0, 0, 0, 0, 0, 0, 1, 0];
                break;
            case 8:
                Board.CreepNumber.harvester = [1, 0, 0, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.upgrader = [0, 0, 0, 0, 0, 0, 0, 0, 1];
                Board.CreepNumber.builder = [0, 0, 0, 0, 0, 0, 0, 0, 1];
                Board.CreepNumber.miner = [0, 0, 2, 0, 0, 0, 0, 0, 0];
                Board.CreepNumber.carrier = [0, 0, 0, 0, 0, 0, 0, 0, 1];
                break;
            default:
                return this.ReturnState(Status.Failure, id);
        }
        return this.ReturnState(Status.Succeed, id);
    }
}
