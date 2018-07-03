import Board, { Strategy } from "./Board";
import Tree from "./Tree";
import Status from "./Status"
import { BuildHelper } from "../utils/BuildHelper"
import { List, random } from "lodash"


interface CreepCondition {
    (creep:Creep): boolean;
}

export class LoopSleepTicks extends Tree {
	tick: number = 0;
	maxTick: number;
	afterResult: boolean;

	constructor(tick: number, afterResult: boolean) {
		super();
		this.tick = tick;
		this.maxTick = tick;
		this.afterResult = afterResult;
	}

	public Execute(name:string, id: string) {
		this.tick++;
		if (this.tick >= this.maxTick) {
			this.tick = 0;
			return this.afterResult ? this.ReturnState(Status.Succeed, id) : this.ReturnState(Status.Failure, id);
		}
		else {
			return this.afterResult ? this.ReturnState(Status.Failure, id) : this.ReturnState(Status.Succeed, id);
		}
	}
}

export class CheckCurStrategy extends Tree {
	targetStrategys: Strategy[]
	ifMatch: boolean
	constructor(ifMatch: boolean, ...target: Strategy[]) {
		super();
		this.targetStrategys = target;
		this.ifMatch = ifMatch;
	}
	Execute(name:string, id: string): Status {
		var match = false;
		for (const str of this.targetStrategys) {
			if (str == Board.Strategy) {
				match = true;
				break;
			}
		}
		if (this.ifMatch) {
			return match ? this.ReturnState(Status.Succeed, id) : this.ReturnState(Status.Failure, id);
		}
		else {
			return match ? this.ReturnState(Status.Failure, id) : this.ReturnState(Status.Succeed, id);
		}
	}
}

export class CheckNearestFlag extends Tree {
	x: number = 1;
	y: number = 1;

	minPath: number = 9999;
	minPathX: number = 0;
	minPathY: number = 0;

