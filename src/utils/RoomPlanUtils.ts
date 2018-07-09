import { CubePosFilter, PosFilter, RhumbusPosFilter } from "screeps/TypeDefs";
import { RoomMapUtils } from "./RoomMapUtils";

export class RoomPlanUtils {

    public static FindRoadPositions(originPos: RoomPosition, room: Room): RoomPosition[] {
        const positions: RoomPosition[] = [];
        positions.push(originPos);
        positions.push(...RoomMapUtils.FindRhumbus(originPos, room, 2, null));
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
            positions.push(...RoomMapUtils.FindRhumbus(pos5, room, 1, null));
        }
        const pos6 = room.getPositionAt(originPos.x + 4, originPos.y);
        if (pos6) {
            positions.push(...RoomMapUtils.FindRhumbus(pos6, room, 1, null));
        }
        const pos7 = room.getPositionAt(originPos.x, originPos.y - 4);
        if (pos7) {
            positions.push(...RoomMapUtils.FindRhumbus(pos7, room, 1, null));
        }
        const pos8 = room.getPositionAt(originPos.x, originPos.y + 4);
        if (pos8) {
            positions.push(...RoomMapUtils.FindRhumbus(pos8, room, 1, null));
        }

        return positions;
    }

    public static FindExtensionPositions(originPos: RoomPosition, room: Room): RoomPosition[] {
        const positions: RoomPosition[] = [];
        const pos2s = RoomMapUtils.FindCube(originPos, room, 2, (pos, i) => {
            return i !== -2 && i !== 0;
        });
        const pos3s = RoomMapUtils.FindCube(originPos, room, 3, (pos, i) => {
            return i !== -3 && i !== 0;
        });
        const pos4s = RoomMapUtils.FindCube(originPos, room, 3, (pos, i) => {
            return i !== -4 && i !== -1 && i !== -0 && i !== 1;
        });
        const pos5s = RoomMapUtils.FindCube(originPos, room, 3, (pos, i) => {
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

    public static FindStoragePositions(origin: RoomPosition, room: Room): RoomPosition[] {
        const positions: RoomPosition[] = [];
        const pos = room.getPositionAt(origin.x, origin.y + 3);
        if (pos) {
            positions.push(pos);
        }
        return positions;
    }

    public static FindContainerPositions(origin: RoomPosition, room: Room): RoomPosition[] {
        const positions: RoomPosition[] = [];
        const sources = room.find(FIND_SOURCES);
        for (const source of sources) {
            const pos = RoomMapUtils.FindCube(source.pos, room, 1, (p, i): boolean => {
                const structures = p.lookFor(LOOK_STRUCTURES);
                return (structures.length === 0 ||
                    (structures.length === 1 && structures[0].structureType === STRUCTURE_ROAD));
            });
            if (pos.length > 0) {
                positions.push(pos[0]);
            }
        }
        positions.push(origin);
        return positions;
    }
}
