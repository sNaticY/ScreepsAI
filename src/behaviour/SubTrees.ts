import Tree from "./Tree";
import Board from "./Board"
import Sequence from "./Sequence";
import Status from "./Status";
import Selector from "./Selector";

import {
	LoopSleepTicks,
	CheckCreepNum,
	MoveAndHarvest,
	MoveAndTransferBackToSpawnAndExtension,
	NothingToDoWarning,
	MoveAndUpgradeController,
	MoveAndBuildConstruction,
	CheckEnergyCapcity,
	MoveAndRepairConstruction,
	CheckTotalEnergy,
	MoveAndPickupEnergy,
	MoveAndWithdrawEnergyFormExtensions,
	MoveAndWithdrawEnergyFromContainer,
	MoveAndTransferBackToSpawnOrExtensionOrContainer,
	AdjustStrategy,
	LogAction,
	BuildCreep,
	CheckNearestFlag,
	BuildPathFromMinFlag,
	BuildExtensionsByPath,
} from "./Actions";

import {
	Result,
	NotNode,
	Repeat,
} from "./Decorators";


export default class SubTrees {

	static constructionTick: number = 0;
	static x: number = 1;
	static y: number = 1;

	public static AIConstruction(): Tree {
		var sequence = new Sequence();
		sequence.AddSubTree(
			new CheckNearestFlag(),
			new BuildPathFromMinFlag(),
			new BuildExtensionsByPath(),
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

	public static AISpawn(): Tree {
		var sequence = new Sequence();
		{
			var selector = new Selector();
			{
				var baseLv1 = new Sequence();
				{
					var baseLv1Build = new Selector();
					baseLv1Build.AddSubTree(
						this.CheckNumThenBuildCreepSequence("harvester", "Havester", 1),
						this.CheckNumThenBuildCreepSequence("upgrader", "Upgrader", 1),
						this.CheckNumThenBuildCreepSequence("builder", "Builder", 1)
					);
				}
				baseLv1.AddSubTree(new CheckTotalEnergy(0, 301), baseLv1Build, new Result(true, null));

				var baseLv2 = new Sequence();
				{
					var baseLv2BuildPre = new Sequence();
					{
						var harvesterBuild = new Selector()
						harvesterBuild.AddSubTree(
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 2),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 1),
							new Result(true, null)
						);
						var minerBuild = this.CheckCreepNumCompleteOrBuild("miner", "Miner", 2);
					}
					baseLv2BuildPre.AddSubTree(harvesterBuild, minerBuild);
					var baseLv2Build = new Selector();
					baseLv2Build.AddSubTree(
						this.CheckNumThenBuildCreepSequence("carrier", "Carrier", 2),
						this.CheckNumThenBuildCreepSequence("upgrader", "Upgrader", 2),
						this.CheckNumThenBuildCreepSequence("builder", "Builder", 2)
					)
				}
				baseLv2.AddSubTree(new CheckTotalEnergy(301, 551), baseLv2BuildPre, baseLv2Build, new Result(true, null))

				var baseLv3 = new Sequence();
				{
					var baseLv3BuildPre = new Sequence();
					{
						var harvesterBuild = new Selector();
						harvesterBuild.AddSubTree(
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 3),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 2),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 1),
							new Result(true, null)
						);
						var minerBuild = new Sequence();
						minerBuild.AddSubTree(this.CheckCreepNumCompleteOrBuild("miner", "Miner", 2));
					}
					baseLv3BuildPre.AddSubTree(harvesterBuild, minerBuild);

					var baseLv3Build = new Selector();
					{
						var carrierBuild = new Sequence();
						carrierBuild.AddSubTree(this.CheckNumThenBuildCreepSequence("carrier", "Carrier", 3));
						var upgraderBuild = new Sequence();
						upgraderBuild.AddSubTree(this.CheckNumThenBuildCreepSequence("upgrader", "Upgrader", 3));
						var builderBuild = new Sequence();
						builderBuild.AddSubTree(this.CheckNumThenBuildCreepSequence("builder", "Builder", 3));
					}
					baseLv3Build.AddSubTree(carrierBuild, upgraderBuild, builderBuild)
				}
				baseLv3.AddSubTree(new CheckTotalEnergy(551, 801), baseLv3BuildPre, baseLv3Build, new Result(true, null))