	finish: boolean = false;
	public Execute(name:string, id: string): Status {
		if (this.finish) {
			//console.log("Finish Check Nearest Flag")
			return this.ReturnState(Status.Succeed, id);
		}
		var room = Board.CurrentRoom;
		if (Game.flags["MinFlag"]) {
			Game.flags["MinFlag"].remove();
			room.memory.hasRoadBuild = false;
			room.memory.hasMidFlagFound = false;

			var sites = room.find(FIND_MY_CONSTRUCTION_SITES)
			for (let i = 0; i < sites.length; i++) {
				const element = sites[i];
				element.remove()
			}
		}


		var targets: RoomPosition[] = []
		var spawns = room.find(FIND_MY_SPAWNS);
		var sources = room.find(FIND_SOURCES);

		for (const spawn of spawns) {
			targets.push(spawn.pos);
		}

		for (const source of sources) {
			targets.push(source.pos);
		}

		if (room.controller) {
			targets.push(room.controller.pos);
		}

		for (let i = 0; i < 25;) {
			var pos = room.getPositionAt(this.x, this.y);
			if (pos) {
				var terrain = Game.map.getTerrainAt(this.x, this.y, room.name);
				if (terrain != "wall") {
					var totalLength: number = 0;
					for (let j = 0; j < targets.length; j++) {
						const target = targets[j];
						var length = room.findPath(pos, target, { ignoreCreeps: true, plainCost: 1, swampCost: 1 }).length;
						totalLength += length;
						//console.log("targetPos = ", target)
					}
					if (totalLength < this.minPath) {
						this.minPath = totalLength;
						this.minPathX = this.x;
						this.minPathY = this.y;
					}

					// console.log("x = ", this.x, " y = ", this.y, " length = ", totalLength, "minPath", this.minPath, "minX", this.minPathX, "minY", this.minPathY);
					i++;
				}
				if (this.x + 1 == 50) {
					this.x = 1;
					if (this.y + 1 == 50) {
						this.finish = true;
						room.createFlag(this.minPathX, this.minPathY, "MinFlag");
						return this.ReturnState(Status.Succeed, id);
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
		// console.log("Check Nearest Flag Status Failure")
		return this.ReturnState(Status.Failure, id);
	}
}

export class BuildRoadFromMinFlag extends Tree {
	Execute(name:string, id: string): Status {
		var room = Board.CurrentRoom;
		if (room.memory.hasRoadBuild) {
			return this.ReturnState(Status.Succeed, id);
		}
		var flag = Game.flags["MinFlag"];
		if (!flag) return this.ReturnState(Status.Failure, id);
		BuildHelper.BuildAllStructureNearPos(Board.CurrentSpawn.pos, 1, STRUCTURE_ROAD, (pos): boolean => {
			return true;
		});
		BuildHelper.BuildAllStructureNearPos(flag.pos, 0, STRUCTURE_ROAD, (pos): boolean => {
			return true;
		});
		var path: PathStep[] = [];
		room.memory.extensionPos = [];
		room.memory.extensionFindRange = [1, 1, 1];
		if (room.controller) {
			var controllerPath = room.findPath(flag.pos, room.controller.pos, { ignoreCreeps: true, plainCost: 1, swampCost: 1 });
			var pos = room.getPositionAt(controllerPath[Math.ceil(controllerPath.length / 2)].x, controllerPath[Math.ceil(controllerPath.length / 2)].y);
			if (pos) { room.memory.extensionPos.push(pos); }
			path.push(...controllerPath)
			BuildHelper.BuildAllStructureNearPos(room.controller.pos, 1, STRUCTURE_ROAD, (pos): boolean => {
				return true;
			});
		}
		path.push(...room.findPath(flag.pos, Board.CurrentSpawn.pos, { ignoreCreeps: true, plainCost: 1, swampCost: 1 }))
		var sources = room.find(FIND_SOURCES)
		for (let i = 0; i < sources.length; i++) {
			const element = sources[i];
			var sourcePath = room.findPath(flag.pos, element.pos, { ignoreCreeps: true, plainCost: 1, swampCost: 1 })
			var pos = room.getPositionAt(sourcePath[Math.ceil(sourcePath.length / 2)].x, sourcePath[Math.ceil(sourcePath.length / 2)].y);
			if (pos) { room.memory.extensionPos.push(pos); }
			path.push(...sourcePath)
			BuildHelper.BuildAllStructureNearPos(element.pos, 1, STRUCTURE_ROAD, (pos): boolean => {
				return true;
			});
		}
		BuildHelper.BuildRoad(path, room);
		room.memory.hasRoadBuild = true;
		return this.ReturnState(Status.Succeed, id);
	}
}

export class BuildExtensionsByPath extends Tree {
	Execute(name:string, id: string): Status {
		var room = Board.CurrentRoom;
		let extensions = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION });
		let extensionSites = room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION });
		let extensionCount: number = 0;
		if (room.controller) {
			switch (room.controller.level) {
				case 2:
					extensionCount = 5;
					break;
				case 3:
					extensionCount = 10;
					break;
				default:
					extensionCount = (room.controller.level - 2) * 10;
					break;
			}
			if (room.memory.hasMidFlagFound) {
				return this.ReturnState(Status.Succeed, id);
			}
			var posIndex = random(0, 2)
			for (let i = extensions.length + extensionSites.length; i < extensionCount;) {
				var result = BuildHelper.BuildOneStructureNearPos(room.memory.extensionPos[posIndex], room.memory.extensionFindRange[posIndex], STRUCTURE_EXTENSION, (pos): boolean => {
					return pos && Math.abs(pos.x - pos.y) % 2 == 0 &&
						pos.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 &&
						pos.lookFor(LOOK_STRUCTURES).length == 0 &&
						Game.map.getTerrainAt(pos.x, pos.y, room.name) != "wall" &&
						pos.findInRange(FIND_SOURCES, 2).length == 0
				})
				if (result == 0) {
					i++;
					posIndex = random(0, 2)
					// console.log("build", i, "extension, total", extensionCount)
				}
				else if (result == -9) {
					room.memory.extensionFindRange[posIndex]++;
				}
			}
			return this.ReturnState(Status.Succeed, id);
		}
		return this.ReturnState(Status.Failure, id);
	}
}

export class BuildContainerNearSource extends Tree {
	Execute(name:string, id: string): Status {
		var room = Board.CurrentRoom;
		var sources = room.find(FIND_SOURCES)
		var containers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
		var containerSites = room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
		for (let i = containers.length + containerSites.length; i < sources.length; i++) {
			const source = sources[i];
			var result = BuildHelper.BuildOneStructureNearPos(source.pos, 1, STRUCTURE_CONTAINER, (pos): boolean => {
				if (pos) {
					var structures = pos.lookFor(LOOK_STRUCTURES);
					return Game.map.getTerrainAt(pos.x, pos.y, room.name) != "wall" &&
						(structures.length == 0 || (structures.length == 1 && structures[0].structureType == STRUCTURE_ROAD))
				}
				return false;
			});
			if (result != 0) {
				console.log("Can not find position to build container");
				return this.ReturnState(Status.Failure, id);
			}
		}
		return this.ReturnState(Status.Succeed, id);
	}
}

