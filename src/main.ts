
import { Board, SubTrees } from "behaviour";
import { Empire } from "screeps/Empire";
import { Province } from "screeps/Province";
import { RoomPlaner } from "screeps/RoomPlaner";
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

const firstRoom = Game.spawns.Spawn1.room;
// Initialize First Room Stuffs
Empire.Initialize();
Province.Initialize(firstRoom.name, Game.spawns.Spawn1.room.name);
RoomPlaner.Initialize(firstRoom);
TaskFinder.Execute(firstRoom.name);

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    // console.log("-------------------------");
    // if (!isFindFlag) {
    //     const curRoom = Game.spawns.Spawn1.room;
    //     const sites = curRoom.find(FIND_CONSTRUCTION_SITES);
    //     for (const site of sites) {
    //         site.remove();
    //     }
    //     let origin1: RoomPosition | null = null;
    //     let origin2: RoomPosition | null = null;
    //     if (curRoom && curRoom.controller) {
    //         // tslint:disable-next-line:max-line-length
    //         const spawnPos = Game.spawns.spawn1.pos;
    //         const pos = curRoom.getPositionAt(spawnPos.x, spawnPos.y + 1);
    //         if (pos && RoomPlan.CheckIfCubeEmpty(pos, curRoom, 5, null)) {
    //             origin1 = pos;
    //         } else {
    //             origin1 = RoomPlan.FindEmptyCubeAreaAround(curRoom.controller.pos, curRoom, 5, 2, (p) => {
    //                 return true;
    //             });
    //         }

    //         if (origin1) {
    //             console.log(origin1);
    //             origin2 = RoomPlan.FindEmptyCubeAreaAround(curRoom.controller.pos, curRoom, 3, 4, (p) => {
    //                 return RoomPlan.NotInRange(p, origin1, 5);
    //             });
    //         }

    //         if (origin1) {
    //             const positions = RoomPlan.FindRoadPositions(origin1, curRoom);
    //             for (const position of positions) {
    //                 curRoom.createConstructionSite(position, STRUCTURE_ROAD);
    //             }
    //         }
    //         if (origin2) {
    //             curRoom.createFlag(origin2);
    //         }
    //     }
    //     console.log("finish find flag");
    //     isFindFlag = true;
    // }

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
