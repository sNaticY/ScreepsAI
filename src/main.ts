import { ErrorMapper } from "utils/ErrorMapper";
import { SubTrees, Board } from "behaviour/index";


var aiBrain = SubTrees.AIBrain();
var aiConstrucion = SubTrees.AIConstruction();
var aiSpawn = SubTrees.AISpawn();
var aiTower = SubTrees.AITower();
var aiHarvester = SubTrees.AIHarvester();
var aiUpgrader = SubTrees.AIUpgrader();
var aiBuilder = SubTrees.AIBuilder();
var aiMiner = SubTrees.AIMiner();
var aiCarrier = SubTrees.AICarrier();


// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

	Board.CurrentRoom = Game.rooms[Game.spawns["Spawn1"].room.name];
	Board.CurrentSpawn = Game.spawns["Spawn1"];
	
	aiBrain.Execute("0");
	
	aiConstrucion.Execute(Board.CurrentSpawn.id);
	aiSpawn.Execute(Board.CurrentSpawn.id);

	var towers = Board.CurrentRoom.find<StructureTower>(FIND_STRUCTURES, {filter:(s)=> s.structureType == STRUCTURE_TOWER})
	for (const tower of towers) {
		Board.CurrentTower = tower;
		aiTower.Execute(tower.id);
	}

	for (var name in Game.creeps) {
		var creep = Game.creeps[name];
		Board.CurrentCreep = creep;
		if (creep.memory.role == 'harvester') {
			aiHarvester.Execute(creep.id);
		}
		else if (creep.memory.role == 'upgrader') {
			aiUpgrader.Execute(creep.id);
		}
		else if (creep.memory.role == 'builder') {
			aiBuilder.Execute(creep.id);
		}
		else if(creep.memory.role == "miner") {
			aiMiner.Execute(creep.id);
		}
		else if(creep.memory.role == "carrier") {
			aiCarrier.Execute(creep.id);
		}
	}

	// Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name];
		}
	}
});
