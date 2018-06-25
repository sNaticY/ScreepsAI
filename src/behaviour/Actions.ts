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
		var newName = "LV"+ this.level + "-" + this.name + "-" + Game.time;
		var returnCode :ScreepsReturnCode = -15;
		if (this.level == 1)
		{
			if(this.role == "harvester" || this.role == "upgrader" || this.role == "builder")
			{
				returnCode = CreepConfig.BuildWorkerLv1(this.role, Board.CurrentSpawn, newName);
			}
			else{
				return Status.Failure;
			}
		}
		else if(this.level == 2)
		{
			if(this.role == "harvester" || this.role == "upgrader" || this.role == "builder")
			{
				returnCode = CreepConfig.BuildWorkerLv2(this.role, Board.CurrentSpawn, newName);
			}
			else if(this.role == "miner")
			{
				returnCode = CreepConfig.BuildMinerLv2(Board.CurrentSpawn, newName);
			}
			else if(this.role == "carrier")
			{
				returnCode = CreepConfig.BuildCarrierLv2(Board.CurrentSpawn, newName);
			}
			else{
				return Status.Failure;
			}
		}
		else if(this.level == 3)
		{
			if(this.role == "harvester" || this.role == "upgrader" || this.role == "builder")
			{
				returnCode = CreepConfig.BuildWorkerLv3(this.role, Board.CurrentSpawn, newName);
			}
			else if(this.role == "miner")
			{
				returnCode = CreepConfig.BuildMinerLv2(Board.CurrentSpawn, newName)
			}
			else if(this.role == "carrier")
			{
				returnCode = CreepConfig.BuildCarrierLv3(Board.CurrentSpawn, newName);
			}
			else{
				return Status.Failure;
			}
		}
		else if(this.level == 4)
		{
			if(this.role == "harvester" || this.role == "upgrader" || this.role == "builder")
			{
				returnCode = CreepConfig.BuildWorkerLv4(this.role, Board.CurrentSpawn, newName);
			}
			else if(this.role == "miner")
			{
				returnCode = CreepConfig.BuildMinerLv2(Board.CurrentSpawn, newName)
			}
			else if(this.role == "carrier")
			{
				returnCode = CreepConfig.BuildCarrierLv4(Board.CurrentSpawn, newName);
			}
			else{
				return Status.Failure;
			}
		}
		else{
			return Status.Failure;
		}
		if(returnCode == 0)
		{
			return Status.Succeed;
		}
		else{
			console.log("Try Build Creep" + newName + " Failed code = " + returnCode);
			return Status.Failure;
		}
	}
}

export class CheckCreepNum extends Tree {
	role : string;
	level: number
	
	constructor(role:string, level:number) {
		super();
		this.role = role;
		this.level = level;
	}
	public Execute(): Status {
		var screeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.role &&(this.level == 0|| creep.memory.level == this.level));
		var targetNumber = Board.CreepNumber[this.role][this.level];
		console.log("Need Role", this.role, "\t[level", this.level,"]", targetNumber, "\thave", screeps.length )
		if (screeps.length < targetNumber) {
			return Status.Succeed;
		}
		return Status.Failure;
	}
}

