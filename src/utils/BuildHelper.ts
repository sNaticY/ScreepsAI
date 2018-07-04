import Board from "behaviour/Board";
import { Dictionary, List, random } from "lodash";

type PosFilter = (pos: RoomPosition) => boolean;

const BodyParts: Dictionary<List<BodyPartConstant[]>> = {
    carrier: [
        [],
        [],
        [ // 550
            CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE
        ],
        [ // 800
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [ // 1300
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [ // 1800
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE
        ],
        [ // 2300
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [ // 5300
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [ // 12300
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE
        ]
    ],
    miner: [
        [],
        [],
        [WORK, WORK, WORK, WORK, WORK, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    ],
    probe: [
        [],
        []
    ],
    worker: [
        [],
        // 300, 4
        [
            WORK, // 100
            CARRY,  // 50
            MOVE, MOVE // 100
        ],
        // 550, 8
        [
            WORK, WORK,  // 200
            CARRY, CARRY, // 100
            MOVE, MOVE, MOVE, MOVE // 200
        ],
        // 800, 12
        [
            WORK, WORK, WORK, WORK, // 400
            CARRY, CARRY, CARRY, CARRY, // 200
            MOVE, MOVE, MOVE, MOVE // 200
        ],
        // 1300, 18
        [
            WORK, WORK, WORK, WORK, WORK, WORK, // 600
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, // 300
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE  // 300
        ],
        // 1800, 27
        [
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, // 900
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, // 450
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE// 450
        ],
        // 2300, 33
        [
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            WORK, // 1100
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, // 550
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE // 550
        ],
        // 5300, 50
        [
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, // 1700
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, // 800
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE // 850
        ],
        // 12300, 50
        [
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, // 1700
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, // 800
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE // 850
        ]
    ]
};

export class BuildHelper {
    public static BuildCreep(role: string, level: number, spawn: StructureSpawn, name: string): ScreepsReturnCode {
        if (role === "harvester" || role === "upgrader" || role === "builder") {
            const result = spawn.spawnCreep(BodyParts.worker[level], name,
                { memory: BuildHelper.GenScreepsMemory(role, level) }
            );
            return result;
        } else {
            const result = spawn.spawnCreep(BodyParts[role][level], name,
                { memory: BuildHelper.GenScreepsMemory(role, level) }
            );

            if (result === 0 && role === "miner") {
                Board.MinerIndex++;
            }
            return result;
        }
    }

    public static BuildRoad(path: PathStep[], room: Room) {
        for (const pathStep of path) {
            room.createConstructionSite(pathStep.x, pathStep.y, STRUCTURE_ROAD);
        }
    }

    private static GenScreepsMemory(role: string, level: number): CreepMemory {
        let minerIndex = 0;
        if (role === "miner") {
            minerIndex = Board.MinerIndex;
        } else {
            minerIndex = random(0, 1);
        }
        return { role, harvestIndex: minerIndex, level };
    }

    public static BuildOneStructureNearPos(originPos: RoomPosition, range: number,
                                           type: BuildableStructureConstant, filter: PosFilter): ScreepsReturnCode {
        const room = Board.CurrentRoom;
        let pos: RoomPosition | undefined;
        for (let i = range * -1; i < range; i++) {
            const pos1 = room.getPositionAt(originPos.x + i, originPos.y - range);
            if (pos1 && filter(pos1)) { pos = pos1; break; }
            const pos2 = room.getPositionAt(originPos.x + i, originPos.y + range);
            if (pos2 && filter(pos2)) { pos = pos2; break; }
            const pos3 = room.getPositionAt(originPos.x - range, originPos.y + i);
            if (pos3 && filter(pos3)) { pos = pos3; break; }
            const pos4 = room.getPositionAt(originPos.x + range, originPos.y + i);
            if (pos4 && filter(pos4)) { pos = pos4; break; }
        }
        if (pos) {
            const result = room.createConstructionSite(pos.x, pos.y, type);
            return result;
        }
        return -9;
    }

    public static BuildAllStructureNearPos(originPos: RoomPosition, range: number,
                                           type: BuildableStructureConstant, filter: PosFilter) {
        const room = Board.CurrentRoom;
        for (let i = range * -1; i < range; i++) {
            const pos1 = room.getPositionAt(originPos.x + i, originPos.y - range);
            if (pos1 && filter(pos1)) { room.createConstructionSite(pos1, type); }
            const pos2 = room.getPositionAt(originPos.x + i, originPos.y + range);
            if (pos2 && filter(pos2)) { room.createConstructionSite(pos2, type); }
            const pos3 = room.getPositionAt(originPos.x - range, originPos.y + i);
            if (pos3 && filter(pos3)) { room.createConstructionSite(pos3, type); }
            const pos4 = room.getPositionAt(originPos.x + range, originPos.y + i);
            if (pos4 && filter(pos4)) { room.createConstructionSite(pos4, type); }
        }
    }

}