export class TowerAttackClosest extends Tree {
	Execute(name:string, id: string): Status {
		var tower = Board.CurrentTower;
		var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (closestHostile) {
			var result = tower.attack(closestHostile);
			if (result == 0) {
				return this.ReturnState(Status.Succeed, id);
			}
		}
		return this.ReturnState(Status.Failure, id);
	}
}

export class BuildStorageNearController extends Tree {
	Execute(name:string, id: string): Status {
		var room = Board.CurrentRoom;
		var controller = room.controller;
		if (controller) {
			var storages = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_STORAGE });
			var storageSites = room.find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType == STRUCTURE_STORAGE });
			for (let i = storages.length + storageSites.length; i < 1; i++) {
				var result = BuildHelper.BuildOneStructureNearPos(controller.pos, 3, STRUCTURE_STORAGE, (pos): boolean => {
					return pos && Math.abs(pos.x - pos.y) % 2 == 0 &&
						Game.map.getTerrainAt(pos.x, pos.y, room.name) != "wall" &&
						pos.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 &&
						pos.lookFor(LOOK_STRUCTURES).length == 0;
				});
				if (result != 0) {
					console.log("Can not find position to build storage");
					return this.ReturnState(Status.Failure, id);
				}
			}
		}
		return this.ReturnState(Status.Succeed, id);
	}
}

export class BuildTowerInMiddle extends Tree {
	Execute(name:string, id: string): Status {
		var room = Board.CurrentRoom;
		var minFlag = Game.flags["MinFlag"];
		var path = room.findPath(Board.CurrentSpawn.pos, minFlag.pos);
		var middlePath = path[Math.floor(path.length / 2)];
		var middlePos = room.getPositionAt(middlePath.x, middlePath.y);
		if (middlePos) {
			var result = BuildHelper.BuildOneStructureNearPos(middlePos, 4, STRUCTURE_TOWER, (pos): boolean => {
				return pos && Math.abs(pos.x - pos.y) % 2 == 0 &&
					Game.map.getTerrainAt(pos.x, pos.y, room.name) != "wall" &&
					pos.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 &&
					pos.lookFor(LOOK_STRUCTURES).length == 0;
			})
		}
		return this.ReturnState(Status.Succeed, id);
	}
}

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
	public Execute(name:string, id: string): Status {
		var result = BaseActions.BuildCreep(this.role, this.name, this.level);
		// console.log("Try build", this.role, "\t[level", this.level, "]" , result);
		return this.ReturnState(result, id);
	}
}

export class BuildBetterCreep extends Tree {
	role: string;
	name: string;
	constructor(role: string, name: string) {
		super();
		this.role = role;
		this.name = name;
	}
	public Execute(name:string, id: string): Status {
		var creeps = Board.CurrentRoom.find(FIND_CREEPS, { filter: (c) => c.memory.role == this.role })
		var maxLevel: number = 0;
		for (var cr of creeps) {
			if (cr.memory.level > maxLevel) {
				maxLevel = cr.memory.level;
			}
		}
		for (let i = Board.EnconemyLevel; i > maxLevel; i--) {
			var result = BaseActions.BuildCreep(this.role, this.name, i);
			if (result == 0) {
				return this.ReturnState(result, id);
			}
		}
		if (Board.EnconemyLevel == maxLevel) {
			var result = BaseActions.BuildCreep(this.role, this.name, maxLevel);
		}
		return this.ReturnState(Status.Failure, id);
	}
}

export class CheckCreepNum extends Tree {
	role: string;
	level: number | undefined
	isTrue: boolean

	constructor(role: string, isTrueWhenEqual: boolean, level: number | undefined) {
		super();
		this.role = role;
		if (level) {
			this.level = level;
		}
		this.isTrue = isTrueWhenEqual;
	}
	public Execute(name:string, id: string): Status {
		var targetNumber: number = 0;
		var creepsNumber: number = 0;
		if (this.level) {
			creepsNumber = BaseActions.GetCreepNumber(this.role, this.level);
			targetNumber = Board.CreepNumber[this.role][this.level];
		} else {
			creepsNumber = BaseActions.GetCreepNumberIgnoreLevel(this.role);
			targetNumber = Board.CreepNumber[this.role][0];
		}
		// console.log("Need Role", this.role, "\t[ level", this.level, "]", targetNumber, "\thave", creepsNumber)
		if (creepsNumber < targetNumber) {
			return this.isTrue ? this.ReturnState(Status.Failure, id) : this.ReturnState(Status.Succeed, id);
		}
		return this.isTrue ? this.ReturnState(Status.Succeed, id) : this.ReturnState(Status.Failure, id);
	}
}

