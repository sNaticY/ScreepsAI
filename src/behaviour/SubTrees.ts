import Tree from "./Tree";
import Board from "./Board"
import Sequence from "./Sequence";
import Status from "./Status";

import { 
	CheckCreepNum, 
	BuildCreep, 
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
	MoveAndTransferBackToExtensionOrContainer,
	AdjustStrategy,
	LogAction,
} from "./Actions";

import Selector from "./Selector";
import ReverseSelector from "./ReverseSelector";

export default class SubTrees {

	public static AIBrain(): Tree {
		var selector = new Selector();
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
		selector.SubTrees.push(setLv1, setLv2, setLv3, setLv4);
		return selector;
	}

	public static AISpawn(): Tree {
		var selector = new Selector();
		{
			var baseLv1 = new Sequence();
			{
				var baseLv1Build = new Selector();
				{
					var harvesterBuild = new Sequence();
					harvesterBuild.SubTrees.push(new CheckCreepNum("harvester", 1), new BuildCreep("harvester", "Havester", 1));
					var upgraderBuild = new Sequence();
					upgraderBuild.SubTrees.push(new CheckCreepNum("upgrader", 1), new BuildCreep("upgrader", "Upgrader", 1));
					var builderBuild = new Sequence();
					builderBuild.SubTrees.push(new CheckCreepNum("builder", 1), new BuildCreep("builder", "Builder", 1));
				}
				baseLv1Build.SubTrees.push(harvesterBuild, upgraderBuild, builderBuild);
			}
			baseLv1.SubTrees.push(new CheckTotalEnergy(0, 301), baseLv1Build)

			var baseLv2 = new Sequence();
			{
				var baseLv2BuildPre = new ReverseSelector();
				{
					var harvesterBuild = new Selector()
					{
						var harvesterLv2 = new Sequence();
						harvesterLv2.SubTrees.push(new CheckCreepNum("harvester", 0), new BuildCreep("harvester", "Havester", 2));
						var harvesterLv1 = new Sequence();
						harvesterLv1.SubTrees.push(new CheckCreepNum("harvester", 0), new BuildCreep("harvester", "Havester", 1));
					}
					harvesterBuild.SubTrees.push(harvesterLv2, harvesterLv1);
					var minerBuild = new Sequence();
					minerBuild.SubTrees.push(new CheckCreepNum("miner", 2), new BuildCreep("miner", "Miner", 2));
				}
				baseLv2BuildPre.SubTrees.push(harvesterBuild, minerBuild);
				var baseLv2Build = new Selector();
				{
					var carrierBuild = new Sequence();
					carrierBuild.SubTrees.push(new CheckCreepNum("carrier", 2), new BuildCreep("carrier", "Carrier", 2));
					var upgraderBuild = new Sequence();
					upgraderBuild.SubTrees.push(new CheckCreepNum("upgrader", 2), new BuildCreep("upgrader", "Upgrader", 2));
					var builderBuild = new Sequence();
					builderBuild.SubTrees.push(new CheckCreepNum("builder", 2), new BuildCreep("builder", "Builder", 2));
				}
				baseLv2Build.SubTrees.push(carrierBuild, upgraderBuild, builderBuild)
			}
			baseLv2.SubTrees.push(new CheckTotalEnergy(301, 551), baseLv2BuildPre, new LogAction("Pre passed",Status.Succeed), baseLv2Build)

			var baseLv3 = new Sequence();
			{
				var baseLv3BuildPre = new ReverseSelector();
				{
					var harvesterBuild = new Selector();
					{
						var harvestLv3 = new Sequence();
						harvestLv3.SubTrees.push(new CheckCreepNum("harvester", 0), new BuildCreep("harvester", "Havester", 3));
						var harvestLv2 = new Sequence();
						harvestLv2.SubTrees.push(new CheckCreepNum("harvester", 0), new BuildCreep("harvester", "Havester", 2));
						var harvestLv1 = new Sequence();
						harvestLv1.SubTrees.push(new CheckCreepNum("harvester", 0), new BuildCreep("harvester", "Havester", 1));
					}
					harvesterBuild.SubTrees.push(harvestLv3, harvestLv2, harvestLv1);
					var minerBuild = new Sequence();
					minerBuild.SubTrees.push(new CheckCreepNum("miner", 2), new BuildCreep("miner", "Miner", 2));
				}
				baseLv3BuildPre.SubTrees.push(harvesterBuild, minerBuild);

				var baseLv3Build = new Selector();
				{
					var carrierBuild = new Sequence();
					carrierBuild.SubTrees.push(new CheckCreepNum("carrier", 3), new BuildCreep("carrier", "Carrier", 3));
					var upgraderBuild = new Sequence();
					upgraderBuild.SubTrees.push(new CheckCreepNum("upgrader", 3), new BuildCreep("upgrader", "Upgrader", 3));
					var builderBuild = new Sequence();
					builderBuild.SubTrees.push(new CheckCreepNum("builder", 3), new BuildCreep("builder", "Builder", 3));
				}
				baseLv3Build.SubTrees.push(carrierBuild, upgraderBuild, builderBuild)
			}
			baseLv3.SubTrees.push(new CheckTotalEnergy(551, 801),baseLv3BuildPre, baseLv3Build)

			var baseLv4 = new Sequence();
			{
				var baseLv4BuildPre = new ReverseSelector();
				{
					var harvesterBuild = new Selector();
					{
						var harvestLv4 = new Sequence();
						harvestLv4.SubTrees.push(new CheckCreepNum("harvester", 0), new BuildCreep("harvester", "Havester", 4));
						var harvestLv3 = new Sequence();
						harvestLv3.SubTrees.push(new CheckCreepNum("harvester", 0), new BuildCreep("harvester", "Havester", 3));
						var harvestLv2 = new Sequence();
						harvestLv2.SubTrees.push(new CheckCreepNum("harvester", 0), new BuildCreep("harvester", "Havester", 2));
						var harvestLv1 = new Sequence();
						harvestLv1.SubTrees.push(new CheckCreepNum("harvester", 0), new BuildCreep("harvester", "Havester", 1));
					}
					harvesterBuild.SubTrees.push(harvestLv4, harvestLv3, harvestLv2, harvestLv1);
					var minerBuild = new Sequence();
					minerBuild.SubTrees.push(new CheckCreepNum("miner", 2), new BuildCreep("miner", "Miner", 2));
				}
				baseLv4BuildPre.SubTrees.push(harvesterBuild, minerBuild);

				var baseLv4Build = new Selector();
				{
					var carrierBuild = new Sequence();
					carrierBuild.SubTrees.push(new CheckCreepNum("carrier", 4), new BuildCreep("carrier", "Carrier", 4));
					var upgraderBuild = new Sequence();
					upgraderBuild.SubTrees.push(new CheckCreepNum("upgrader", 4), new BuildCreep("upgrader", "Upgrader", 4));
					var builderBuild = new Sequence();
					builderBuild.SubTrees.push(new CheckCreepNum("builder", 4), new BuildCreep("builder", "Builder", 4));
				}
				baseLv4Build.SubTrees.push(carrierBuild, upgraderBuild, builderBuild)
			}
			baseLv4.SubTrees.push(new CheckTotalEnergy(801, 1301),baseLv4BuildPre, baseLv4Build)
		}
		selector.SubTrees.push(baseLv4, baseLv3, baseLv2, baseLv1)
		return selector;
	}

