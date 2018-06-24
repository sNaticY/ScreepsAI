import { Dictionary } from "lodash";

export default class Board {
    static CurrentCreep : Creep
    static CurrentSpawn : StructureSpawn

    static CreepNumber : Dictionary<Array<number>> = { 
        harvester: [0,0,0,0],
        upgrader: [0,0,0,0],
        builder: [0,0,0,0],
        miner: [0,0,0,0],
        carrier: [0,0,0,0],
    }

    static MinerIndex = 0;

}