export class MoveAndHarvest extends Tree {
	public Execute(name:string, id: string): Status {
		if(id == "5b3aaf785c2b1a6b84a93c0a"){
			console.log(name + "MoveAndHarvest")
		}
		var creep = Board.CurrentCreep;
		if ((creep.memory.role != "miner" && creep.carry.energy >= creep.carryCapacity)) {

			return this.ReturnState(Status.Failure, id);
		}

		var targets = creep.room.find(FIND_SOURCES);

		if (targets.length > 0) {
			var target = targets[creep.memory.harvestIndex % 2 == 0 ? 0 : 1];
			var result = creep.harvest(target);
			if (creep.memory.role == "miner") {
				var container = target.pos.findInRange<Structure>(FIND_STRUCTURES, 2, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
				if (container.length > 0) {
					creep.moveTo(container[0].pos, { visualizePathStyle: { stroke: '#ffaa00' } });
				}
				else {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
				}
			}
			else if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
			}
			else if (result != 0) {
				// console.log("MoveAndHarvest Failed", result)
				return this.ReturnState(Status.Failure, id);
			}
			creep.say('🔄 Harvesting');
			return this.ReturnState(Status.Running, id);
		}
		// console.log("MoveAndHarvest Failed, Didn't find target to Harvest")
		return this.ReturnState(Status.Failure, id);
	}
}

export class MoveAndTransferEnergyToSpawn extends Tree {
	public Execute(name:string, id: string): Status {
		var creep = Board.CurrentCreep;
		if (creep.carry.energy == 0) {
			return this.ReturnState(Status.Failure, id);
		}

		var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_SPAWN &&
					structure.energy < structure.energyCapacity);
			}
		});

		if (target) {
			var result = creep.transfer(target, RESOURCE_ENERGY);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
			}
			else if (result != 0) {
				// console.log("MoveAndTransferBackToSpawnAndExtension Failed", result)
				return this.ReturnState(Status.Failure, id);
			}
			creep.say('🔄 Transfering');
			return this.ReturnState(Status.Running, id);
		}

		// console.log("MoveAndTransferBackToSpawnAndExtension Failed, Didn't find target to transfer")
		return this.ReturnState(Status.Failure, id);
	}
}

export class MoveAndTransferEnergyToExtension extends Tree {
	public Execute(name:string, id: string): Status {
		var creep = Board.CurrentCreep;
		if (creep.carry.energy == 0) {
			return this.ReturnState(Status.Failure, id);
		}

		var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_EXTENSION &&
					structure.energy < structure.energyCapacity);
			}
		});

		if (target) {
			var result = creep.transfer(target, RESOURCE_ENERGY);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
			}
			else if (result != 0) {
				// console.log("MoveAndTransferBackToSpawnAndExtension Failed", result)
				return this.ReturnState(Status.Failure, id);
			}
			creep.say('🔄 Transfering');
			return this.ReturnState(Status.Running, id);
		}

		// console.log("MoveAndTransferBackToSpawnAndExtension Failed, Didn't find target to transfer")
		return this.ReturnState(Status.Failure, id);
	}
}

export class MoveAndTransferEnergyToTower extends Tree {
	public Execute(name:string, id: string): Status {
		var creep = Board.CurrentCreep;
		if (creep.carry.energy == 0) {
			return this.ReturnState(Status.Failure, id);
		}

		var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_TOWER &&
					structure.energy < structure.energyCapacity);
			}
		});

		if (target) {
			var result = creep.transfer(target, RESOURCE_ENERGY);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
			}
			else if (result != 0) {
				// console.log("MoveAndTransferBackToSpawnAndExtension Failed", result)
				return this.ReturnState(Status.Failure, id);
			}
			creep.say('🔄 Transfering');
			return this.ReturnState(Status.Running, id);
		}

		// console.log("MoveAndTransferBackToSpawnAndExtension Failed, Didn't find target to transfer")
		return this.ReturnState(Status.Failure, id);
	}
}