	public static AIHarvester(): Tree {
		let tree = new Selector();
		tree.SubTrees.push(new MoveAndHarvest(), new MoveAndTransferBackToSpawnAndExtension(), new MoveAndBuildConstruction(), new MoveAndUpgradeController(), new NothingToDoWarning());
		return tree;
	}

	public static AIUpgrader(): Tree {
		var tree = new Selector();
		tree.SubTrees.push(new MoveAndWithdrawEnergyFormExtensions(), new MoveAndHarvest(), new MoveAndUpgradeController(), new MoveAndTransferBackToSpawnAndExtension(), new NothingToDoWarning());
		return tree;
	}

	public static AIBuilder() : Tree {
		var tree = new Selector();
		tree.SubTrees.push(new MoveAndWithdrawEnergyFormExtensions(), new MoveAndHarvest(), new MoveAndBuildConstruction(), new MoveAndRepairConstruction(), new MoveAndUpgradeController(), new NothingToDoWarning());
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
			fromGround.SubTrees.push(new MoveAndPickupEnergy(), new MoveAndTransferBackToExtensionOrContainer())
			var fromExtension = new Selector();
			fromExtension.SubTrees.push(new MoveAndWithdrawEnergyFromContainer(), new MoveAndTransferBackToSpawnAndExtension());
		}
		tree.SubTrees.push(fromGround, fromExtension, new NothingToDoWarning());
		return tree;
	}
}