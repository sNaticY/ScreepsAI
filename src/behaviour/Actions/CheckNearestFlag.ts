import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

type Condition = () => boolean;

export class CheckNearestFlag extends Tree {
    public x: number = 1;
    public y: number = 1;

    public minPath: number = 9999;
    public minPathX: number = 0;
    public minPathY: number = 0;

    public finish: boolean = false;
    public Execute(name: string, id: string): Status {
        if (this.finish) {
            // console.log("Finish Check Nearest Flag")
            return this.ReturnState(Status.Succeed, id);
        }
        const room = Board.CurrentRoom;
        if (Game.flags.MinFlag) {
            Game.flags.MinFlag.remove();
            room.memory.hasRoadBuild = false;
            room.memory.hasMidFlagFound = false;

            const sites = room.find(FIND_MY_CONSTRUCTION_SITES);

            for (const element of sites) {
                element.remove();
            }
        }

        const targets: RoomPosition[] = [];
        const spawns = room.find(FIND_MY_SPAWNS);
        const sources = room.find(FIND_SOURCES);

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
            const pos = room.getPositionAt(this.x, this.y);
            if (pos) {
                const terrain = Game.map.getTerrainAt(this.x, this.y, room.name);
                if (terrain !== "wall") {
                    let totalLength: number = 0;
                    for (const target of targets) {
                        const length = room.findPath(pos, target,
                            { ignoreCreeps: true, plainCost: 1, swampCost: 1 }).length;
                        totalLength += length;
                    }
                    if (totalLength < this.minPath) {
                        this.minPath = totalLength;
                        this.minPathX = this.x;
                        this.minPathY = this.y;
                    }

                    // console.log("x = ", this.x, " y = ", this.y, " length = ",
                    // totalLength, "minPath", this.minPath, "minX", this.minPathX, "minY", this.minPathY);
                    i++;
                }
                if (this.x + 1 === 50) {
                    this.x = 1;
                    if (this.y + 1 === 50) {
                        this.finish = true;
                        room.createFlag(this.minPathX, this.minPathY, "MinFlag");
                        return this.ReturnState(Status.Succeed, id);
                    } else {
                        this.y++;
                    }
                } else {
                    this.x++;
                }
            }
        }
        // console.log("Check Nearest Flag Status Failure")
        return this.ReturnState(Status.Running, id);
    }
}