export class MoveAndTransferEnergyToStorage extends Tree {
	public Execute(name:string, id: string): Status {
		var creep = Board.CurrentCreep;
		if (creep.carry.energy == 0) {
			// creep.say('🔄 harvest');
			return this.ReturnState(Status.Failure, id);
		}

		if (creep.carry.energy == creep.carryCapacity) {
			// creep.say('⚡ transfering');
		}
		var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return ((structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity));
			}
		});

		if (target) {
			var result = creep.transfer(target, RESOURCE_ENERGY);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
			}
			else if (result != 0) {
				//console.log("MoveAndTransferBackToSpawnAndExtension Failed", result)
				return this.ReturnState(Status.Failure, id);
			}
			creep.say('🔄 Transfering');
			return this.ReturnState(Status.Running, id);
		}

		// console.log("MoveAndTransferBackToSpawnAndExtension Failed, Didn't find target to transfer")
		return this.ReturnState(Status.Failure, id);
	}
}

export class CheckCreepCondition extends Tree {
	condition: CreepCondition;
	ifMatch:boolean
	constructor(condition: CreepCondition, ifMatch: boolean) {
		super();
		this.condition = condition;
		this.ifMatch = ifMatch;
	}
	public Execute(name:string, id: string): Status {
		var result = this.condition(Board.CurrentCreep)
		return this.ifMatch ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id)
	}
}

export class CheckCreepEnergyFull extends Tree {
	ifFull: boolean;
	constructor(ifFull: boolean) {
		super();
		this.ifFull = ifFull;
	}
	public Execute(name:string, id: string): Status {
		if(id == "5b3aaf785c2b1a6b84a93c0a"){
			console.log(name + "CheckCreepEnergy")
		}
		var result = Board.CurrentCreep.carry.energy == Board.CurrentCreep.carryCapacity;
		return this.ifFull ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id)
	}
}

export class CheckCreepEnergyEmpty extends Tree {
	ifEmpty: boolean;
	constructor(ifEmpty: boolean) {
		super();
		this.ifEmpty = ifEmpty;
	}
	public Execute(name:string, id: string): Status {
		var result = Board.CurrentCreep.carry.energy == 0;
		return this.ifEmpty ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id)
	}
}

// Going Pickup returns running, finish returns true, other issue returns false
export class MoveAndPickupEnergy extends Tree {
	public Execute(name:string, id: string): Status {
		var creep = Board.CurrentCreep;
		if (creep.carry.energy >= creep.carryCapacity) {
			return this.ReturnState(Status.Failure, id);
		}
		const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
			filter: (resource) => {
				return resource.resourceType == RESOURCE_ENERGY && resource.amount >= creep.carryCapacity
			}
		});
		if (target) {
			var result = creep.pickup(target);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
			}
			else {
				// console.log("MoveAndPickupEnergy Failed", result)
				return this.ReturnState(Status.Failure, id);
			}
			creep.say('🔄 Picking up');
			return this.ReturnState(Status.Running, id);
		}
		// console.log("MoveAndTransferBackToSpawnAndExtension Failed, Didn't find target to transfer")
		return this.ReturnState(Status.Failure, id);
	}
}

export class MoveAndWithdrawEnergyFromContainer extends Tree {
	public Execute(name:string, id: string): Status {
		var creep = Board.CurrentCreep;
		if (creep.carry.energy >= creep.carryCapacity) {
			return this.ReturnState(Status.Failure, id);
		}

		var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER) &&
					structure.store[RESOURCE_ENERGY] > 50;
			}
		});

		if (target) {
			var result = creep.withdraw(target, RESOURCE_ENERGY);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
			}
			else if (result != 0) {
				// console.log("MoveAndHarvest Failed", result)
				return this.ReturnState(Status.Failure, id);
			}
			creep.say('🔄 Withdrawing');
			return this.ReturnState(Status.Running, id);
		}
		// console.log("MoveAndHarvest Failed, Didn't find target to Harvest")
		return this.ReturnState(Status.Failure, id);
	}
}

export class MoveAndWithdrawEnergyFromStorage extends Tree {
	public Execute(name:string, id: string): Status {
		var creep = Board.CurrentCreep;
		if (creep.carry.energy >= creep.carryCapacity) {
			return this.ReturnState(Status.Failure, id);
		}

		var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_STORAGE) &&
					structure.store[RESOURCE_ENERGY] > 50;
			}
		});

		if (target) {
			var result = creep.withdraw(target, RESOURCE_ENERGY);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
			}
			else if (result != 0) {
				// console.log("MoveAndHarvest Failed", result)
				return this.ReturnState(Status.Failure, id);
			}
			creep.say('🔄 Withdrawing');
			return this.ReturnState(Status.Running, id);
		}
		// console.log("MoveAndHarvest Failed, Didn't find target to Harvest")
		return this.ReturnState(Status.Failure, id);
	}
}

