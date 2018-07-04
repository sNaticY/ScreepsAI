import BaseActions from "./Actions/BaseActions";
import { CheckCondition } from "./Actions/CheckCondition";
import { MoveAndBuildConstruction } from "./Actions/MoveAndBuildConstruction";
import { MoveAndBuildExtension } from "./Actions/MoveAndBuildExtension";
import { MoveAndHarvest } from "./Actions/MoveAndHarvest";
import { MoveAndPickupEnergy } from "./Actions/MoveAndPickupEnergy";
import { MoveAndRepairConstruction } from "./Actions/MoveAndRepariConstruction";
import { MoveAndTransferEnergyToExtension } from "./Actions/MoveAndTransferEnergyToExtension";
import { MoveAndTransferEnergyToSpawn } from "./Actions/MoveAndTransferEnergyToSpawn";
import { MoveAndTransferEnergyToStorage } from "./Actions/MoveAndTransferEnergyToStorage";
import { MoveAndTransferEnergyToTower } from "./Actions/MoveAndTransferEnergyToTower";
import { MoveAndUpgradeController } from "./Actions/MoveAndUpgradeController";
import { MoveAndWithdrawEnergyFromContainer } from "./Actions/MoveAndWithdrawEnergyFromContainer";
import { MoveAndWithdrawEnergyFromStorage } from "./Actions/MoveAndWithdrawEnergyFromStorage";
import { MoveAndWithdrawNearestAllEnergy } from "./Actions/MoveAndWithdrawNearestAllEnergy";
import { WithdrawNearestEnergWithoutMove } from "./Actions/WithdrawNearestEnergyWithoutMove";
import Board, { Strategy } from "./Board";
import RunningParallel from "./Composites/RunningParallel";
import RunningSelector from "./Composites/RunningSelector";
import Selector from "./Composites/Selector";
import { Convert } from "./Decorators/Convert";
import Status from "./Status";
import Tree from "./Tree";

export default class SmallTrees {
    public static GetEnergyTillFullForStoreUseable(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => BaseActions.IfCreepEnergyFull(Board.CurrentCreep)),
            new Convert(true, Status.Succeed, Status.Running, new Selector().AddSubTree(
                new MoveAndPickupEnergy(),
                new MoveAndWithdrawEnergyFromContainer(),
                new MoveAndHarvest(),
                new MoveAndWithdrawEnergyFromStorage()
            ))
        );
    }

    public static StoreUseableEnergyTillEmpty(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep)),
            new Convert(true, Status.Succeed, Status.Running, new Selector().AddSubTree(
                new MoveAndTransferEnergyToSpawn(),
                new MoveAndTransferEnergyToExtension()
            ))
        );
    }

    public static GetEnergyTillFullForStoreBackup(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => BaseActions.IfCreepEnergyFull(Board.CurrentCreep)),
            new Convert(true, Status.Succeed, Status.Running, new Selector().AddSubTree(
                new MoveAndPickupEnergy(),
                new MoveAndWithdrawEnergyFromContainer()
            ))
        );
    }

    public static StoreBackupEnergyTillEmpty(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep)),
            new Convert(true, Status.Succeed, Status.Running, new MoveAndTransferEnergyToStorage())
        );
    }

    public static GetEnergyTillFullForWork(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => BaseActions.IfCreepEnergyFull(Board.CurrentCreep)),
            new Convert(true, Status.Succeed, Status.Running, new MoveAndWithdrawNearestAllEnergy())
        );
    }

    public static BuildTillEmpty(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep)),
            new Convert(true, Status.Succeed, Status.Running, new Selector().AddSubTree(
                new MoveAndBuildExtension(),
                new MoveAndBuildConstruction()

            ))
        );
    }

    public static UpgradeAndWithdrawTillEmpty(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep)),
            new Convert(true, Status.Succeed, Status.Running, new RunningParallel(1, 2, false, true).AddSubTree(
                new MoveAndUpgradeController(),
                new WithdrawNearestEnergWithoutMove()
            ))
        );
    }

    public static RepairTillEmpty(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep)),
            new Convert(true, Status.Succeed, Status.Running, new MoveAndRepairConstruction())
        );
    }

    public static FillTowerTillEmpty(): Tree {
        return new RunningSelector().AddSubTree(
            new CheckCondition(true, () => BaseActions.IfCreepEnergyEmpty(Board.CurrentCreep)),
            new Convert(true, Status.Succeed, Status.Running, new MoveAndTransferEnergyToTower())
        );
    }
}
