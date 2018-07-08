import { Province } from "./Province";
import { RoomMap } from "./RoomMap";

export class RoomPlaner {
    public static Initialize(room: Room) {
        const provinceAndPlan = RoomPlaner.CalcRoomProvinceNameAndRoomPlan(room);

        const provinceName = provinceAndPlan.provinceName;
        const plan = provinceAndPlan.roomPlan;
        const middlePos = RoomMap.CalcMiddlePosition(room);
        console.log(middlePos);
        if (middlePos == null) {
            return;
        }
        room.createFlag(middlePos, "MiddleFlag");
        const structurePlan = {}; // RoomPlaner.CalcStructurePlan(room);
        const curSpawnTick = 0;
        const roomPlanDirty = true;
        const state: RoomState = "CORE";
        const spawning = {};

        // room.memory = {provinceName, plan, curSpawnTick, roomPlanDirty, structurePlan, state, spawning, middlePos};
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
