import Tree from "./Tree";
import Board from "./Board"
import Sequence from "./Sequence";

import { 
	CheckCreepNum, 
	BuildCreep, 
	MoveAndHarvest, 
	MoveAndTransferBackToSpawnAndExtension, 
	NothingToDoWarning, 
	MoveAndUpgradeController, 
	MoveAndBuildConstruction,
	CheckEnergyCapcity,
	CheckTotalEnergy,
	MoveAndPickupEnergy,
	AdjustStrategy
} from "./Actions";

import Selector from "./Selector";

export default class SubTrees {

	public static AIBrain(): Tree {
		var selector = new Selector();
		{
			var setLv1 = new Sequence();
			{
				var check = new CheckEnergyCapcity(0,301)
				var adjust = new AdjustStrategy(1);
			}
			setLv1.SubTrees.push(check, adjust);
			var setLv2 = new Sequence();
			{
				var check = new CheckEnergyCapcity(301,551)
				var adjust = new AdjustStrategy(2);
			}
			setLv2.SubTrees.push(check, adjust);
			var setLv3 = new Sequence();
			{
				var check = new CheckEnergyCapcity(551,801)
				var adjust = new AdjustStrategy(3);
			}
			setLv3.SubTrees.push(check, adjust);
		}
		selector.SubTrees.push(setLv1, setLv2, setLv3);
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
					harvesterBuild.SubTrees.push(new CheckCreepNum("harvester"), new BuildCreep("harvester", "Havester", 1));
					var upgraderBuild = new Sequence();
					upgraderBuild.SubTrees.push(new CheckCreepNum("upgrader"), new BuildCreep("upgrader", "Upgrader", 1));
					var builderBuild = new Sequence();
					builderBuild.SubTrees.push(new CheckCreepNum("builder"), new BuildCreep("builder", "Builder", 1));
				}
				baseLv1Build.SubTrees.push(harvesterBuild, upgraderBuild, builderBuild);
			}
			baseLv1.SubTrees.push(new CheckTotalEnergy(0, 301), baseLv1Build)

			var baseLv2 = new Sequence();
			{
				var baseLv2Build = new Selector();
				{
					var minerBuild = new Sequence();
					minerBuild.SubTrees.push(new CheckCreepNum("miner"), new BuildCreep("miner", "Miner", 2));
					var carrierBuild = new Sequence();
					carrierBuild.SubTrees.push(new CheckCreepNum("carrier"), new BuildCreep("carrier", "Carrier", 2));
					var upgraderBuild = new Sequence();
					upgraderBuild.SubTrees.push(new CheckCreepNum("upgrader"), new BuildCreep("builder", "Builder", 2));
					var builderBuild = new Sequence();
					builderBuild.SubTrees.push(new CheckCreepNum("builder"), new BuildCreep("builder", "Builder", 2));
				}
				baseLv2Build.SubTrees.push(minerBuild, carrierBuild, upgraderBuild, builderBuild)
			}
			baseLv2.SubTrees.push(new CheckTotalEnergy(301, 551), baseLv2Build)

			var baseLv3 = new Sequence();
			{
				var baseLv3Build = new Selector();
				{
					var minerBuild = new Sequence();
					minerBuild.SubTrees.push(new CheckCreepNum("miner"), new BuildCreep("miner", "Miner", 2));
					var carrierBuild = new Sequence();
					carrierBuild.SubTrees.push(new CheckCreepNum("carrier"), new BuildCreep("carrier", "Carrier", 2));
					var upgraderBuild = new Sequence();
					upgraderBuild.SubTrees.push(new CheckCreepNum("upgrader"), new BuildCreep("builder", "Builder", 2));
					var builderBuild = new Sequence();
					builderBuild.SubTrees.push(new CheckCreepNum("builder"), new BuildCreep("builder", "Builder", 2));
				}
				baseLv3Build.SubTrees.push(minerBuild, carrierBuild, upgraderBuild, builderBuild)
			}
			baseLv3.SubTrees.push(new CheckTotalEnergy(551, 99999), baseLv3Build)
		}
		selector.SubTrees.push(baseLv3, baseLv2, baseLv1)
		return selector;
	}

	public static AIHarvester(): Tree {
		let tree = new Selector();
		tree.SubTrees.push(new MoveAndHarvest(), new MoveAndTransferBackToSpawnAndExtension(), new MoveAndBuildConstruction(), new MoveAndUpgradeController(), new NothingToDoWarning());
		return tree;
	}

	public static AIUpgrader(): Tree {
		var tree = new Selector();
		tree.SubTrees.push(new MoveAndHarvest(), new MoveAndUpgradeController(), new MoveAndTransferBackToSpawnAndExtension(), new NothingToDoWarning());
		return tree;
	}

	public static AIBuilder() : Tree {
		var tree = new Selector();
		tree.SubTrees.push(new MoveAndHarvest(), new MoveAndBuildConstruction(), new MoveAndUpgradeController(), new NothingToDoWarning());
		return tree;
	}

	public static AIMiner() : Tree {
		var tree = new Selector();
		tree.SubTrees.push(new MoveAndHarvest(), new NothingToDoWarning());
		return tree;
	}

	public static AICarrier() : Tree {
		let tree = new Selector();
		tree.SubTrees.push(new MoveAndPickupEnergy(), new MoveAndTransferBackToSpawnAndExtension(), new NothingToDoWarning());
		return tree;
	}
}