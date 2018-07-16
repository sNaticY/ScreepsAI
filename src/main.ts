
import { Board, SubTrees } from "behaviour";
import { Empire } from "screeps/Empire";
import { Province } from "screeps/Province";
import { RoomPlaner } from "screeps/RoomPlaner";
import { SpawnManager } from "screeps/SpawnManager";
import { TaskAssigner } from "screeps/TaskAssigner";
import { TaskFinder } from "screeps/TaskFinder";
import { ErrorMapper } from "utils/ErrorMapper";
// import { RoomPlan } from "utils/RoomPlan";

const aiBrain = SubTrees.AIBrain();
// const aiConstrucion = SubTrees.AIConstruction();
const aiSpawn = SubTrees.AISpawn();
const aiTower = SubTrees.AITower();
const aiHarvester = SubTrees.AIHarvester();
const aiUpgrader = SubTrees.AIUpgrader();
const aiBuilder = SubTrees.AIBuilder();
const aiMiner = SubTrees.AIMiner();
const aiCarrier = SubTrees.AICarrier();

for (const roomName in Game.rooms) {
    if (Game.rooms.hasOwnProperty(roomName)) {
        TaskFinder.InitNewRoom(roomName);
    }
}

for (const provinceName in Memory.provinces) {
    TaskAssigner.InitNewProvince(provinceName);
}

// if (_.size(Game.rooms) === 1 && !Memory.respawnComplete ) { // you only have one room and you haven't done the respawn.
const initRooms = _.find(Game.rooms); // get the only room somehow
if (initRooms && initRooms.controller && initRooms.controller.level === 1 ) { // RCL one on a single room means we've *just* respawned
    Memory.respawnComplete = true; // don't do respawn again
    // do all the once-off code here
    const roomMemroy = Game.spawns.Spawn1.room.memory;
    const spawnMemory = Game.spawns.Spawn1.memory;

    Memory.creeps = {};
    Memory.flags = {};
    Memory.provinces = {};
    Memory.tasks = {};
    Memory.spawns = {["Spawn1"]: spawnMemory};
    Memory.rooms = {[initRooms.name]: roomMemroy};
    Memory.empire = null;

    const firstRoom = Game.spawns.Spawn1.room;
    // Initialize First Room Stuffs
    Empire.Initialize();

    Province.Initialize(firstRoom.name, Game.spawns.Spawn1.room.name);

    RoomPlaner.Initialize(firstRoom);

} else {
    Memory.respawnComplete = false; // because we are RCL 2+, we reset the respawn complete flag for next respawn. The code won't run again because we are already RCL+2
}
// }

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

    for (const name in Game.spawns) {
        if (Game.spawns.hasOwnProperty(name)) {
            const spawn = Game.spawns[name];
            SpawnManager.Execute(spawn);
        }
    }

    for (const roomName in Game.rooms) {
        if (Game.rooms.hasOwnProperty(roomName)) {
            const room = Game.rooms[roomName];
            Board.CurrentRoom = room;
            aiBrain.Execute("AIBrain-", room.name);
            // aiConstrucion.Execute("AIConstruction-", room.name);

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
                if (creep.memory.role === "BOOTSTRAPER") {
                    aiHarvester.Execute("AIHarvester-", creep.id);
                } else if (creep.memory.role === "UPGRADER") {
                    aiUpgrader.Execute("AIUpgrader-", creep.id);
                } else if (creep.memory.role === "BUILDER") {
                    aiBuilder.Execute("AIBuilder-", creep.id);
                } else if (creep.memory.role === "HARVESTER") {
                    aiMiner.Execute("AIMiner-", creep.id);
                } else if (creep.memory.role === "CARRIER") {
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
