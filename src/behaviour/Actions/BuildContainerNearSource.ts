import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class BuildContainerNearSource extends Tree {
    public Execute(name: string, id: string): Status {
        const room = Board.CurrentRoom;
        const sources = room.find(FIND_SOURCES);
        const containers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
        const containerSites = room.find(FIND_CONSTRUCTION_SITES,
            { filter: (s) => s.structureType === STRUCTURE_CONTAINER }
        );
        for (let i = containers.length + containerSites.length; i < sources.length; i++) {
            const source = sources[i];
            const result = BuildHelper.BuildOneStructureNearPos(source.pos, 1, STRUCTURE_CONTAINER, (pos): boolean => {
                if (pos) {
                    const structures = pos.lookFor(LOOK_STRUCTURES);
                    return Game.map.getTerrainAt(pos.x, pos.y, room.name) !== "wall" &&
                        (structures.length === 0 ||
                            (structures.length === 1 && structures[0].structureType === STRUCTURE_ROAD));
                }
                return false;
            });
            if (result !== 0) {
                return this.ReturnState(Status.Failure, id);
            }
        }
        return this.ReturnState(Status.Succeed, id);
    }
}
