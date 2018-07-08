import BaseActions from "./Actions/BaseActions";
import Board, { Strategy } from "./Board";
import Selector from "./Composites/Selector";
import Sequence from "./Composites/Sequence";
import SmallTrees from "./SmallTrees";
import Tree from "./Tree";

import { AdjustStrategy } from "./Actions/AdjustStrategy";
import { BuildBetterCreep } from "./Actions/BuildBetterCreep";
import { BuildContainerNearSource } from "./Actions/BuildContainerNearSource";
import { BuildCreep } from "./Actions/BuildCreep";
import { BuildRoadFromMinFlag } from "./Actions/BuildRoadFromMinFlag";
import { BuildStorageNearController } from "./Actions/BuildStorageNearController";
import { BuildTowerInMiddle } from "./Actions/BuildTowerInMiddle";
import { CheckCondition } from "./Actions/CheckCondition";
import { CheckCreepNum } from "./Actions/CheckCreepNum";
import { CheckCurStrategy } from "./Actions/CheckCurStrategy";
import { CheckNearestFlag } from "./Actions/CheckNearestFlag";
import { LogAction } from "./Actions/LogAction";
import { LoopSleepTicks } from "./Actions/LoopSleepTicks";
import { MoveAndHarvest } from "./Actions/MoveAndHarvest";
import { NothingToDoWarning } from "./Actions/NotingToDoWarning";
import { TowerAttackClosest } from "./Actions/TowerAttackClosest";
import { CheckBackupEnergy } from "./Conditions/CheckBackupEnergy";
import { CheckEnergyCapcity } from "./Conditions/CheckEnergyCapcity";
import { CheckNeedBuild } from "./Conditions/CheckNeedBuild";
import { CheckTotalEnergy } from "./Conditions/CheckTotalEnergy";
import { CheckUseableEnergy } from "./Conditions/CheckUseableEnergy";
import { Result } from "./Decorators/Result";

export default class SubTrees {

    public static constructionTick: number = 0;
    public static x: number = 1;
    public static y: number = 1;

    public static AIConstruction(): Tree {
        const sequence = new Sequence();
        sequence.AddSubTree(
            new CheckNearestFlag(),
            new BuildRoadFromMinFlag(),
            // new BuildExtensionsByPath(),
            new BuildContainerNearSource(),
            new BuildTowerInMiddle(),
            new BuildStorageNearController()
        );

        return sequence;

    }

    public static AIBrain(): Tree {
        const sequence = new Sequence().AddSubTree(
            new LoopSleepTicks(20, true),
            new Selector().AddSubTree(
                this.CheckEnergyCapcityThanAdjustStrategySequence(0, 550, 1),
                this.CheckEnergyCapcityThanAdjustStrategySequence(550, 800, 2),
                this.CheckEnergyCapcityThanAdjustStrategySequence(800, 1300, 3),
                this.CheckEnergyCapcityThanAdjustStrategySequence(1300, 1800, 4),
                this.CheckEnergyCapcityThanAdjustStrategySequence(1800, 2300, 5),
                this.CheckEnergyCapcityThanAdjustStrategySequence(2300, 5300, 6),
                this.CheckEnergyCapcityThanAdjustStrategySequence(5300, 12300, 7),
                this.CheckEnergyCapcityThanAdjustStrategySequence(12300, 99999, 8)
            )
        );
        return sequence;
    }

    public static AITower(): Tree {
        const selector = new Selector().AddSubTree(
            new TowerAttackClosest()
        );
        return selector;
    }

    public static AISpawn(): Tree {
        const sequence = new Sequence().AddSubTree(
            new LoopSleepTicks(5, true),
            new Selector().AddSubTree(
                SubTrees.BuildCreepsForLevelSequence(0, 301, 1),
                SubTrees.BuildCreepsForLevelSequence(301, 551, 2),
                SubTrees.BuildCreepsForLevelSequence(551, 801, 3),
                SubTrees.BuildCreepsForLevelSequence(801, 1301, 4),
                SubTrees.BuildCreepsForLevelSequence(1301, 1801, 5),
                SubTrees.BuildCreepsForLevelSequence(1801, 2301, 6),
                SubTrees.BuildCreepsForLevelSequence(2301, 5301, 7),
                SubTrees.BuildCreepsForLevelSequence(5301, 999999, 8)
            )
        );
        return sequence;
    }

    public static AIHarvester(): Tree {
        const tree = new Selector();
        tree.AddSubTree(
            SubTrees.TryStoreUseableEnergyOnce(),
            SubTrees.TryBuildOnce(),
            SubTrees.TryStoreBackupEnergyOnce(),
            SubTrees.TryUpgradeOnce(),
            new NothingToDoWarning()
        );
        return tree;
    }

    public static AIUpgrader(): Tree {
        const tree = new Selector();
        tree.AddSubTree(
            // new LogAction("Try Upgrade Before", false),
            SubTrees.TryUpgradeOnce(),
            // new LogAction("Try Upgrade Done", false),
            // SubTrees.TryStoreUseableEnergyOnce(),
            // SubTrees.TryStoreBackupEnergyOnce(),
            new NothingToDoWarning()
        );
        return tree;
    }

    public static AIBuilder(): Tree {
        const tree = new Selector().AddSubTree(
            SubTrees.TryBuildOnce(),
            SubTrees.TryFillTower(),
            SubTrees.TryRepairOnce(),
            SubTrees.TryStoreUseableEnergyOnce(),
            SubTrees.TryStoreBackupEnergyOnce(),
            new NothingToDoWarning()
        );
        return tree;
    }

