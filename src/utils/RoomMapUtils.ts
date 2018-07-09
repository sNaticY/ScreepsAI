import { NumericDictionary } from "lodash";
import { CubePosFilter, PosFilter, RhumbusPosFilter } from "screeps/TypeDefs";
import { RoomPlanUtils } from "./RoomPlanUtils";

export class RoomMapUtils {
    // tslint:disable-next-line:max-line-length
    public static CalcOriginPositions(middlePos: RoomPosition, room: Room): {origin1: RoomPosition|null, origin2: RoomPosition|null} {
        let origin1: RoomPosition | null = null;
        let origin2: RoomPosition | null = null;

        let anchorPos: RoomPosition;
        if (room.controller) {
            anchorPos = room.controller.pos;
        } else {
            anchorPos = middlePos;
        }
            // tslint:disable-next-line:max-line-length
        const spawns = room.find(FIND_MY_SPAWNS);
        if (spawns.length > 0) {
            const pos = room.getPositionAt(spawns[0].pos.x, spawns[0].pos.y + 1);
            if (pos && RoomMapUtils.CheckIfCubeEmpty(pos, room, 5, null)) {
                origin1 = pos;
            } else {
                origin1 = RoomMapUtils.FindEmptyCubeAreaAround(middlePos, room, 5, 2, (p) => {
                    return true;
                });
            }
        }

        if (origin1) {
            console.log(origin1);
            origin2 = RoomMapUtils.FindEmptyCubeAreaAround(anchorPos, room, 3, 2, (p) => {
                return RoomMapUtils.NotInRange(p, origin1, 5);
            });
        }
        return {origin1, origin2};
    // }
    }

    public static CalcMiddlePosition(room: Room): RoomPosition|null {
        const map: Array<Array<NumericDictionary<number>>> = [];
        for (let x = 1; x < 50; x++) {
            if (map[x] == null) {
                map[x] = [];
            }
            for (let y = 1; y < 50; y++) {
                map[x][y] = {0: -1, 1: -1, 2: -1};
            }
        }

        const targets: RoomPosition[] = [];
        const sources = room.find(FIND_SOURCES);
        for (const source of sources) {
            targets.push(source.pos);
        }
        if (room.controller) {
            targets.push(room.controller.pos);
        }

        const curSteps: RoomPosition[][] = [];
        for (let targetIndex = 0; targetIndex < targets.length; targetIndex++) {
            curSteps[targetIndex] = [];
            curSteps[targetIndex].push(targets[targetIndex]);
        }

        for (let i = 0; i < 50; i++) {
            for (let targetIndex = 0; targetIndex < targets.length; targetIndex++) {
                curSteps[targetIndex] = RoomMapUtils.CalcNextStep(map, curSteps[targetIndex], i, targetIndex);
            }
            for (const curStep of curSteps) {
                for (const pos of curStep) {
                    let notfound = false;
                    for (let targetIndex = 0; targetIndex < targets.length; targetIndex++) {
                        // console.log(pos, targetIndex, map[pos.x][pos.y][targetIndex]);
                        if (map[pos.x][pos.y][targetIndex] === -1) {
                            notfound = true;
                        }
                    }
                    if (!notfound) {
                        return pos;
                    }
                }
            }
        }
        return null;
    }

