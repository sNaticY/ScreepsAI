// import { random } from "lodash";
// import { BuildHelper } from "utils/BuildHelper";
// import Board from "../Board";
// import Status from "../Status";
// import Tree from "../Tree";

// export class BuildExtensionsByPath extends Tree {
//     public Execute(name: string, id: string): Status {
//         const room = Board.CurrentRoom;
//         const extensions = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_EXTENSION });
//         const extensionSites = room.find(FIND_CONSTRUCTION_SITES,
//             { filter: (s) => s.structureType === STRUCTURE_EXTENSION }
//         );
//         let extensionCount: number = 0;
//         if (room.controller) {
//             switch (room.controller.level) {
//                 case 2:
//                     extensionCount = 5;
//                     break;
//                 default:
//                     extensionCount = (room.controller.level - 2) * 10;
//                     break;
//             }
//             if (room.memory.hasMidFlagFound) {
//                 return this.ReturnState(Status.Succeed, id);
//             }
//             let posIndex = random(0, 2);
//             for (let i = extensions.length + extensionSites.length; i < extensionCount;) {
//                 const result = BuildHelper.BuildOneStructureNearPos(
//                     room.memory.extensionPos[posIndex],
//                     room.memory.extensionFindRange[posIndex],
//                     STRUCTURE_EXTENSION,
//                     (pos): boolean => {
//                         return pos && Math.abs(pos.x - pos.y) % 2 === 0 &&
//                             pos.lookFor(LOOK_CONSTRUCTION_SITES).length === 0 &&
//                             pos.lookFor(LOOK_STRUCTURES).length === 0 &&
//                             Game.map.getTerrainAt(pos.x, pos.y, room.name) !== "wall" &&
//                             pos.findInRange(FIND_SOURCES, 2).length === 0;
//                 });
//                 if (result === 0) {
//                     i++;
//                     posIndex = random(0, 2);
//                     // console.log("build", i, "extension, total", extensionCount)
//                 } else if (result === -9) {
//                     room.memory.extensionFindRange[posIndex]++;
//                 }
//             }
//             return this.ReturnState(Status.Succeed, id);
//         }
//         return this.ReturnState(Status.Failure, id);
//     }
// }
