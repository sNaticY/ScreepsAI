import Tree from "./Tree";
import Board, { Strategy } from "./Board"
import Sequence from "./Sequence";
import Status from "./Status";
import Selector from "./Selector";

import {
	LoopSleepTicks,
	CheckCreepNum,
	MoveAndHarvest,
	NothingToDoWarning,
	MoveAndUpgradeController,
	MoveAndBuildConstruction,
	CheckEnergyCapcity,
	MoveAndRepairConstruction,
	CheckTotalEnergy,
	MoveAndPickupEnergy,
	MoveAndWithdrawEnergyFromContainer,
	MoveAndTransferEnergyToSpawn,
	MoveAndTransferEnergyToExtension,
	MoveAndTransferEnergyToTower,
	MoveAndTransferEnergyToStorage,
	AdjustStrategy,
	LogAction,
	BuildCreep,
	CheckNearestFlag,
	BuildRoadFromMinFlag,
	BuildExtensionsByPath,
	BuildBetterCreep,
	BuildContainerNearSource,
	BuildStorageNearController,
	BuildTowerInMiddle,
	TowerAttackClosest,
	CheckUseableEnergy,
	CheckCreepEnergyFull,
	CheckCreepEnergyEmpty,
	CheckBackupEnergy,
	MoveAndWithdrawNearestEnergy,
	CheckCurStrategy,
	CheckNeedBuild,
	MoveAndWithdrawEnergyFromStorage,
	WithdrawNearestEnergWithoutMove,
} from "./Actions";

import {
	Result,
	NotNode,
	Repeat,
} from "./Decorators";
import Parallel from "./Parallel";


export default class SubTrees {

	static constructionTick: number = 0;
	static x: number = 1;
	static y: number = 1;

	public static AIConstruction(): Tree {
		var sequence = new Sequence();
		sequence.AddSubTree(
			new CheckNearestFlag(),
			new BuildRoadFromMinFlag(),
			new BuildExtensionsByPath(),
			new BuildContainerNearSource(),
			new BuildTowerInMiddle(),
			new BuildStorageNearController(),
		)

		return sequence;

	}

	public static AIBrain(): Tree {
		var sequence = new Sequence();
		{
			var energyLevelSelecter = new Selector();
			{
				var setLv1 = this.CheckEnergyCapcityThanAdjustStrategySequence(0, 550, 1);
				var setLv2 = this.CheckEnergyCapcityThanAdjustStrategySequence(550, 800, 2);
				var setLv3 = this.CheckEnergyCapcityThanAdjustStrategySequence(800, 1300, 3);
				var setLv4 = this.CheckEnergyCapcityThanAdjustStrategySequence(1300, 1800, 4);
				var setLv5 = this.CheckEnergyCapcityThanAdjustStrategySequence(1800, 2300, 5);
				var setLv6 = this.CheckEnergyCapcityThanAdjustStrategySequence(2300, 5300, 6);
				var setLv7 = this.CheckEnergyCapcityThanAdjustStrategySequence(5300, 12300, 7);
				var setLv8 = this.CheckEnergyCapcityThanAdjustStrategySequence(12300, 99999, 8);
			}
			energyLevelSelecter.AddSubTree(setLv1, setLv2, setLv3, setLv4, setLv5, setLv6, setLv7, setLv8);
		}
		sequence.AddSubTree(new LoopSleepTicks(20, true), energyLevelSelecter)
		return sequence;
	}

	public static AITower(): Tree {
		var selector = new Selector().AddSubTree(
			new TowerAttackClosest()
		);
		return selector;
	}

	public static AISpawn(): Tree {
		var sequence = new Sequence();
		{
			var selector = new Selector();
			{
				var baseLv1 = SubTrees.BuildCreepsForLevelSequence(0, 301, 1)
				var baseLv2 = SubTrees.BuildCreepsForLevelSequence(301, 551, 2)
				var baseLv3 = SubTrees.BuildCreepsForLevelSequence(551, 801, 3)
				var baseLv4 = SubTrees.BuildCreepsForLevelSequence(801, 1301, 4)
				var baseLv5 = SubTrees.BuildCreepsForLevelSequence(1301, 1801, 5)
				var baseLv6 = SubTrees.BuildCreepsForLevelSequence(1801, 2301, 6)
				var baseLv7 = SubTrees.BuildCreepsForLevelSequence(2301, 5301, 7)
				var baseLv8 = SubTrees.BuildCreepsForLevelSequence(5301, 999999, 8)
			}
			selector.AddSubTree(baseLv8, baseLv7, baseLv6, baseLv5, baseLv4, baseLv3, baseLv2, baseLv1)
		}
		sequence.AddSubTree(new LoopSleepTicks(5, true), selector)
		return sequence;
	}

	public static AIHarvester(): Tree {
		let tree = new Selector();
		tree.AddSubTree(
			SubTrees.TryStoreUseableEnergySequence(),
			SubTrees.TryBuild(),
			SubTrees.TryStoreBackupEnergySequence(),
			SubTrees.TryUpgrade(),
			new NothingToDoWarning()
		);
		return tree;
	}

	public static AIUpgrader(): Tree {
		var tree = new Selector();
		tree.AddSubTree(
			//new LogAction("Try Upgrade Before", false),
			SubTrees.TryUpgrade(),
			//new LogAction("Try Upgrade Done", false),
			SubTrees.TryStoreUseableEnergySequence(),
			SubTrees.TryStoreBackupEnergySequence(),
			new NothingToDoWarning()
		);
		return tree;
	}