    // tslint:disable-next-line:max-line-length
    public static CalcNextStep(map: Array<Array<NumericDictionary<number>>>, thisStep: RoomPosition[], stepIndex: number, targetIndex: number): RoomPosition[] {
        const nextStep: RoomPosition[] = [];
        for (const stepPos of thisStep) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const pos = new RoomPosition(stepPos.x + i, stepPos.y + j, stepPos.roomName);
                    // tslint:disable-next-line:max-line-length
                    if (pos && pos.lookFor(LOOK_TERRAIN)[0] !== "wall" && map[pos.x][pos.y] && map[pos.x][pos.y][targetIndex] === -1) {
                        nextStep.push(pos);
                        map[pos.x][pos.y][targetIndex] = stepIndex;
                        // console.log("Set", pos, targetIndex, map[pos.x][pos.y][targetIndex]);
                    }
                }
            }
        }
        return nextStep;
    }

    // tslint:disable-next-line:max-line-length
    public static FindEmptyCubeAreaAround(originPos: RoomPosition, room: Room, halfLength: number, minDistance: number, filter: PosFilter|null): RoomPosition | null {
        for (let range = halfLength + minDistance; range < 40; range++) {
            for (let i = range * -1; i < range; i++) {
                const pos1 = room.getPositionAt(originPos.x + i, originPos.y - range);
                if (pos1 && RoomMapUtils.CheckIfCubeEmpty(pos1, room, halfLength, filter)) { return pos1; }
                const pos2 = room.getPositionAt(originPos.x + i, originPos.y + range);
                if (pos2 && RoomMapUtils.CheckIfCubeEmpty(pos2, room, halfLength, filter)) { return pos2; }
                const pos3 = room.getPositionAt(originPos.x - range, originPos.y + i);
                if (pos3 && RoomMapUtils.CheckIfCubeEmpty(pos3, room, halfLength, filter)) { return pos3; }
                const pos4 = room.getPositionAt(originPos.x + range, originPos.y + i);
                if (pos4 && RoomMapUtils.CheckIfCubeEmpty(pos4, room, halfLength, filter)) { return pos4; }
            }
        }
        return null;
    }

    // tslint:disable-next-line:max-line-length
    public static CheckIfCubeEmpty(originPos: RoomPosition, room: Room, halfLength: number, filter: PosFilter|null): boolean {
        for (let range = halfLength; range >= 0; range--) {
            for (let i = range * -1; i < range; i++) {
                const pos1 = room.getPositionAt(originPos.x + i, originPos.y - range);
                if (!pos1 || pos1.lookFor("terrain")[0] === "wall" || (filter == null || !filter(pos1))) {
                    console.log(pos1, "not empty");
                    return false;
                }
                const pos2 = room.getPositionAt(originPos.x + i, originPos.y + range);
                if (!pos2 || pos2.lookFor("terrain")[0] === "wall" || (filter == null || !filter(pos2))) {
                    console.log(pos2, "not empty");
                    return false;
                }
                const pos3 = room.getPositionAt(originPos.x - range, originPos.y + i);
                if (!pos3 || pos3.lookFor("terrain")[0] === "wall" || (filter == null || !filter(pos3))) {
                    console.log(pos3, "not empty");
                    return false;
                }
                const pos4 = room.getPositionAt(originPos.x + range, originPos.y + i);
                if (!pos4 || pos4.lookFor("terrain")[0] === "wall" || (filter == null || !filter(pos4))) {
                    console.log(pos4, "not empty");
                    return false;
                }
            }
        }
        return true;
    }

    public static NotInRange(originPos: RoomPosition, targetPos: RoomPosition|null, range: number): boolean {
        if (!targetPos) {return true; }
        return originPos.x > targetPos.x + range || originPos.x < targetPos.x - range ||
            originPos.y > targetPos.y + range || originPos.y < targetPos.y - range;
    }

    // tslint:disable-next-line:max-line-length
    public static FindCube(originPos: RoomPosition, room: Room, range: number, filter: CubePosFilter|null): RoomPosition[] {
        const positions: RoomPosition[] = [];
        for (let i = range * -1; i < range; i++) {
            const pos1 = room.getPositionAt(originPos.x + i, originPos.y - range);
            if (pos1 && pos1.lookFor("terrain")[0] !== "wall" && (filter == null || filter(pos1, i))) {
                positions.push(pos1);
            }
            const pos2 = room.getPositionAt(originPos.x + i, originPos.y + range);
            if (pos2 && pos2.lookFor("terrain")[0] !== "wall" && (filter == null || filter(pos2, i))) {
                positions.push(pos2);
            }
            const pos3 = room.getPositionAt(originPos.x - range, originPos.y + i);
            if (pos3 && pos3.lookFor("terrain")[0] !== "wall" && (filter == null || filter(pos3, i))) {
                positions.push(pos3);
            }
            const pos4 = room.getPositionAt(originPos.x + range, originPos.y + i);
            if (pos4 && pos4.lookFor("terrain")[0] !== "wall" && (filter == null || filter(pos4, i))) {
                positions.push(pos4);
            }
        }
        return positions;
    }

    // tslint:disable-next-line:max-line-length
    public static FindRhumbus(originPos: RoomPosition, room: Room, range: number, filter: RhumbusPosFilter|null): RoomPosition[] {
        const positions: RoomPosition[] = [];
        for (let i = 0, j = range; i < range && j > 0; i++ , j--) {
            const pos1 = room.getPositionAt(originPos.x + i, originPos.y + j);
            if (pos1 && pos1.lookFor("terrain")[0] !== "wall" && (filter == null || filter(pos1, i, j))) {
                positions.push(pos1);
            }
            const pos2 = room.getPositionAt(originPos.x - i, originPos.y - j);
            if (pos2 && pos2.lookFor("terrain")[0] !== "wall" && (filter == null || filter(pos2, i, j))) {
                positions.push(pos2);
            }
            const pos3 = room.getPositionAt(originPos.x + j, originPos.y - i);
            if (pos3 && pos3.lookFor("terrain")[0] !== "wall" && (filter == null || filter(pos3, i, j))) {
                positions.push(pos3);
            }
            const pos4 = room.getPositionAt(originPos.x - j, originPos.y + i);
            if (pos4 && pos4.lookFor("terrain")[0] !== "wall" && (filter == null || filter(pos4, i, j))) {
                positions.push(pos4);
            }
        }
        return positions;
    }

}