export class MoveAndWithdrawNearestEnergy extends Tree {
	Execute(name:string, id: string): Status {
		if(id == "5b3aaf785c2b1a6b84a93c0a"){
			console.log(name + "MoveAndWithdrawNearestEnergy")
		}
		var creep = Board.CurrentCreep;
		if (creep.carry.energy >= creep.carryCapacity) {
			return this.ReturnState(Status.Failure, id);
		}
		var target = creep.pos.findClosestByPath<FIND_STRUCTURES>(FIND_STRUCTURES, {
			filter: (s) => {
				return ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy >= 50) ||
					(s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store.energy >= 50
			}
		})

		if (target) {
			var result = creep.withdraw(target, RESOURCE_ENERGY);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });

				creep.say('Withdrawing');
				return this.ReturnState(Status.Running, id);
			}
			// else if (result == 0) {
			// 	// console.log("MoveAndWithdrawNearestEnergy Done", result)
			// 	return this.ReturnState(Status.Succeed, id);
			// }
			else {
				// console.log("MoveAndWithdrawNearestEnergy Failed", result)
				return this.ReturnState(Status.Failure, id);
			}

		}
		return this.ReturnState(Status.Failure, id);
	}
}

export class WithdrawNearestEnergWithoutMove extends Tree {
	Execute(name:string, id: string): Status {
		if(id == "5b3aaf785c2b1a6b84a93c0a"){
			console.log(name + "WithdrawNearestEnergWithoutMove")
		}
		var creep = Board.CurrentCreep;
		if (creep.carry.energy >= creep.carryCapacity) {
			return this.ReturnState(Status.Failure, id);
		}
		var target = creep.pos.findClosestByRange<FIND_STRUCTURES>(FIND_STRUCTURES, {
			filter: (s) => {
				return ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy >= 50) ||
					(s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store.energy >= 50
			}
		})

		if (target) {
			var result = creep.withdraw(target, RESOURCE_ENERGY);
			if (result == 0) {
				creep.say('🔄 Withdrawing');
				// console.log("MoveAndHarvest Failed", result)
				return this.ReturnState(Status.Running, id);
			}
			return this.ReturnState(Status.Failure, id);
		}
		return this.ReturnState(Status.Failure, id);
	}
}

export class MoveAndUpgradeController extends Tree {
	public Execute(name:string, id: string): Status {
		if(id == "5b3aaf785c2b1a6b84a93c0a"){
			console.log(name + "MoveAndUpgradeController")
		}
		var creep = Board.CurrentCreep;
		if (creep.carry.energy == 0) {
			// creep.say('🔄 harvest');
			return this.ReturnState(Status.Failure, id);
		}
		if (creep.room.controller) {
			creep.upgradeController(creep.room.controller)
			creep.moveTo(BaseActions.RandomPosNearTarget(creep.room.controller.pos, creep.room), { visualizePathStyle: { stroke: '#ffffff' } });
			if (creep.carry.energy > 0) {
				creep.say('Upgrading');
				return this.ReturnState(Status.Running, id);
			}
			else {
				creep.say('UpgradDone');
				return this.ReturnState(Status.Succeed, id);
			}
		}
		return this.ReturnState(Status.Failure, id);
	}
}

export class MoveAndBuildConstruction extends Tree {
	public Execute(name:string, id: string): Status {
		var creep = Board.CurrentCreep;
		if (creep.carry.energy == 0) {
			// creep.say('🔄 harvest');
			return this.ReturnState(Status.Failure, id);
		}
		if (creep.carry.energy == creep.carryCapacity) {
			// creep.say('🚧 build');
		}

		var target = creep.pos.findClosestByRange<FIND_CONSTRUCTION_SITES>(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION });
		if (target) {
			creep.build(target)
			creep.moveTo(BaseActions.RandomPosNearTarget(target.pos, creep.room), { visualizePathStyle: { stroke: '#ffffff' } });

			creep.say('🔄 Building');
			return this.ReturnState(Status.Running, id);
		}
		else {
			var target = creep.pos.findClosestByRange<FIND_CONSTRUCTION_SITES>(FIND_CONSTRUCTION_SITES);
			if (target) {
				creep.build(target)
				creep.moveTo(BaseActions.RandomPosNearTarget(target.pos, creep.room), { visualizePathStyle: { stroke: '#ffffff' } });

				creep.say('🔄 building');
				return this.ReturnState(Status.Running, id);
			}
		}
		return this.ReturnState(Status.Failure, id);
	}
}

