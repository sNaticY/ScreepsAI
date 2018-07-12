import {Dictionary} from "lodash";

export class StructureLibrary {
    public StructureLevel: Array<Dictionary<number>> = [
        // Level 0
        {},
        // Level 1
        {
            [STRUCTURE_ROAD]: 0,
            [STRUCTURE_SPAWN]: 1
        },
        // Level 2
        {
            [STRUCTURE_ROAD]: 25,
            [STRUCTURE_CONTAINER]: 2,
            [STRUCTURE_SPAWN]: 1,
            [STRUCTURE_EXTENSION]: 5
        },
        // Level 3
        {
            [STRUCTURE_ROAD]: 25,
            [STRUCTURE_CONTAINER]: 5,
            [STRUCTURE_SPAWN]: 1,
            [STRUCTURE_EXTENSION]: 10,
            [STRUCTURE_TOWER]: 1
        },
        // Level 4
        {
            [STRUCTURE_ROAD]: 37,
            [STRUCTURE_CONTAINER]: 5,
            [STRUCTURE_SPAWN]: 1,
            [STRUCTURE_EXTENSION]: 20,
            [STRUCTURE_TOWER]: 1,
            [STRUCTURE_STORAGE]: 1
        },
        // Level 5
        {
            [STRUCTURE_ROAD]: 37,
            [STRUCTURE_CONTAINER]: 5,
            [STRUCTURE_SPAWN]: 1,
            [STRUCTURE_EXTENSION]: 30,
            [STRUCTURE_TOWER]: 2,
            [STRUCTURE_STORAGE]: 1
        },
        // Level 6
        {
            [STRUCTURE_ROAD]: 37,
            [STRUCTURE_CONTAINER]: 5,
            [STRUCTURE_SPAWN]: 1,
            [STRUCTURE_EXTENSION]: 40,
            [STRUCTURE_TOWER]: 2,
            [STRUCTURE_STORAGE]: 1
        },
        // Level 7
        {
            [STRUCTURE_ROAD]: 37,
            [STRUCTURE_CONTAINER]: 5,
            [STRUCTURE_SPAWN]: 2,
            [STRUCTURE_EXTENSION]: 50,
            [STRUCTURE_TOWER]: 3,
            [STRUCTURE_STORAGE]: 1
        },
        // Level 8
        {
            [STRUCTURE_ROAD]: 37,
            [STRUCTURE_CONTAINER]: 5,
            [STRUCTURE_SPAWN]: 3,
            [STRUCTURE_EXTENSION]: 60,
            [STRUCTURE_TOWER]: 6,
            [STRUCTURE_STORAGE]: 1
        }
    ];
}
