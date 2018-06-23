import Board from "./Board";
import Tree from "./Tree";
import Status from "./Status"

export class BuildHarvester extends Tree {
    public Execute() : Status {
        var newName = 'Harvester' + Game.time;
        if(Board.CurrentSpawn.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}}) == 0){
            console.log("Build Harvester", Status.Succeed)
            return Status.Succeed;
        }
        console.log("Build Harvester", Status.Failure)
        return Status.Failure;
    }
}

export class CheckHarvesterNum extends Tree {
    public Execute() : Status {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if(harvesters.length < Board.TargetHarvesterNumber) {
            console.log("Check Harvester Num", Status.Succeed)
            return Status.Succeed;
        }
        console.log(harvesters.length, Board.TargetHarvesterNumber)
        console.log("Check Harvester Num", Status.Failure)
        return Status.Failure;
    }
}