export class MoveAndHarvest extends Tree {
	public Execute(): Status {
		var creep = Board.CurrentCreep;
		if ((creep.memory.role != "miner" && creep.carry.energy >= creep.carryCapacity) || creep.memory.upgrading || creep.memory.building || creep.memory.transfering) {
			
			return Status.Failure;
		}

		var targets = creep.room.find(FIND_SOURCES);

		if (targets.length > 0) {
			var target = targets[creep.memory.harvestIndex%2==0?0:1];
			var result = creep.harvest(target);
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
		if (creep.memory.transfering && creep.carry.energy == 0) {
			creep.memory.transfering = false;
			creep.say('🔄 harvest');
			return Status.Failure;
		}

		if (!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
			creep.memory.transfering = true;
			creep.say('⚡ transfering');
		}
		if(creep.memory.transfering)
		{
			var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => {
					return (((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
						structure.energy < structure.energyCapacity));
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
			else{
				creep.memory.fromContainer = false;
			}
		}
		// console.log("MoveAndTransferBackToSpawnAndExtension Failed, Didn't find target to transfer")
		return Status.Failure;
	}
}

export class MoveAndTransferBackToExtensionOrContainer extends Tree {
	public Execute(): Status {
		var creep = Board.CurrentCreep;
		if(creep.memory.fromContainer)
		{
			console.log("creep.memory.fromContainer")
			return Status.Failure;
		}
		if (creep.memory.transfering && creep.carry.energy == 0) {
			creep.memory.transfering = false;
			creep.say('🔄 harvest');
			return Status.Failure;
		}

		if (!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
			creep.memory.transfering = true;
			creep.say('⚡ transfering');
		}
		if(creep.memory.transfering)
		{
			var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => {
					return (((structure.structureType == STRUCTURE_EXTENSION) &&
						structure.energy < structure.energyCapacity) || (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity));
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
		}
		// console.log("MoveAndTransferBackToSpawnAndExtension Failed, Didn't find target to transfer")
		return Status.Failure;
	}
}

export class MoveAndPickupEnergy extends Tree {
	public Execute(): Status {
		var creep = Board.CurrentCreep;
		if(creep.carry.energy >= creep.carryCapacity || creep.memory.upgrading || creep.memory.building || creep.memory.transfering) {
			
			return Status.Failure;
		}
		const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: (resource) => {
			return resource.resourceType == RESOURCE_ENERGY && resource.amount >= 600
		}});
		if(target) {
			var result = creep.pickup(target);
			if(result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
			}
			else if(result == 0)
			{
				creep.memory.fromContainer = false;
			}
			else
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

export class MoveAndWithdrawEnergyFromContainer extends Tree {
	public Execute(): Status {
		var creep = Board.CurrentCreep;
		if (creep.carry.energy >= creep.carryCapacity || creep.memory.upgrading || creep.memory.building || creep.memory.transfering) {
			
			return Status.Failure;
		}

		var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER) &&
					structure.store[RESOURCE_ENERGY] > 0;
			}
		});
		
		if (target) {
			var result = creep.withdraw(target, RESOURCE_ENERGY);
			if( result == 0)
			{
				creep.memory.fromContainer = true;
			}
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

export class MoveAndWithdrawEnergyFormExtensions extends Tree{
	public Execute(): Status {
		var creep = Board.CurrentCreep;
		if (creep.carry.energy >= creep.carryCapacity || creep.memory.upgrading || creep.memory.building) {
			
			return Status.Failure;
		}

		var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_EXTENSION) &&
					structure.energy > 0;
			}
		});
		
		if (target) {
			var result = creep.withdraw(target, RESOURCE_ENERGY);
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
			var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
			if (target) {
				if (creep.build(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
				}
				return Status.Succeed;
			}
		}
		return Status.Failure;
	}
}

export class MoveAndRepairConstruction extends Tree {
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
			const targets = creep.room.find(FIND_STRUCTURES, {
				filter: object => object.hits < object.hitsMax
			});
			
			targets.sort((a,b) => a.hits - b.hits);
			
			if(targets.length > 0) {
				if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0]);
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

export class LogAction extends Tree {
	log : string
	result : Status;
	constructor(log:string, result:Status) {
		super();
		this.log = log;
		this.result = result;
	}
	public Execute(): Status {
		console.log(this.log);
		return this.result;
	}
}

export class AdjustStrategy extends Tree {
	strategyLevel:number
	constructor(level:number) {
		super();
		this.strategyLevel = level;
	}
	public Execute(): Status {
		console.log("SetLevel = ", this.strategyLevel, "Current Energy = ", Board.CurrentSpawn.room.energyAvailable)
		switch (this.strategyLevel) {
			case 1:
				Board.CreepNumber["harvester"] = [0, 3, 0, 0, 0];
				Board.CreepNumber["upgrader"] = [0, 3, 0, 0, 0];
				Board.CreepNumber["builder"] = [0, 3, 0, 0, 0];
				Board.CreepNumber["miner"] = [0, 0, 0, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 0, 0, 0];
				break;
			case 2:
				Board.CreepNumber["harvester"] = [1, 1, 1, 0, 0];
				Board.CreepNumber["upgrader"] = [0, 0, 3, 0, 0];
				Board.CreepNumber["builder"] = [0, 0, 3, 0, 0];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 4, 0, 0];
				break;
			case 3:
				Board.CreepNumber["harvester"] = [1, 1, 1, 1, 0];
				Board.CreepNumber["upgrader"] = [0, 0, 1, 3, 0];
				Board.CreepNumber["builder"] = [0, 0, 1, 3, 0];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 1, 3, 0];
				break;
			case 4:
				Board.CreepNumber["harvester"] = [1, 1, 1, 1, 1];
				Board.CreepNumber["upgrader"] = [0, 0, 1, 0, 3];
				Board.CreepNumber["builder"] = [0, 0, 1, 0, 3];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 1, 0, 2];
				break;
			default:
				return Status.Failure;
		}
		return Status.Succeed;
	}
}