    public static AIMiner(): Tree {
        const tree = new Selector().AddSubTree(
            new MoveAndHarvest(),
            new NothingToDoWarning()
        );
        return tree;
    }

    public static AICarrier(): Tree {
        const tree = new Selector().AddSubTree(
            SubTrees.TryStoreUseableEnergyOnce(),
            SubTrees.TryStoreBackupEnergyOnce(),
            SubTrees.TryBuildOnce(),
            new NothingToDoWarning()
        );
        return tree;
    }

    private static CheckNumThenBuildCreepSequence(role: string, name: string, level: number): Tree {
        return new Sequence().AddSubTree(
            new CheckCreepNum(role, false, level),
            new BuildCreep(role, name, level)
        );
    }

    private static CheckCreepNumCompleteOrBuild(role: string, name: string, level: number): Tree {
        return new Selector().AddSubTree(
            new CheckCreepNum(role, true, level),
            new Result(false, new BuildCreep(role, name, level))
        );
    }

    private static CheckNumThanBuildBetterCreep(role: string, name: string): Tree {
        return new Selector().AddSubTree(
            new CheckCreepNum(role, true, undefined),
            new Result(false, new BuildBetterCreep(role, name))
        );
    }

    private static CheckEnergyCapcityThanAdjustStrategySequence( low: number, high: number,
                                                                 strategyLevel: number): Tree {
        return new Sequence().AddSubTree(
            new CheckEnergyCapcity(low, high),
            new AdjustStrategy(strategyLevel)
        );
    }

    private static BuildCreepsForLevelSequence(low: number, high: number, level: number): Tree {
        return new Sequence().AddSubTree(
            new CheckTotalEnergy(low, high),
            new Sequence().AddSubTree(
                this.CheckNumThanBuildBetterCreep("harvester", "Havester"),
                this.CheckCreepNumCompleteOrBuild("miner", "Miner", 2)
            ),
            new Selector().AddSubTree(
                this.CheckNumThenBuildCreepSequence("carrier", "Carrier", level),
                this.CheckNumThenBuildCreepSequence("upgrader", "Upgrader", level),
                this.CheckNumThenBuildCreepSequence("builder", "Builder", level)
            )
        );
    }

    private static TryStoreUseableEnergyOnce(): Tree {
        return new Sequence().AddSubTree(
            new CheckUseableEnergy(false),
            new Selector().AddSubTree(
                new CheckCondition(false, () => BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep)),
                SmallTrees.GetEnergyTillFullForStoreUseable()
            ),
            new Selector().AddSubTree(
                new CheckUseableEnergy(true),
                SmallTrees.StoreUseableEnergyTillEmpty()
            )
        );
    }

    private static TryStoreBackupEnergyOnce(): Tree {
        return new Sequence().AddSubTree(
            new CheckBackupEnergy(false),
            new Selector().AddSubTree(
                new CheckCondition(false, () => BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep)),
                SmallTrees.GetEnergyTillFullForStoreBackup()
            ),
            new Selector().AddSubTree(
                new CheckBackupEnergy(true),
                SmallTrees.StoreBackupEnergyTillEmpty()
            )
        );
    }

    private static TryBuildOnce(): Tree {
        return new Sequence().AddSubTree(
            new CheckCurStrategy(true, Strategy.Balance, Strategy.ResourceConstruction, Strategy.NormalConstruction),
            new CheckNeedBuild(true),
            new Selector().AddSubTree(
                new CheckCondition(false, () => BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep)),
                SmallTrees.GetEnergyTillFullForWork()
            ),
            new Selector().AddSubTree(
                new CheckNeedBuild(false),
                SmallTrees.BuildTillEmpty()
            )
        );
    }

    private static TryUpgradeOnce(): Tree {
        return new Sequence().AddSubTree(
            new CheckCurStrategy(true,
                Strategy.Balance,
                Strategy.NormalWorker,
                Strategy.NormalConstruction,
                Strategy.Upgrade),
            new Selector().AddSubTree(
                new CheckCondition(false, () => BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep)),
                SmallTrees.GetEnergyTillFullForWork()
            ),
            new Selector().AddSubTree(
                new CheckCurStrategy(false,
                    Strategy.Balance, Strategy.NormalWorker,
                    Strategy.NormalConstruction, Strategy.Upgrade),
                SmallTrees.UpgradeAndWithdrawTillEmpty()
            )
        );
    }

    private static TryRepairOnce(): Tree {
        return new Sequence().AddSubTree(
            new CheckCurStrategy(true, Strategy.Balance),
            new Selector().AddSubTree(
                new CheckCondition(false, () => BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep)),
                SmallTrees.GetEnergyTillFullForWork()
            ),
            new Selector().AddSubTree(
                new CheckCurStrategy(false,
                    Strategy.Balance,
                    Strategy.NormalWorker,
                    Strategy.NormalConstruction,
                    Strategy.Upgrade
                ),
                // new LogAction("Try Repair", false),
                SmallTrees.RepairTillEmpty()
            )
        );
    }

    private static TryFillTower(): Tree {
        return new Sequence().AddSubTree(
            new CheckCurStrategy(true, Strategy.Balance),
            new Selector().AddSubTree(
                new CheckCondition(false, () => BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep)),
                SmallTrees.GetEnergyTillFullForWork()
            ),
            new Selector().AddSubTree(
                new CheckCurStrategy(false,
                    Strategy.Balance,
                    Strategy.NormalWorker, Strategy.NormalConstruction,
                    Strategy.Upgrade
                ),
                SmallTrees.FillTowerTillEmpty()
            )
        );
    }
}
