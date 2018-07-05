import { CubePosFilter, PosFilter, RhumbusPosFilter } from "screeps/TypeDefs";

export class RoomPlan {
    // tslint:disable-next-line:max-line-length
    public static FindEmptyCubeAreaAround(originPos: RoomPosition, room: Room, halfLength: number, minDistance: number, filter: PosFilter): RoomPosition | null {
        for (let range = halfLength + minDistance; range < 40; range++) {
            for (let i = range * -1; i < range; i++) {
                const pos1 = room.getPositionAt(originPos.x + i, originPos.y - range);
                if (pos1 && RoomPlan.CheckIfCubeEmpty(pos1, room, halfLength, filter)) { return pos1; }
                const pos2 = room.getPositionAt(originPos.x + i, originPos.y + range);
                if (pos2 && RoomPlan.CheckIfCubeEmpty(pos2, room, halfLength, filter)) { return pos2; }
                const pos3 = room.getPositionAt(originPos.x - range, originPos.y + i);
                if (pos3 && RoomPlan.CheckIfCubeEmpty(pos3, room, halfLength, filter)) { return pos3; }
                const pos4 = room.getPositionAt(originPos.x + range, originPos.y + i);
                if (pos4 && RoomPlan.CheckIfCubeEmpty(pos4, room, halfLength, filter)) { return pos4; }
            }
        }
        return null;
    }

    // tslint:disable-next-line:max-line-length
    public static CheckIfCubeEmpty(originPos: RoomPosition, room: Room, halfLength: number, filter: PosFilter): boolean {
        for (let range = halfLength; range >= 0; range--) {
            for (let i = range * -1; i < range; i++) {
                const pos1 = room.getPositionAt(originPos.x + i, originPos.y - range);
                if (!pos1 || pos1.lookFor("terrain")[0] === "wall" || !filter(pos1)) {
                    console.log(pos1, "not empty");
                    return false;
                }
                const pos2 = room.getPositionAt(originPos.x + i, originPos.y + range);
                if (!pos2 || pos2.lookFor("terrain")[0] === "wall" || !filter(pos2)) {
                    console.log(pos2, "not empty");
                    return false;
                }
                const pos3 = room.getPositionAt(originPos.x - range, originPos.y + i);
                if (!pos3 || pos3.lookFor("terrain")[0] === "wall" || !filter(pos3)) {
                    console.log(pos3, "not empty");
                    return false;
                }
                const pos4 = room.getPositionAt(originPos.x + range, originPos.y + i);
                if (!pos4 || pos4.lookFor("terrain")[0] === "wall" || !filter(pos4)) {
                    console.log(pos4, "not empty");
                    return false;
                }
            }
        }
        return true;
    }

    public static NotInRange(originPos: RoomPosition, targetPos: RoomPosition, range: number): boolean {
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

    public static FindRoadPositions(originPos: RoomPosition, room: Room): RoomPosition[] {
        const positions: RoomPosition[] = [];
        positions.push(originPos);
        positions.push(...RoomPlan.FindRhumbus(originPos, room, 2, null));
        for (let i = 0; i < 3; i++) {
            const pos1 = room.getPositionAt(originPos.x + (2 + i), originPos.y + (2 + i));
            if (pos1) {
                positions.push(pos1);
            }
            const pos2 = room.getPositionAt(originPos.x + (2 + i), originPos.y - (2 + i));
            if (pos2) {
                positions.push(pos2);
            }
            const pos3 = room.getPositionAt(originPos.x - (2 + i), originPos.y + (2 + i));
            if (pos3) {
                positions.push(pos3);
            }
            const pos4 = room.getPositionAt(originPos.x - (2 + i), originPos.y - (2 + i));
            if (pos4) {
                positions.push(pos4);
            }
        }
        const pos5 = room.getPositionAt(originPos.x - 4, originPos.y);
        if (pos5) {
            positions.push(...RoomPlan.FindRhumbus(pos5, room, 1, null));
        }
        const pos6 = room.getPositionAt(originPos.x + 4, originPos.y);
        if (pos6) {
            positions.push(...RoomPlan.FindRhumbus(pos6, room, 1, null));
        }
        const pos7 = room.getPositionAt(originPos.x, originPos.y - 4);
        if (pos7) {
            positions.push(...RoomPlan.FindRhumbus(pos7, room, 1, null));
        }
        const pos8 = room.getPositionAt(originPos.x, originPos.y + 4);
        if (pos8) {
            positions.push(...RoomPlan.FindRhumbus(pos8, room, 1, null));
        }

        return positions;
    }

    public static FindExtensionPositions(originPos: RoomPosition, room: Room): RoomPosition[] {
        const positions: RoomPosition[] = [];
        const pos2s = RoomPlan.FindCube(originPos, room, 2, (pos, i) => {
            return i !== -2 && i !== 0;
        });
        const pos3s = RoomPlan.FindCube(originPos, room, 3, (pos, i) => {
            return i !== -3 && i !== 0;
        });
        const pos4s = RoomPlan.FindCube(originPos, room, 3, (pos, i) => {
            return i !== -4 && i !== -1 && i !== -0 && i !== 1;
        });
        const pos5s = RoomPlan.FindCube(originPos, room, 3, (pos, i) => {
            return i !== -2 && i !== -1 && i !== -0 && i !== 1 && i !== 2;
        });
        positions.push(...pos2s, ...pos3s, ...pos4s, ...pos5s);
        return positions;
    }

    public static FindTowerPositions(origin1: RoomPosition, origin2: RoomPosition, room: Room): RoomPosition[] {
        const positions: RoomPosition[] = [];
        const pos1 = room.getPositionAt(origin1.x - 4, origin1.y);
        const pos2 = room.getPositionAt(origin1.x + 4, origin1.y);
        const pos3 = room.getPositionAt(origin1.x, origin1.y + 4);
        const pos4 = room.getPositionAt(origin1.x, origin1.y - 4);
        const pos5 = room.getPositionAt(origin2.x - 2, origin2.y);
        const pos6 = room.getPositionAt(origin2.x + 2, origin2.y);
        if (pos1) { positions.push(pos1); }
        if (pos2) { positions.push(pos2); }
        if (pos3) { positions.push(pos3); }
        if (pos4) { positions.push(pos4); }
        if (pos5) { positions.push(pos5); }
        if (pos6) { positions.push(pos6); }
        return positions;
    }

    public static FindStoragetPosition(origin: RoomPosition, room: Room): RoomPosition|null {
        const pos = room.getPositionAt(origin.x, origin.y + 3);
        if (pos) {return pos; }
        return null;
    }
}