				var baseLv4 = new Sequence();
				{
					var baseLv4BuildPre = new Sequence();
					{
						var harvesterBuild = new Selector();
						harvesterBuild.AddSubTree(
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 4),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 3),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 2),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 1),
							new Result(true, null)
						);
						var minerBuild = new Sequence();
						minerBuild.AddSubTree(this.CheckCreepNumCompleteOrBuild("miner", "Miner", 2));
					}
					baseLv4BuildPre.AddSubTree(harvesterBuild, minerBuild);

					var baseLv4Build = new Selector();
					baseLv4Build.AddSubTree(
						this.CheckNumThenBuildCreepSequence("carrier", "Carrier", 4),
						this.CheckNumThenBuildCreepSequence("upgrader", "Upgrader", 4),
						this.CheckNumThenBuildCreepSequence("builder", "Builder", 4)
					);
				}
				baseLv4.AddSubTree(new CheckTotalEnergy(801, 1301), baseLv4BuildPre, baseLv4Build)

				var baseLv5 = new Sequence();
				{
					var baseLv5BuildPre = new Sequence();
					{
						var harvesterBuild = new Selector();
						harvesterBuild.AddSubTree(
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 5),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 4),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 3),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 2),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 1),
							new Result(true, null)
						);
						var minerBuild = new Sequence();
						minerBuild.AddSubTree(this.CheckCreepNumCompleteOrBuild("miner", "Miner", 2));
					}
					baseLv5BuildPre.AddSubTree(harvesterBuild, minerBuild);

					var baseLv5Build = new Selector();
					baseLv5Build.AddSubTree(
						this.CheckNumThenBuildCreepSequence("carrier", "Carrier", 5),
						this.CheckNumThenBuildCreepSequence("upgrader", "Upgrader", 5),
						this.CheckNumThenBuildCreepSequence("builder", "Builder", 5)
					);
				}
				baseLv5.AddSubTree(new CheckTotalEnergy(1301, 1801), baseLv5BuildPre, baseLv5Build)

				var baseLv6 = new Sequence();
				{
					var baseLv6BuildPre = new Sequence();
					{
						var harvesterBuild = new Selector();
						harvesterBuild.AddSubTree(
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 6),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 5),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 4),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 3),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 2),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 1),
							new Result(true, null)
						);
						var minerBuild = new Sequence();
						minerBuild.AddSubTree(this.CheckCreepNumCompleteOrBuild("miner", "Miner", 2));
					}
					baseLv6BuildPre.AddSubTree(harvesterBuild, minerBuild);

					var baseLv6Build = new Selector();
					baseLv6Build.AddSubTree(
						this.CheckNumThenBuildCreepSequence("carrier", "Carrier", 6),
						this.CheckNumThenBuildCreepSequence("upgrader", "Upgrader", 6),
						this.CheckNumThenBuildCreepSequence("builder", "Builder", 6)
					);
				}
				baseLv6.AddSubTree(new CheckTotalEnergy(1801, 2301), baseLv6BuildPre, baseLv6Build)

				var baseLv7 = new Sequence();
				{
					var baseLv7BuildPre = new Sequence();
					{
						var harvesterBuild = new Selector();
						harvesterBuild.AddSubTree(
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 7),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 6),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 5),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 4),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 3),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 2),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 1),
							new Result(true, null)
						);
						var minerBuild = new Sequence();
						minerBuild.AddSubTree(this.CheckCreepNumCompleteOrBuild("miner", "Miner", 2));
					}
					baseLv7BuildPre.AddSubTree(harvesterBuild, minerBuild);

					var baseLv7Build = new Selector();
					baseLv7Build.AddSubTree(
						this.CheckNumThenBuildCreepSequence("carrier", "Carrier", 7),
						this.CheckNumThenBuildCreepSequence("upgrader", "Upgrader", 7),
						this.CheckNumThenBuildCreepSequence("builder", "Builder", 7)
					);
				}
				baseLv7.AddSubTree(new CheckTotalEnergy(2301, 5301), baseLv7BuildPre, baseLv7Build)

				var baseLv8 = new Sequence();
				{
					var baseLv8BuildPre = new Sequence();
					{
						var harvesterBuild = new Selector();
						harvesterBuild.AddSubTree(
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 8),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 7),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 6),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 5),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 4),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 3),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 2),
							this.CheckNumThenBuildCreepSequence("harvester", "Havester", 1),
							new Result(true, null)
						);
						var minerBuild = new Sequence();
						minerBuild.AddSubTree(this.CheckCreepNumCompleteOrBuild("miner", "Miner", 2));
					}
					baseLv8BuildPre.AddSubTree(harvesterBuild, minerBuild);

					var baseLv8Build = new Selector();
					baseLv8Build.AddSubTree(
						this.CheckNumThenBuildCreepSequence("carrier", "Carrier", 8),
						this.CheckNumThenBuildCreepSequence("upgrader", "Upgrader", 8),
						this.CheckNumThenBuildCreepSequence("builder", "Builder", 8)
					);
				}
				baseLv8.AddSubTree(new CheckTotalEnergy(5301, 99999999), baseLv8BuildPre, baseLv8Build)
			}
			selector.AddSubTree(baseLv8, baseLv7, baseLv6, baseLv5, baseLv4, baseLv3, baseLv2, baseLv1)
		}
		sequence.AddSubTree(new LoopSleepTicks(5, true), selector)
		return sequence;
	}

	public static AIHarvester(): Tree {
		let tree = new Selector();
		tree.AddSubTree(
			new MoveAndHarvest(),
			new MoveAndTransferBackToSpawnAndExtension(),
			new MoveAndBuildConstruction(),
			new MoveAndUpgradeController(),
			new NothingToDoWarning()
		);
		return tree;
	}

	public static AIUpgrader(): Tree {
		var tree = new Selector();
		tree.AddSubTree(
			new MoveAndWithdrawEnergyFormExtensions(),
			new MoveAndHarvest(),
			new MoveAndUpgradeController(),
			new MoveAndTransferBackToSpawnAndExtension(),
			new NothingToDoWarning()
		);
		return tree;
	}

	public static AIBuilder(): Tree {
		var tree = new Selector();
		tree.AddSubTree(
			new MoveAndWithdrawEnergyFormExtensions(),
			new MoveAndHarvest(),
			new MoveAndBuildConstruction(),
			new MoveAndRepairConstruction(),
			new MoveAndUpgradeController(),
			new NothingToDoWarning()
		);
		return tree;
	}

	public static AIMiner(): Tree {
		var tree = new Selector();
		tree.AddSubTree(new MoveAndHarvest(), new NothingToDoWarning());
		return tree;
	}

	public static AICarrier(): Tree {
		let tree = new Selector();
		{
			var fromGround = new Selector();
			fromGround.AddSubTree(new MoveAndPickupEnergy(), new MoveAndTransferBackToSpawnOrExtensionOrContainer())
			var fromExtension = new Selector();
			fromExtension.AddSubTree(new MoveAndWithdrawEnergyFromContainer(), new MoveAndTransferBackToSpawnAndExtension());
		}
		tree.AddSubTree(fromGround, fromExtension, new NothingToDoWarning());
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

	private static CheckEnergyCapcityThanAdjustStrategySequence(low: number, high: number, strategyLevel: number): Tree {
		return new Sequence().AddSubTree(
			new CheckEnergyCapcity(low, high),
			new AdjustStrategy(strategyLevel)
		)
	}

}