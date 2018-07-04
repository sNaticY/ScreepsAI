import { Dictionary } from "lodash";

export enum Strategy {
    Balance = 0, // anything
    ResourceWorker = 1, // Miner, Harvester, Carrier
    ResourceConstruction = 2, // Extensions
    NormalConstruction = 3, // Road
    NormalWorker = 4, // Builder, Upgrader, Worker
    Upgrade = 5 // UpgradController
}

export default class Board {
    public static CurrentRoom: Room;
    public static CurrentCreep: Creep;
    public static CurrentTower: StructureTower;
    public static CurrentSpawn: StructureSpawn;

    public static CreepNumber: Dictionary<number[]> = {
        builder: [0, 0, 0, 0],
        carrier: [0, 0, 0, 0],
        harvester: [0, 0, 0, 0],
        miner: [0, 0, 0, 0],
        upgrader: [0, 0, 0, 0]
    };

    public static MinerIndex = 0;
    public static EnconemyLevel = 0;
    public static Strategy = Strategy.Balance;

}
