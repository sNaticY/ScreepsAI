import { Dictionary } from "lodash";

enum Strategy {
    Balance = 0, //anything
    ResourceWorker = 1, //Miner, Harvester, Carrier
    ResourceConstruction = 2, //Extensions
    NormalConstruction = 3, //Road, 
    NormalWorker = 4, //Builder, Upgrader, Worker
    Upgrade = 5, //UpgradController
}

export default class Board {
    static CurrentCreep: Creep
    static CurrentSpawn: StructureSpawn

    static CreepNumber: Dictionary<Array<number>> = {
        harvester: [0, 0, 0, 0],
        upgrader: [0, 0, 0, 0],
        builder: [0, 0, 0, 0],
        miner: [0, 0, 0, 0],
        carrier: [0, 0, 0, 0],
    }

    static MinerIndex = 0;
    static EnconemyLevel = 0;
    static Strategy = Strategy.Balance;

}