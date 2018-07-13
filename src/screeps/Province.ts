import { TaskAssigner } from "./TaskAssigner";

export class Province {
    public static Initialize(name: string, capitalName: string) {
        if (Memory.empire) {
            const province = Memory.provinces[name];
            if (!province) {
                Memory.provinces[name] = {
                    name,
                    roomNames: [capitalName],
                    state: "DEVELOPMENT",
                    taskIds: {},
                    // tslint:disable-next-line:object-literal-sort-keys
                    capitalRoomName: capitalName
                };
                Memory.empire.provinceIds.push(name);
                TaskAssigner.InitNewProvince(name);
            }
        }
    }
}