export class MoveAndRepairConstruction extends Tree {
	public Execute(name:string, id: string): Status {
		var creep = Board.CurrentCreep;
		if (creep.carry.energy == 0) {
			// creep.say('🔄 harvest');
			return this.ReturnState(Status.Failure, id);
		}
		if (creep.carry.energy == creep.carryCapacity) {
			// creep.say('🚧 build');
		}

		const targets = creep.room.find(FIND_STRUCTURES, {
			filter: object => object.hits < object.hitsMax
		});

		targets.sort((a, b) => a.hits - b.hits);

		if (targets.length > 0) {
			creep.repair(targets[0])
			creep.moveTo(BaseActions.RandomPosNearTarget(targets[0].pos, creep.room));

			creep.say('🔄 Repairing');
			return this.ReturnState(Status.Running, id);
		}

		return this.ReturnState(Status.Failure, id);
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
	public Execute(name:string, id: string): Status {
		var energyTotal = 0
		energyTotal = Board.CurrentRoom.energyAvailable;
		if (energyTotal >= this.low && energyTotal < this.high) {
			return this.ReturnState(Status.Succeed, id);
		}
		return this.ReturnState(Status.Failure, id);
	}
}

export class CheckUseableEnergy extends Tree {
	ifEqual: boolean;

	constructor(ifEqual: boolean) {
		super();
		this.ifEqual = ifEqual;
	}
	Execute(name:string, id: string): Status {
		var result = Board.CurrentRoom.energyAvailable == Board.CurrentRoom.energyCapacityAvailable;
		return this.ifEqual ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id);
	}
}

export class CheckBackupEnergy extends Tree {
	ifEqual: boolean;

	constructor(ifEqual: boolean) {
		super();
		this.ifEqual = ifEqual;
	}

	Execute(name:string, id: string): Status {
		var storages = Board.CurrentRoom.find<StructureStorage>(FIND_STRUCTURES, {
			filter: (s) => {
				return s.structureType == STRUCTURE_STORAGE;
			}
		})
		var result = storages[0].store.energy == storages[0].storeCapacity;
		return this.ifEqual ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id);
	}
}

export class CheckNeedBuild extends Tree {
	ifNeed: boolean;

	constructor(ifNeed: boolean) {
		super();
		this.ifNeed = ifNeed;
	}

	Execute(name:string, id: string): Status {
		var needBuildStructures = Board.CurrentRoom.find(FIND_CONSTRUCTION_SITES);
		var result = needBuildStructures.length > 0;
		return this.ifNeed ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id);
	}
}

export class CheckNeedRepair extends Tree {
	ifNeed: boolean;

	constructor(ifNeed: boolean) {
		super();
		this.ifNeed = ifNeed;
	}

	Execute(name:string, id: string): Status {
		var needRepairStructures = Board.CurrentRoom.find(FIND_STRUCTURES, {
			filter: (s) => {
				return s.hits < s.hitsMax - 300;
			}
		});
		var result = needRepairStructures.length > 0;
		return this.ifNeed ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id);
	}
}

export class CheckNeedFillTower extends Tree {
	ifNeed: boolean;

	constructor(ifNeed: boolean) {
		super();
		this.ifNeed = ifNeed;
	}

	Execute(name:string, id: string): Status {
		var needFilledTowers = Board.CurrentRoom.find<StructureTower>(FIND_STRUCTURES, {
			filter: (s) => {
				return s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity - 50;
			}
		});
		var result = needFilledTowers.length > 0;
		return this.ifNeed ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id);
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
	public Execute(name:string, id: string): Status {
		var energyCapcity = 0
		energyCapcity = Board.CurrentRoom.energyCapacityAvailable;
		if (energyCapcity >= this.low && energyCapcity < this.high) {
			return this.ReturnState(Status.Succeed, id);
		}
		return this.ReturnState(Status.Failure, id);
	}
}

