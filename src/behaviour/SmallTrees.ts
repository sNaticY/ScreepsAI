import Tree from "./Tree";
import Board, { Strategy } from "./Board"
import Sequence from "./Sequence";
import RunningParallel from "./RunningParallel";
import Status from "./Status";
import Selector from "./Selector";
import RunningSelector from "./RunningSelector";
import BaseActions from "./BaseActions";
import { Convert } from "./Decorators";

import {
    CheckCondition,
    MoveAndPickupEnergy,
    MoveAndWithdrawEnergyFromContainer,
    MoveAndHarvest,
    MoveAndWithdrawEnergyFromStorage,
    CheckUseableEnergy,
    MoveAndBuildExtension,
    MoveAndTransferEnergyToExtension,
    MoveAndTransferEnergyToSpawn,
    MoveAndUpgradeController,
    MoveAndTransferEnergyToStorage,
    MoveAndWithdrawNearestAllEnergy,
    MoveAndBuildConstruction,
    WithdrawNearestEnergWithoutMove,
    MoveAndRepairConstruction,
    MoveAndTransferEnergyToTower,
} from "./Actions";

export default class SmallTrees {
    public static GetEnergyTillFullForStoreUseable(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => { return BaseActions.IfCreepEnergyFull(Board.CurrentCreep) }),
            new Convert(true, Status.Succeed, Status.Running, new Selector().AddSubTree(
                new MoveAndPickupEnergy(),
                new MoveAndWithdrawEnergyFromContainer(),
                new MoveAndHarvest(),
                new MoveAndWithdrawEnergyFromStorage(),
            )),
        )
    }

    public static StoreUseableEnergyTillEmpty(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => { return BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep) }),
            new Convert(true, Status.Succeed, Status.Running, new Selector().AddSubTree(
                new MoveAndTransferEnergyToSpawn(),
                new MoveAndTransferEnergyToExtension(),
            )),
        )
    }

    public static GetEnergyTillFullForStoreBackup(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => { return BaseActions.IfCreepEnergyFull(Board.CurrentCreep) }),
            new Convert(true, Status.Succeed, Status.Running, new Selector().AddSubTree(
                new MoveAndPickupEnergy(),
                new MoveAndWithdrawEnergyFromContainer(),
            )),
        )
    }

    public static StoreBackupEnergyTillEmpty(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => { return BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep) }),
            new Convert(true, Status.Succeed, Status.Running, new MoveAndTransferEnergyToStorage()),
        )
    }

    public static GetEnergyTillFullForWork(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => { return BaseActions.IfCreepEnergyFull(Board.CurrentCreep) }),
            new Convert(true, Status.Succeed, Status.Running, new MoveAndWithdrawNearestAllEnergy()),
        )
    }

    public static BuildTillEmpty(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => { return BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep) }),
            new Convert(true, Status.Succeed, Status.Running, new Selector().AddSubTree(
                new MoveAndBuildExtension(),
                new MoveAndBuildConstruction(),

            )),
        )
    }

    public static UpgradeAndWithdrawTillEmpty(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => { return BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep) }),
            new Convert(true, Status.Succeed, Status.Running, new RunningParallel(1, 2, false, true).AddSubTree(
                new MoveAndUpgradeController(),
                new WithdrawNearestEnergWithoutMove(),
            )),
        )
    }

    public static RepairTillEmpty(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => { return BaseActions.IfCreepEnergyFull(Board.CurrentCreep) }),
            new Convert(true, Status.Succeed, Status.Running, new MoveAndRepairConstruction()),
        )
    }

    public static FillTowerTillEmpty(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => { return BaseActions.IfCreepEnergyFull(Board.CurrentCreep) }),
            new Convert(true, Status.Succeed, Status.Running, new MoveAndTransferEnergyToTower()),
        )
    }
}