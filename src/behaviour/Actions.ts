import Board from "./Board";
import Tree from "./Tree";
import Status from "./Status"
import { BuildHelper } from "../utils/BuildHelper"
import { List } from "lodash"

export class LoopSleepTicks extends Tree {
	tick: number = 0;
	maxTick: number;
	afterResult: boolean;

	constructor(tick: number, afterResult: boolean) {
		super();
		this.maxTick = tick;
		this.afterResult = afterResult;
	}

	public Execute() {
		this.tick++;
		if(this.tick >= this.maxTick)
		{
			this.tick = 0;
			return this.afterResult?Status.Succeed :Status.Failure;
		}
		else
		{
			return this.afterResult?Status.Failure:Status.Succeed;
		}
	}
}

export class CheckFlag extends Tree {
	x: number = 1;
	y: number = 1;
	checkNum: number = 0;

	minPath: number = 9999;
	minPathX: number = 0;
	minPathY: number = 0;

	resultPath: PathStep[] = [];

	finish: boolean = false;
	public Execute(): Status {
		if (this.finish) {
			return Status.Succeed;
		}
		var room = Board.CurrentSpawn.room;
		if (Game.flags["MinFlag"]) {
			Game.flags["MinFlag"].remove();
		}

		if (!room.controller) {
			return Status.Failure;
		}

		var targets: List<RoomPosition> = [
			room.find(FIND_SOURCES)[0].pos,
			room.find(FIND_SOURCES)[1].pos,
			Board.CurrentSpawn.pos,
			room.controller.pos,
		]

		for (let i = 0; i < 25;) {
			var pos = room.getPositionAt(this.x, this.y);
			if (pos) {
				var terrain = Game.map.getTerrainAt(this.x, this.y, room.name);
				if (terrain != "wall") {
					var totalLength: number = 0;
					for (let j = 0; j < targets.length; j++) {
						const target = targets[j];
						var length = room.findPath(pos, target).length;
						totalLength += length;
					}
					if (totalLength < this.minPath) {
						this.minPath = totalLength;
						this.minPathX = this.x;
						this.minPathY = this.y;
					}
					console.log("x = ", this.x, " y = ", this.y," length = ", totalLength);
					i++;
				}
				if (this.x + 1 == 50) {
					this.x = 1;
					if (this.y + 1 == 50) {
						this.finish = true;
						room.createFlag(this.minPathX, this.minPathY, "MinFlag");
						var minPosition = room.getPositionAt(this.minPathX, this.minPathY)
						if(minPosition)
						{
							for (let j = 0; j < targets.length; j++) {
								const target = targets[j];
								var path = room.findPath(minPosition, target);
								for (let k = 0; k < path.length; k++) {
									const roadPos = path[k];
									room.createConstructionSite(roadPos.x, roadPos.y, STRUCTURE_ROAD);

									
								}

								for(let k = 0; k < path.length; k++){
									const roadPos = path[k];
									if(room.createConstructionSite(roadPos.x - 1, roadPos.y - 1, STRUCTURE_ROAD) == 0){
										continue;
									}
									if(room.createConstructionSite(roadPos.x - 1, roadPos.y + 1, STRUCTURE_ROAD) == 0){
										continue;
									}
									if(room.createConstructionSite(roadPos.x + 1, roadPos.y - 1, STRUCTURE_ROAD) == 0){
										continue;
									}
									if(room.createConstructionSite(roadPos.x + 1, roadPos.y + 1, STRUCTURE_ROAD) == 0){
										continue;
									}
								}
							}
						}
					}
					else {
						this.y++;
					}
				}
				else {
					this.x++;
				}
			}
		}
		return Status.Succeed;
	}
}

export class CompleteCreepNumber extends Tree {
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
		var number = BaseActions.GetCreepNumber(this.role, this.level);
		var targetNumber = Board.CreepNumber[this.role][this.level];
		if (number >= targetNumber) {
			return Status.Succeed;
		}

		console.log("Need Role", this.role, "\t[level", this.level, "]", targetNumber, "\thave", number)
		BaseActions.BuildCreep(this.role, this.name, this.level);
		return Status.Failure;
	}
}

export class TryBuildCreep extends Tree {
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
		var number = BaseActions.GetCreepNumber(this.role, this.level);
		var targetNumber = Board.CreepNumber[this.role][this.level];
		if (number >= targetNumber) {
			return Status.Failure;
		}
		console.log("Need Role", this.role, "\t[level", this.level, "]", targetNumber, "\thave", number)
		return BaseActions.BuildCreep(this.role, this.name, this.level);
	}
}

export class CheckCreepNum extends Tree {
	role: string;
	level: number
	isTrue: boolean

