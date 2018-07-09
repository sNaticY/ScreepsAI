import { RoomMapUtils } from "utils/RoomMapUtils";
import { RoomPlanUtils } from "utils/RoomPlanUtils";
import { Province } from "./Province";

export class RoomPlaner {
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
            [STRUCTURE_ROAD]: RoomPlanUtils.FindRoadPositions(origin1, room),
            [STRUCTURE_CONTAINER]: RoomPlanUtils.FindContainerPositions(middlePos, room),
            [STRUCTURE_EXTENSION]: RoomPlanUtils.FindExtensionPositions(middlePos, room),
            [STRUCTURE_TOWER]: RoomPlanUtils.FindTowerPositions(origin1, origin2, room),
            [STRUCTURE_STORAGE]: RoomPlanUtils.FindTowerPositions(origin1, origin2, room)
        }; // RoomPlaner.CalcStructurePlan(room);
        const curSpawnTick = 0;
        const roomPlanDirty = true;
        const state: RoomState = "CORE";
        const spawning = {};

        room.memory = {
            // tslint:disable-next-line:object-literal-sort-keys
            provinceName, plan, middlePos,
            origin1Pos: origin1,
            origin2Pos: origin2,
            curSpawnTick, roomPlanDirty, structurePlan, state, spawning };
    }

    public Execute(room: Room) {
        if (!room.memory.roomPlanDirty) {
            return;
        }

        room.memory.roomPlanDirty = false;
    }

    private static ChangeRoomPlan(room: Room, plan: RoomPlan) {
        room.memory.plan = plan;
        room.memory.roomPlanDirty = true;
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
        let roomPlan: RoomPlan = "UNMANAGED";

        const sourceCount = room.find(FIND_SOURCES).length;
        if (routeLength <= 1) {
            provinceName = minCapitalName;
            if (sourceCount >= 2) {
                roomPlan = "MINOR";
            } else {
                roomPlan = "JONIOR";
            }
        } else if (routeLength > 2) {
            if ( sourceCount >= 2) {
                provinceName = room.name;
                roomPlan = "MAJOR";
            } else {
                provinceName = "Unmanaged";
                roomPlan = "UNMANAGED";
            }
        } else {
            provinceName = "Unmanaged";
        }
        return {provinceName, roomPlan};
    }
}
