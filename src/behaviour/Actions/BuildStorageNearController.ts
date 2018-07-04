import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class BuildStorageNearController extends Tree {
    public Execute(name: string, id: string): Status {
        const room = Board.CurrentRoom;
        const controller = room.controller;
        if (controller) {
            const storages = room.find(FIND_MY_STRUCTURES,
                { filter: (s) => s.structureType === STRUCTURE_STORAGE }
            );
            const storageSites = room.find(FIND_CONSTRUCTION_SITES,
                { filter: (s) => s.structureType === STRUCTURE_STORAGE }
            );
            for (let i = storages.length + storageSites.length; i < 1; i++) {
                const result = BuildHelper.BuildOneStructureNearPos(controller.pos, 3,
                    STRUCTURE_STORAGE, (pos): boolean => {
                    return pos && Math.abs(pos.x - pos.y) % 2 === 0 &&
                        Game.map.getTerrainAt(pos.x, pos.y, room.name) !== "wall" &&
                        pos.lookFor(LOOK_CONSTRUCTION_SITES).length === 0 &&
                        pos.lookFor(LOOK_STRUCTURES).length === 0;
                });
                if (result !== 0) {
                    // console.log("Can not find position to build storage");
                    return this.ReturnState(Status.Failure, id);
                }
            }
        }
        return this.ReturnState(Status.Succeed, id);
    }
}
