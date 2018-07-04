
import { Board, SubTrees } from "behaviour/index";
import { ErrorMapper } from "utils/ErrorMapper";

const aiBrain = SubTrees.AIBrain();
const aiConstrucion = SubTrees.AIConstruction();
const aiSpawn = SubTrees.AISpawn();
const aiTower = SubTrees.AITower();
const aiHarvester = SubTrees.AIHarvester();
const aiUpgrader = SubTrees.AIUpgrader();
const aiBuilder = SubTrees.AIBuilder();
const aiMiner = SubTrees.AIMiner();
const aiCarrier = SubTrees.AICarrier();

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    console.log("-------------------------");
    for (const roomName in Game.rooms) {
        if (Game.rooms.hasOwnProperty(roomName)) {
            const room = Game.rooms[roomName];
            Board.CurrentRoom = room;
            aiBrain.Execute("AIBrain-", room.name);
            aiConstrucion.Execute("AIConstruction-", room.name);

            const spawnsInRoom = room.find(FIND_MY_SPAWNS);
            for (const spawn of spawnsInRoom) {
                Board.CurrentSpawn = spawn;
                aiSpawn.Execute("AISpawn-", Board.CurrentSpawn.id);
            }

            const towers = Board.CurrentRoom.find<StructureTower>(FIND_STRUCTURES,
                { filter: (s) => s.structureType === STRUCTURE_TOWER }
            );
            for (const tower of towers) {
                Board.CurrentTower = tower;
                aiTower.Execute("AITower-", tower.id);
            }

            const creepsInRoom = room.find(FIND_MY_CREEPS);
            for (const creep of creepsInRoom) {
                Board.CurrentCreep = creep;
                if (creep.memory.role === "harvester") {
                    aiHarvester.Execute("AIHarvester-", creep.id);
                } else if (creep.memory.role === "upgrader") {
                    aiUpgrader.Execute("AIUpgrader-", creep.id);
                } else if (creep.memory.role === "builder") {
                    aiBuilder.Execute("AIBuilder-", creep.id);
                } else if (creep.memory.role === "miner") {
                    aiMiner.Execute("AIMiner-", creep.id);
                } else if (creep.memory.role === "carrier") {
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