export class NothingToDoWarning extends Tree {
	public Execute(name:string, id: string): Status {
		var creep = Board.CurrentCreep;
		creep.say("Sleep!")
		return this.ReturnState(Status.Failure, id);
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
	public Execute(name:string, id: string): Status {
		console.log(this.log);
		return this.result;
	}
}


export class AdjustStrategy extends Tree {
	level: number;
	constructor(level: number) {
		super();
		this.level = level;
	}
	public Execute(name:string, id: string): Status {
		Board.EnconemyLevel = this.level;
		// console.log("SetLevel = ", Board.EnconemyLevel, "Current Energy = ", Board.CurrentRoom.energyAvailable)
		switch (Board.EnconemyLevel) {
			case 1:
				Board.CreepNumber["harvester"] = [7, 0, 0, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["upgrader"] = [0, 3, 0, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["builder"] = [0, 1, 0, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["miner"] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
				break;
			case 2:
				Board.CreepNumber["harvester"] = [6, 0, 0, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["upgrader"] = [0, 0, 3, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["builder"] = [0, 0, 1, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 1, 0, 0, 0, 0, 0, 0];
				break;
			case 3:
				Board.CreepNumber["harvester"] = [5, 0, 0, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["upgrader"] = [0, 0, 0, 3, 0, 0, 0, 0, 0];
				Board.CreepNumber["builder"] = [0, 0, 0, 1, 0, 0, 0, 0, 0];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 0, 1, 0, 0, 0, 0, 0];
				break;
			case 4:
				Board.CreepNumber["harvester"] = [4, 0, 0, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["upgrader"] = [0, 0, 0, 0, 3, 0, 0, 0, 0];
				Board.CreepNumber["builder"] = [0, 0, 0, 0, 1, 0, 0, 0, 0];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 0, 0, 1, 0, 0, 0, 0];
				break;
			case 5:
				Board.CreepNumber["harvester"] = [3, 0, 0, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["upgrader"] = [0, 0, 0, 0, 0, 2, 0, 0, 0];
				Board.CreepNumber["builder"] = [0, 0, 0, 0, 0, 1, 0, 0, 0];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 0, 0, 0, 1, 0, 0, 0];
				break;
			case 6:
				Board.CreepNumber["harvester"] = [2, 0, 0, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["upgrader"] = [0, 0, 0, 0, 0, 0, 2, 0, 0];
				Board.CreepNumber["builder"] = [0, 0, 0, 0, 0, 0, 1, 0, 0];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 0, 0, 0, 0, 1, 0, 0];
				break;
			case 7:
				Board.CreepNumber["harvester"] = [1, 0, 0, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["upgrader"] = [0, 0, 0, 0, 0, 0, 0, 1, 0];
				Board.CreepNumber["builder"] = [0, 0, 0, 0, 0, 0, 0, 1, 0];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 0, 0, 0, 0, 0, 1, 0];
				break;
			case 8:
				Board.CreepNumber["harvester"] = [1, 0, 0, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["upgrader"] = [0, 0, 0, 0, 0, 0, 0, 0, 1];
				Board.CreepNumber["builder"] = [0, 0, 0, 0, 0, 0, 0, 0, 1];
				Board.CreepNumber["miner"] = [0, 0, 2, 0, 0, 0, 0, 0, 0];
				Board.CreepNumber["carrier"] = [0, 0, 0, 0, 0, 0, 0, 0, 1];
				break;
			default:
				return this.ReturnState(Status.Failure, id);
		}
		return this.ReturnState(Status.Succeed, id);
	}
}

class BaseActions {
	public static BuildCreep(role: string, name: string, level: number): Status {
		var newName = "LV" + level + "-" + name + "-" + Game.time;
		// console.log("Try Build Creep " + newName);
		var returnCode = BuildHelper.BuildCreep(role, level, Board.CurrentSpawn, newName);
		if (returnCode == 0) {
			return Status.Succeed;
		}
		else {
			// console.log("Try Build Creep " + newName + " Failed code = " + returnCode);
			return Status.Failure;
		}
	}

	public static GetCreepNumber(role: string, level: number): number {
		var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.level == level);
		var deadNumber: number = 0;
		for (const creep of creeps) {
			if (creep.ticksToLive && creep.ticksToLive < 100) {
				deadNumber++;
			}
		}
		return creeps.length - deadNumber;
	}

	public static GetCreepNumberIgnoreLevel(role: string): number {
		var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
		var deadNumber: number = 0;
		for (const creep of creeps) {
			if (creep.ticksToLive && creep.ticksToLive < 100) {
				deadNumber++;
			}
		}
		return creeps.length - deadNumber;
	}

	public static RandomPosNearTarget(target: RoomPosition, room: Room): RoomPosition {
		while (true) {
			var offsetX = random(-3, 3);
			var offsetY = random(-3, 3);
			var roomPos = room.getPositionAt(target.x + offsetX, target.y + offsetY);
			if (roomPos && Game.map.getTerrainAt(roomPos.x, roomPos.y, room.name) != "wall") {
				return roomPos;
			}
		}

	}
}

