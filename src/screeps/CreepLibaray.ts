import { Dictionary } from "lodash";
import { CreepPrototype, RoleTypeString, TaskTypeString } from "./TypeDefs";

export class CreepLibaray {
    public static Prototypes: Dictionary<CreepPrototype[]> = {
        [TaskTypeString.BootStrap]: [
            {
                taskType: TaskTypeString.BootStrap,
                econemyLevel: 1, workPoint: 3, level: 1,
                body: [
                    WORK, CARRY, MOVE, MOVE
                ],
                role: RoleTypeString.Bootstraper
            }
        ],
        [TaskTypeString.Harvest]: [
            { // Level1
                taskType: TaskTypeString.Harvest,
                econemyLevel: 1, workPoint: 4, level: 1,
                body: [
                    WORK, WORK, CARRY, MOVE
                ],
                role: RoleTypeString.Harvester
            },
            { // Level2
                taskType: TaskTypeString.Harvest,
                econemyLevel: 2, workPoint: 4, level: 2,
                body: [
                    WORK, WORK, WORK, WORK, WORK, MOVE
                ],
                role: RoleTypeString.Harvester
            }
        ],
        [TaskTypeString.Carry]: [
            { // Level1
                taskType: TaskTypeString.Carry,
                econemyLevel: 1, workPoint: 100, level: 1,
                body: [
                    CARRY, CARRY, MOVE, MOVE
                ],
                role: RoleTypeString.Carrier
            }
        ],
        [TaskTypeString.Build]: [
            { // Level1
                taskType: TaskTypeString.Build,
                econemyLevel: 1, workPoint: 1, level: 1,
                body: [
                    WORK, CARRY, MOVE, MOVE
                ],
                role: RoleTypeString.Builder
            }
        ],
        [TaskTypeString.Upgrade]: [
            { // Level1
                taskType: TaskTypeString.Upgrade,
                econemyLevel: 1, workPoint: 1, level: 1,
                body: [
                    WORK, CARRY, MOVE, MOVE
                ],
                role: RoleTypeString.Upgrader
            }
        ]
    };
}
