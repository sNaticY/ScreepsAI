import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class BuildTowerInMiddle extends Tree {
    public Execute(name: string, id: string): Status {
        const room = Board.CurrentRoom;
        const minFlag = Game.flags.MinFlag;
        const path = room.findPath(Board.CurrentSpawn.pos, minFlag.pos);
        const middlePath = path[Math.floor(path.length / 2)];
        const middlePos = room.getPositionAt(middlePath.x, middlePath.y);
        if (middlePos) {
            const result = BuildHelper.BuildOneStructureNearPos(middlePos, 4, STRUCTURE_TOWER, (pos): boolean => {
                return pos && Math.abs(pos.x - pos.y) % 2 === 0 &&
                    Game.map.getTerrainAt(pos.x, pos.y, room.name) !== "wall" &&
                    pos.lookFor(LOOK_CONSTRUCTION_SITES).length === 0 &&
                    pos.lookFor(LOOK_STRUCTURES).length === 0;
            });
        }
        return this.ReturnState(Status.Succeed, id);
    }
}
