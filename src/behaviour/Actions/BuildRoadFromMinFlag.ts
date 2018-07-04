import { random } from "lodash";
import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class BuildRoadFromMinFlag extends Tree {
    public Execute(name: string, id: string): Status {
        const room = Board.CurrentRoom;
        if (room.memory.hasRoadBuild) {
            return this.ReturnState(Status.Succeed, id);
        }
        const flag = Game.flags.MinFlag;
        if (!flag) { return this.ReturnState(Status.Failure, id); }
        BuildHelper.BuildAllStructureNearPos(Board.CurrentSpawn.pos, 1, STRUCTURE_ROAD, (pos): boolean => {
            return true;
        });
        BuildHelper.BuildAllStructureNearPos(flag.pos, 0, STRUCTURE_ROAD, (pos): boolean => {
            return true;
        });
        const path: PathStep[] = [];
        room.memory.extensionPos = [];
        room.memory.extensionFindRange = [1, 1, 1];
        if (room.controller) {
            const controllerPath = room.findPath(flag.pos, room.controller.pos,
                { ignoreCreeps: true, plainCost: 1, swampCost: 1 });
            const pos = room.getPositionAt(
                controllerPath[Math.ceil(controllerPath.length / 2)].x,
                controllerPath[Math.ceil(controllerPath.length / 2)].y
            );
            if (pos) { room.memory.extensionPos.push(pos); }
            path.push(...controllerPath);
            BuildHelper.BuildAllStructureNearPos(room.controller.pos, 1, STRUCTURE_ROAD, (): boolean => {
                return true;
            });
        }
        path.push(...room.findPath(flag.pos, Board.CurrentSpawn.pos,
            { ignoreCreeps: true, plainCost: 1, swampCost: 1 }));
        const sources = room.find(FIND_SOURCES);
        for (const element of sources) {
            const sourcePath = room.findPath(flag.pos, element.pos, { ignoreCreeps: true, plainCost: 1, swampCost: 1 });
            const pos = room.getPositionAt(
                sourcePath[Math.ceil(sourcePath.length / 2)].x,
                sourcePath[Math.ceil(sourcePath.length / 2)].y
            );
            if (pos) { room.memory.extensionPos.push(pos); }
            path.push(...sourcePath);
            BuildHelper.BuildAllStructureNearPos(element.pos, 1, STRUCTURE_ROAD, (): boolean => {
                return true;
            });
        }
        BuildHelper.BuildRoad(path, room);
        room.memory.hasRoadBuild = true;
        return this.ReturnState(Status.Succeed, id);
    }
}
