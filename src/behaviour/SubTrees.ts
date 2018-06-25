import Tree from "./Tree";
import Board from "./Board"
import Sequence from "./Sequence";
import Status from "./Status";

import {
	CheckCreepNum,
	CompleteCreepNumber, 
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
	ResultAction,
	LogAction,
	TryBuildCreep,
} from "./Actions";

import Selector from "./Selector";
import ReverseSelector from "./ReverseSelector";

export default class SubTrees {

	public static AIBrain(): Tree {
		var sequence = new Sequence();
		{
			var energyLevelSelecter = new Selector();
			{
				var setLv1 = new Sequence();
				{
					var check = new CheckEnergyCapcity(0,500)
					var adjust = new AdjustStrategy(1);
				}
				setLv1.SubTrees.push(check, adjust);
				var setLv2 = new Sequence();
				{
					var check = new CheckEnergyCapcity(500,750)
					var adjust = new AdjustStrategy(2);
				}
				setLv2.SubTrees.push(check, adjust);
				var setLv3 = new Sequence();
				{
					var check = new CheckEnergyCapcity(750,1200)
					var adjust = new AdjustStrategy(3);
				}
				setLv3.SubTrees.push(check, adjust);
				var setLv4 = new Sequence();
				{
					var check = new CheckEnergyCapcity(1200, 1700)
					var adjust = new AdjustStrategy(4);
				}
				setLv4.SubTrees.push(check, adjust);
			}
			energyLevelSelecter.SubTrees.push(setLv1, setLv2, setLv3, setLv4);

		}
		sequence.SubTrees.push(energyLevelSelecter)
		return sequence;
	}

	public static AISpawn(): Tree {
		var selector = new Selector();
		{
			var baseLv1 = new Sequence();
			{
				var baseLv1Build = new Selector();
				baseLv1Build.SubTrees.push(
					new TryBuildCreep("harvester", "Havester", 1),  
					new TryBuildCreep("upgrader", "Upgrader", 1), 
					new TryBuildCreep("builder", "Builder", 1)
				);
			}
			baseLv1.SubTrees.push(new CheckTotalEnergy(0, 301), baseLv1Build, new ResultAction(true));

			var baseLv2 = new Sequence();
			{
				var baseLv2BuildPre = new Sequence();
				{
					var harvesterBuild = new Selector()
					harvesterBuild.SubTrees.push(
						new TryBuildCreep("harvester", "Havester", 2), 
						new TryBuildCreep("harvester", "Havester", 1), 
						new ResultAction(true)
					);
					var minerBuild = new Sequence();
					minerBuild.SubTrees.push(new CompleteCreepNumber("miner", "Miner", 2));
				}
				baseLv2BuildPre.SubTrees.push(harvesterBuild, minerBuild);
				var baseLv2Build = new Selector();
				baseLv2Build.SubTrees.push(
					new TryBuildCreep("carrier", "Carrier", 2), 
					new TryBuildCreep("upgrader", "Upgrader", 2), 
					new TryBuildCreep("builder", "Builder", 2)
				)
			}
			baseLv2.SubTrees.push(new CheckTotalEnergy(301, 551), baseLv2BuildPre, baseLv2Build, new ResultAction(true))

			var baseLv3 = new Sequence();
			{
				var baseLv3BuildPre = new Sequence();
				{
					var harvesterBuild = new Selector();
					harvesterBuild.SubTrees.push(
						new TryBuildCreep("harvester", "Havester", 3), 
						new TryBuildCreep("harvester", "Havester", 2), 
						new TryBuildCreep("harvester", "Havester", 1), 
						new ResultAction(true)
					);
					var minerBuild = new Sequence();
					minerBuild.SubTrees.push(new CompleteCreepNumber("miner", "Miner", 2));
				}
				baseLv3BuildPre.SubTrees.push(harvesterBuild, minerBuild);

				var baseLv3Build = new Selector();
				{
					var carrierBuild = new Sequence();
					carrierBuild.SubTrees.push(new TryBuildCreep("carrier", "Carrier", 3));
					var upgraderBuild = new Sequence();
					upgraderBuild.SubTrees.push(new TryBuildCreep("upgrader", "Upgrader", 3));
					var builderBuild = new Sequence();
					builderBuild.SubTrees.push(new TryBuildCreep("builder", "Builder", 3));
				}
				baseLv3Build.SubTrees.push(carrierBuild, upgraderBuild, builderBuild)
			}
			baseLv3.SubTrees.push(new CheckTotalEnergy(551, 801), baseLv3BuildPre, baseLv3Build, new ResultAction(true))

			var baseLv4 = new Sequence();
			{
				var baseLv4BuildPre = new Sequence();
				{
					var harvesterBuild = new Selector();
					harvesterBuild.SubTrees.push(
						new TryBuildCreep("harvester", "Havester", 4), 
						new TryBuildCreep("harvester", "Havester", 3), 
						new TryBuildCreep("harvester", "Havester", 2), 
						new TryBuildCreep("harvester", "Havester", 1), 
						new ResultAction(true)
					);
					var minerBuild = new Sequence();
					minerBuild.SubTrees.push(new CompleteCreepNumber("miner", "Miner", 2));
				}
				baseLv4BuildPre.SubTrees.push(harvesterBuild, minerBuild);

				var baseLv4Build = new Selector();
				baseLv4Build.SubTrees.push(
					new TryBuildCreep("carrier", "Carrier", 4), 
					new TryBuildCreep("upgrader", "Upgrader", 4), 
					new TryBuildCreep("builder", "Builder", 4)
				);
			}
			baseLv4.SubTrees.push(new CheckTotalEnergy(801, 1301),baseLv4BuildPre, baseLv4Build)
		}
		selector.SubTrees.push(baseLv4, baseLv3, baseLv2, baseLv1)
		return selector;
	}

	public static AIHarvester(): Tree {
		let tree = new Selector();
		tree.SubTrees.push(
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
		tree.SubTrees.push(
			new MoveAndWithdrawEnergyFormExtensions(), 
			new MoveAndHarvest(), 
			new MoveAndUpgradeController(), 
			new MoveAndTransferBackToSpawnAndExtension(), 
			new NothingToDoWarning()
		);
		return tree;
	}

	public static AIBuilder() : Tree {
		var tree = new Selector();
		tree.SubTrees.push(
			new MoveAndWithdrawEnergyFormExtensions(), 
			new MoveAndHarvest(), 
			new MoveAndBuildConstruction(), 
			new MoveAndRepairConstruction(), 
			new MoveAndUpgradeController(), 
			new NothingToDoWarning()
		);
		return tree;
	}

	public static AIMiner() : Tree {
		var tree = new Selector();
		tree.SubTrees.push(new MoveAndHarvest(), new NothingToDoWarning());
		return tree;
	}

	public static AICarrier() : Tree {
		let tree = new Selector();
		{
			var fromGround = new Selector();
			fromGround.SubTrees.push(new MoveAndPickupEnergy(), new MoveAndTransferBackToSpawnOrExtensionOrContainer())
			var fromExtension = new Selector();
			fromExtension.SubTrees.push(new MoveAndWithdrawEnergyFromContainer(), new MoveAndTransferBackToSpawnAndExtension());
		}
		tree.SubTrees.push(fromGround, fromExtension, new NothingToDoWarning());
		return tree;
	}
}