	public static AIBuilder(): Tree {
		var tree = new Selector().AddSubTree(
			SubTrees.TryBuild(),
			SubTrees.TryRepair(),
			SubTrees.TryFillTower(),
			SubTrees.TryStoreUseableEnergySequence(),
			SubTrees.TryStoreBackupEnergySequence(),
			new NothingToDoWarning()
		);
		return tree;
	}

	public static AIMiner(): Tree {
		var tree = new Selector().AddSubTree(
			new MoveAndHarvest(),
			new NothingToDoWarning()
		);
		return tree;
	}

	public static AICarrier(): Tree {
		let tree = new Selector().AddSubTree(
			SubTrees.TryStoreUseableEnergySequence(),
			SubTrees.TryStoreBackupEnergySequence(),
			SubTrees.TryBuild(),
			new NothingToDoWarning()
		)
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

	private static CheckEnergyCapcityThanAdjustStrategySequence(low: number, high: number, strategyLevel: number): Tree {
		return new Sequence().AddSubTree(
			new CheckEnergyCapcity(low, high),
			new AdjustStrategy(strategyLevel)
		)
	}

	private static BuildCreepsForLevelSequence(low: number, high: number, level: number): Tree {
		return new Sequence().AddSubTree(
			new CheckTotalEnergy(low, high),
			new Sequence().AddSubTree(
				this.CheckNumThanBuildBetterCreep("harvester", "Havester"),
				this.CheckCreepNumCompleteOrBuild("miner", "Miner", 2),
			),
			new Selector().AddSubTree(
				this.CheckNumThenBuildCreepSequence("carrier", "Carrier", level),
				this.CheckNumThenBuildCreepSequence("upgrader", "Upgrader", level),
				this.CheckNumThenBuildCreepSequence("builder", "Builder", level)
			)
		)
	}

	private static TryStoreUseableEnergySequence(): Tree {
		return new Sequence().AddSubTree(
			new CheckUseableEnergy(false),
			new Selector().AddSubTree(
				new Sequence().AddSubTree(
					new CheckCreepEnergyFull(false),
					new Selector().AddSubTree(
						new MoveAndPickupEnergy(),
						new MoveAndWithdrawEnergyFromContainer(),
						new MoveAndHarvest(),
						new MoveAndWithdrawEnergyFromStorage(),
					),
				),
				new Selector().AddSubTree(
					new MoveAndTransferEnergyToSpawn(),
					new MoveAndTransferEnergyToExtension(),
				)
			)
		)
	}

	private static TryStoreBackupEnergySequence(): Tree {
		return new Sequence().AddSubTree(
			new CheckBackupEnergy(false),
			new Selector().AddSubTree(
				new Sequence().AddSubTree(
					new CheckCreepEnergyFull(false),
					new Selector().AddSubTree(
						new MoveAndPickupEnergy(),
						new MoveAndWithdrawEnergyFromContainer(),
					),
				),
				new Selector().AddSubTree(
					new MoveAndTransferEnergyToStorage(),
				)
			)
		)
	}

	private static TryBuild(): Tree {
		return new Sequence().AddSubTree(
			new CheckCurStrategy(true, Strategy.Balance, Strategy.ResourceConstruction, Strategy.NormalConstruction),
			new CheckNeedBuild(true),
			new Result(true,new Selector().AddSubTree(
				new Sequence().AddSubTree(
					new CheckCreepEnergyFull(false),
					new MoveAndWithdrawNearestEnergy(),
				),
				new MoveAndBuildConstruction(),
			))
		)
	}

	private static TryUpgrade(): Tree {
		return new Sequence().AddSubTree(
			new CheckCurStrategy(true, Strategy.Balance, Strategy.NormalWorker, Strategy.NormalConstruction, Strategy.Upgrade),
			new Result(true, new Selector().AddSubTree(
				new Sequence().AddSubTree(
					//new LogAction("CheckCreepBefore", true),
					new CheckCreepEnergyFull(false),
					//new LogAction("CheckCreepEnergyAfter", true),
					new Selector().AddSubTree(
						//new LogAction("MoveAndWithdrawBefore", false),
						new MoveAndWithdrawNearestEnergy(),
						//new LogAction("MoveAndWithdrawFinish", false),
						new MoveAndHarvest(),
					),
					//new LogAction("WithDrawSequenceFinish", false),
				),	
				new MoveAndUpgradeController(),
			)),
		)
	}

	private static TryRepair(): Tree {
		return new Sequence().AddSubTree(
			new LoopSleepTicks(7, true),
			new CheckCurStrategy(true, Strategy.Balance),
			new Result(true, new Selector().AddSubTree(
				new Sequence().AddSubTree(
					new CheckCreepEnergyFull(false),
					new MoveAndWithdrawNearestEnergy(),
				),
				new MoveAndRepairConstruction(),
			))
		)
	}

	private static TryFillTower(): Tree {
		return new Sequence().AddSubTree(
			new LoopSleepTicks(47, true),
			new CheckCurStrategy(true, Strategy.Balance),
			new Selector().AddSubTree(
				new Sequence().AddSubTree(
					new CheckCreepEnergyFull(false),
					new MoveAndWithdrawNearestEnergy(),
				),
				new MoveAndTransferEnergyToTower(),
			)
		)
	}
}