	constructor(role: string, level: number, isTrueWhenEqual: boolean) {
		super();
		this.role = role;
		this.level = level;
		this.isTrue = isTrueWhenEqual;
	}
	public Execute(): Status {
		var screeps = _.filter(Game.creeps, (creep) => creep.memory.role == this.role && (this.level == 0 || creep.memory.level == this.level));
		var targetNumber = Board.CreepNumber[this.role][this.level];
		console.log("Need Role", this.role, "\t[level", this.level, "]", targetNumber, "\thave", screeps.length)
		if (screeps.length < targetNumber) {
			return this.isTrue ? Status.Failure : Status.Succeed;
		}
		return this.isTrue ? Status.Succeed : Status.Failure;
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
			var target = targets[creep.memory.harvestIndex % 2 == 0 ? 0 : 1];
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
		if (creep.memory.transfering) {
			var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => {
					return (((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
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
			else {
				creep.memory.fromContainer = false;
			}
		}
		// console.log("MoveAndTransferBackToSpawnAndExtension Failed, Didn't find target to transfer")
		return Status.Failure;
	}
}

export class MoveAndTransferBackToSpawnOrExtensionOrContainer extends Tree {
	public Execute(): Status {
		var creep = Board.CurrentCreep;
		if (creep.memory.fromContainer) {
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
		if (creep.memory.transfering) {
			var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => {
					return (((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
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
		if (creep.carry.energy >= creep.carryCapacity || creep.memory.upgrading || creep.memory.building || creep.memory.transfering) {

			return Status.Failure;
		}
		const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
			filter: (resource) => {
				return resource.resourceType == RESOURCE_ENERGY && resource.amount >= 600
			}
		});
		if (target) {
			var result = creep.pickup(target);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
			}
			else if (result == 0) {
				creep.memory.fromContainer = false;
			}
			else {
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
			if (result == 0) {
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

export class MoveAndWithdrawEnergyFormExtensions extends Tree {
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

			targets.sort((a, b) => a.hits - b.hits);

			if (targets.length > 0) {
				if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
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
	log: string
	result: Status;
	constructor(log: string, result: Status) {
		super();
		this.log = log;
		this.result = result;
	}
	public Execute(): Status {
		console.log(this.log);
		return this.result;
	}
}

export class ResultAction extends Tree {
	result: boolean
	constructor(result: boolean) {
		super();
		this.result = result;
	}
	public Execute(): Status {
		return this.result ? Status.Succeed : Status.Failure;
	}
}

export class AdjustStrategy extends Tree {
	constructor(level: number) {
		super();
		Board.EnconemyLevel = level;
	}
	public Execute(): Status {
		console.log("SetLevel = ", Board.EnconemyLevel, "Current Energy = ", Board.CurrentSpawn.room.energyAvailable)
		switch (Board.EnconemyLevel) {
			case 1:
				Board.CreepNumber["harvester"] = [0, 3, 0, 0, 0];
				Board.CreepNumber["upgrader"] = [0, 3, 0, 0, 0];
				Board.CreepNumber["builder"] = [0, 3, 0, 0, 0];
				Board.CreepNumber["miner"] = [0, 0, 0, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 0, 0, 0];
				break;
			case 2:
				Board.CreepNumber["harvester"] = [0, 1, 1, 0, 0];
				Board.CreepNumber["upgrader"] = [0, 0, 3, 0, 0];
				Board.CreepNumber["builder"] = [0, 0, 3, 0, 0];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 4, 0, 0];
				break;
			case 3:
				Board.CreepNumber["harvester"] = [0, 1, 0, 1, 0];
				Board.CreepNumber["upgrader"] = [0, 0, 0, 3, 0];
				Board.CreepNumber["builder"] = [0, 0, 0, 3, 0];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 1, 3, 0];
				break;
			case 4:
				Board.CreepNumber["harvester"] = [0, 1, 0, 0, 1];
				Board.CreepNumber["upgrader"] = [0, 0, 0, 0, 3];
				Board.CreepNumber["builder"] = [0, 0, 0, 0, 2];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 1, 0, 2];
				break;
			default:
				return Status.Failure;
		}
		return Status.Succeed;
	}
}

class BaseActions {
	public static BuildCreep(role: string, name: string, level: number): Status {
		var newName = "LV" + level + "-" + name + "-" + Game.time;
		var returnCode = BuildHelper.BuildCreep(role, level, Board.CurrentSpawn, newName);
		if (returnCode == 0) {
			return Status.Succeed;
		}
		else {
			console.log("Try Build Creep " + newName + " Failed code = " + returnCode);
			return Status.Failure;
		}
	}

	public static GetCreepNumber(role: string, level: number): number {
		var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.level == level);
		return creeps.length
	}

	public static GetCreepNumberIgnoreLevel(role: string): number {
		var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
		return creeps.length
	}
}

