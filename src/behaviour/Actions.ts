import Board from "./Board";
import Tree from "./Tree";
import Status from "./Status"
import { CreepConfig } from "../utils/CreepConfig"

export class BuildCreep extends Tree {
	role: string
	name: string
	level: number
	constructor(role: string, name: string, level: number) {
		super();
		this.role = role;
		this.name = name;
		this.level = level;
	}
	public Execute(): Status {
		var newName = this.name + Game.time;
		if (this.level == 1)
		{
			if(this.role == "harvester" || this.role == "upgrader" || this.role == "builder")
			{
				if (CreepConfig.BuildWorkerLv1(this.role, Board.CurrentSpawn, newName) == 0) {
					return Status.Succeed;
				}
			}
			return Status.Failure;
		}
		else if(this.level == 2)
		{
			if(this.role == "harvester" || this.role == "upgrader" || this.role == "builder")
			{
				if (CreepConfig.BuildWorkerLv2(this.role, Board.CurrentSpawn, newName) == 0) {
					return Status.Succeed;
				}
			}
			else if(this.role == "miner")
			{
				if (CreepConfig.BuildMinerLv2(Board.CurrentSpawn, newName) == 0) {
					return Status.Succeed;
				}
			}
			else if(this.role == "carrier")
			{
				if (CreepConfig.BuildCarrierLv2(Board.CurrentSpawn, newName) == 0) {
					return Status.Succeed;
				}
			}
			return Status.Failure;
		}
		return Status.Failure;
	}
}

export class CheckCreepNum extends Tree {
	role : string;
	
	constructor(role:string) {
		super();
		this.role = role;
	}
	public Execute(): Status {
		var screeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.role);
		var targetNumber = 0;
		switch (this.role) {
			case "harvester":
				targetNumber = Board.TargetHarvesterNumber;
				break;
			case "upgrader":
				targetNumber = Board.TargetUpgraderNumber;
				break;
			case "builder":
				targetNumber = Board.TargetBuilderNumber;
				break;
			case "miner":
				targetNumber = Board.TargetMinerNumber;
				break;
			case "carrier":
				targetNumber = Board.TargetCarrierNumber;
				break;
		
			default:
				return Status.Failure
		}
		if (screeps.length < targetNumber) {
			
			return Status.Succeed;
		}
		console.log(screeps.length, targetNumber)
		return Status.Failure;
	}
}

export class MoveAndHarvest extends Tree {
	public Execute(): Status {
		var creep = Board.CurrentCreep;
		if ((creep.memory.role != "miner" && creep.carry.energy >= creep.carryCapacity) || creep.memory.upgrading || creep.memory.building) {
			
			return Status.Failure;
		}

		var target = creep.pos.findClosestByRange(FIND_SOURCES);

		if (target) {
			var result = creep.harvest(target)
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
			}
			else if (result != 0) {
				console.log("MoveAndHarvest Failed", result)
				return Status.Failure;
			}
			return Status.Succeed;
		}
		// console.log("MoveAndHarvest Failed, Didn't find target to Harvest")
		return Status.Failure;
	}
}

export class MoveAndTransferBackToSpawnAndExtension extends Tree {
	public Execute(): Status {
		var creep = Board.CurrentCreep;
		var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
					structure.energy < structure.energyCapacity;
			}
		});

		if (target) {
			var result = creep.transfer(target, RESOURCE_ENERGY);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
			}
			else if (result != 0) {
				//console.log("MoveAndTransferBackToSpawnAndExtension Failed", result)
				return Status.Failure;
			}
			return Status.Succeed;
		}
		// console.log("MoveAndTransferBackToSpawnAndExtension Failed, Didn't find target to transfer")
		return Status.Failure;
	}
}

export class MoveAndPickupEnergy extends Tree {
	public Execute(): Status {
		var creep = Board.CurrentCreep;
		const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
		if(target) {
			var result = creep.pickup(target);
			if(result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
			}
			else if(result != 0)
			{
				console.log("MoveAndPickupEnergy Failed", result)
				return Status.Failure;
			}
			return Status.Succeed;
		}
		// console.log("MoveAndTransferBackToSpawnAndExtension Failed, Didn't find target to transfer")
		return Status.Failure;
	}
}

export class MoveAndUpgradeController extends Tree {
	public Execute(): Status {
		var creep = Board.CurrentCreep;
		if (creep.memory.upgrading && creep.carry.energy == 0) {
			creep.memory.upgrading = false;
			creep.say('🔄 harvest');
			return Status.Failure;
		}

		if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
			creep.memory.upgrading = true;
			creep.say('⚡ upgrade');
		}

		if (creep.memory.upgrading && creep.room.controller) {
			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
			}
			return Status.Succeed;
		}
		return Status.Failure;
	}
}

export class MoveAndBuildConstruction extends Tree {
	public Execute(): Status {
		var creep = Board.CurrentCreep;
		if (creep.memory.building && creep.carry.energy == 0) {
			creep.memory.building = false;
			creep.say('🔄 harvest');
			return Status.Failure;
		}
		if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true;
			creep.say('🚧 build');
		}

		if (creep.memory.building) {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (targets.length) {
				if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
				}
				return Status.Succeed;
			}
		}
		return Status.Failure;
	}
}

export class CheckTotalEnergy extends Tree {

	low: number;
	high: number;

	constructor(low: number, high: number) {
		super();
		this.low = low;
		this.high = high;
	}
	public Execute(): Status {
		var energyTotal = 0
		energyTotal = Board.CurrentSpawn.room.energyAvailable;
		if (energyTotal >= this.low && energyTotal < this.high) {
			return Status.Succeed;
		}
		return Status.Failure;
	}
}

export class CheckEnergyCapcity extends Tree {
	low: number;
	high: number;

	constructor(low: number, high: number) {
		super();
		this.low = low;
		this.high = high;
	}
	public Execute(): Status {
		var energyCapcity = 0
		energyCapcity = Board.CurrentSpawn.room.energyCapacityAvailable;
		if (energyCapcity >= this.low && energyCapcity < this.high) {
			return Status.Succeed;
		}
		return Status.Failure;
	}
}

export class NothingToDoWarning extends Tree {
	public Execute(): Status {
		var creep = Board.CurrentCreep;
		creep.say("Sleep!")
		return Status.Failure;
	}
}

export class AdjustStrategy extends Tree {
	strategyLevel:number
	constructor(level:number) {
		super();
		this.strategyLevel = level;
	}
	public Execute(): Status {
		switch (this.strategyLevel) {
			case 1:
				Board.TargetHarvesterNumber = 3;
				Board.TargetUpgraderNumber = 3;
				Board.TargetBuilderNumber = 3;
				Board.TargetMinerNumber = 0;
				Board.TargetCarrierNumber = 0;
				break;
			case 2:
				Board.TargetHarvesterNumber = 1;
				Board.TargetUpgraderNumber = 1;
				Board.TargetBuilderNumber = 1;
				Board.TargetMinerNumber = 2;
				Board.TargetCarrierNumber = 4;
			case 3:
				Board.TargetHarvesterNumber = 1;
				Board.TargetUpgraderNumber = 1;
				Board.TargetBuilderNumber = 1;
				Board.TargetMinerNumber = 2;
				Board.TargetCarrierNumber = 4;
			default:
				return Status.Failure;
		}
		return Status.Succeed;
	}
}