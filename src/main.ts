
import { Board, SubTrees } from "behaviour/index";
import { ErrorMapper } from "utils/ErrorMapper";
import { RoomPlan } from "utils/RoomPlan";

const aiBrain = SubTrees.AIBrain();
const aiConstrucion = SubTrees.AIConstruction();
const aiSpawn = SubTrees.AISpawn();
const aiTower = SubTrees.AITower();
const aiHarvester = SubTrees.AIHarvester();
const aiUpgrader = SubTrees.AIUpgrader();
const aiBuilder = SubTrees.AIBuilder();
const aiMiner = SubTrees.AIMiner();
const aiCarrier = SubTrees.AICarrier();

// let isFindFlag: boolean = false;

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
    //     if (curRoom && curRoom.controller) {
    //         // tslint:disable-next-line:max-line-length
    //         const pos1 = RoomPlan.FindEmptyCubeAreaAround(curRoom.controller.pos, curRoom, 5, 2, (p) => {
    //             return true;
    //         });
    //         if (pos1) {
    //             console.log(pos1);
    //             const positions = RoomPlan.FindRoadPositions(pos1, curRoom);
    //             for (const pos of positions) {
    //                 curRoom.createConstructionSite(pos, STRUCTURE_ROAD);
    //             }

    //             const pos2 = RoomPlan.FindEmptyCubeAreaAround(curRoom.controller.pos, curRoom, 3, 4, (p) => {
    //                 return RoomPlan.NotInRange(p, pos1, 5);
    //             });
    //             if (pos2) {
    //                 console.log(pos2);
    //                 curRoom.createFlag(pos2);
    //             }
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
