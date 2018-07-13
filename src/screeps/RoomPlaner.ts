import { Dictionary } from "lodash";
import { RoomMapUtils } from "utils/RoomMapUtils";
import { RoomPlanUtils } from "utils/RoomPlanUtils";
import { Province } from "./Province";
import { RoomPlanAction, RoomPlanFunc, RoomPlanString, RoomStateString } from "./TypeDefs";

export class RoomPlaner {
    // Key = RoomName;
    public static RoomPlanFuncs: Dictionary<RoomPlanAction[]> = {};

    public static AddRoomPlanListener(RoomName: string, obj: any, func: RoomPlanFunc) {
        if (RoomPlaner.RoomPlanFuncs[RoomName] == null) {
            RoomPlaner.RoomPlanFuncs[RoomName] = [];
        }
        RoomPlaner.RoomPlanFuncs[RoomName].push({obj, func});
    }

    public static RemoveRoomPlanListener(RoomName: string, obj: any, func: RoomPlanFunc) {
        if (RoomPlaner.RoomPlanFuncs[RoomName] != null) {
            const index = RoomPlaner.RoomPlanFuncs[RoomName].indexOf({obj, func}, 0);
            if (index > -1) {
                RoomPlaner.RoomPlanFuncs[RoomName].splice(index, 1);
            }
        }
    }

    public static Initialize(room: Room) {
        const provinceAndPlan = RoomPlaner.CalcRoomProvinceNameAndRoomPlan(room);

        const provinceName = provinceAndPlan.provinceName;
        const plan = provinceAndPlan.roomPlan;
        const middlePos = RoomMapUtils.CalcMiddlePosition(room);
        if (middlePos == null) {
            return;
        }
        const originPositions = RoomMapUtils.CalcOriginPositions(middlePos, room);
        const origin1 = originPositions.origin1;
        const origin2 = originPositions.origin2;
        console.log(middlePos, origin1, origin2);
        if (origin1 == null || origin2 == null) {
            return;
        }
        room.createFlag(middlePos, "MiddleFlag");
        const structurePlan = {
            [STRUCTURE_ROAD]: RoomPlanUtils.FindRoadPositions(origin1, origin2, room),
            [STRUCTURE_CONTAINER]: RoomPlanUtils.FindContainerPositions(middlePos, room),
            [STRUCTURE_EXTENSION]: RoomPlanUtils.FindExtensionPositions(middlePos, room),
            [STRUCTURE_TOWER]: RoomPlanUtils.FindTowerPositions(origin1, origin2, room),
            [STRUCTURE_STORAGE]: RoomPlanUtils.FindStoragePositions(origin2, room)
        }; // RoomPlaner.CalcStructurePlan(room);
        const curSpawnTick = 0;
        const roomPlanDirty = true;
        const roomTaskDirty = true;
        const state: RoomState = RoomStateString.Core;
        const spawning = {};
        const econemyLevel = 0;

        room.memory = {
            // tslint:disable-next-line:object-literal-sort-keys
            provinceName, plan, middlePos,
            origin1Pos: origin1,
            origin2Pos: origin2,
            curSpawnTick, structurePlan, state, spawning, econemyLevel
        };

        const funcs = RoomPlaner.RoomPlanFuncs[room.name];
        if (funcs) {
            for (const func of funcs) {
                console.log("Call func", room.name);
                func.func.call(func.obj, room.name);
            }
        }
    }

    private static CalcRoomProvinceNameAndRoomPlan(room: Room): {provinceName: string, roomPlan: RoomPlan} {
        let routeLength = 999;
        let minCapitalName = "";

        // calc nerest capital name
        for (const capitalName in Memory.provinces) {
            const route = Game.map.findRoute(room, capitalName);
            if (route !== -2) {
                if (route.length < routeLength) {
                    routeLength = route.length;
                    minCapitalName = capitalName;
                }
            }
        }

        // calc province name & room plan
        let provinceName = "";
        let roomPlan: RoomPlan = RoomPlanString.Unmanaged;

        const sourceCount = room.find(FIND_SOURCES).length;
        if (routeLength <= 1) {
            provinceName = minCapitalName;
            if (room.name === minCapitalName) {
                roomPlan = RoomPlanString.Major;
            } else if (sourceCount >= 2) {
                roomPlan = RoomPlanString.Minor;
            } else {
                roomPlan = RoomPlanString.Junior;
            }
        } else if (routeLength > 2) {
            if ( sourceCount >= 2) {
                provinceName = room.name;
                roomPlan = RoomPlanString.Major;
            } else {
                provinceName = "Unmanaged";
                roomPlan = RoomPlanString.Unmanaged;
            }
        } else {
            provinceName = "Unmanaged";
        }
        return {provinceName, roomPlan};
    }
}
