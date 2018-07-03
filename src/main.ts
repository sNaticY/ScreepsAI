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
	console.log("-------------------------")
	for (const roomName in Game.rooms) {
		if (Game.rooms.hasOwnProperty(roomName)) {
			const room = Game.rooms[roomName];
			Board.CurrentRoom = room;
			aiBrain.Execute("AIBrain-", room.name);
			aiConstrucion.Execute("AIConstruction-",room.name);

			var spawnsInRoom = room.find(FIND_MY_SPAWNS);
			for (const spawn of spawnsInRoom) {
				Board.CurrentSpawn = spawn;
				aiSpawn.Execute("AISpawn-", Board.CurrentSpawn.id);
			}

			var towers = Board.CurrentRoom.find<StructureTower>(FIND_STRUCTURES, {filter:(s)=> s.structureType == STRUCTURE_TOWER})
			for (const tower of towers) {
				Board.CurrentTower = tower;
				aiTower.Execute("AITower-", tower.id);
			}

			var creepsInRoom = room.find(FIND_MY_CREEPS)
			for (var creep of creepsInRoom) {
				Board.CurrentCreep = creep;
				if (creep.memory.role == 'harvester') {
					aiHarvester.Execute("AIHarvester-", creep.id);
				}
				else if (creep.memory.role == 'upgrader') {
					aiUpgrader.Execute("AIUpgrader-", creep.id);
				}
				else if (creep.memory.role == 'builder') {
					aiBuilder.Execute("AIBuilder-", creep.id);
				}
				else if(creep.memory.role == "miner") {
					aiMiner.Execute("AIMiner-", creep.id);
				}
				else if(creep.memory.role == "carrier") {
					aiCarrier.Execute("AICarrier-", creep.id);
				}
			}
		}
	}

	// Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name];
		}
	}
});
