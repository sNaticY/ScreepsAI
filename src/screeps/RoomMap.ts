import { NumericDictionary } from "lodash";

export class RoomMap {
    public static CalcMiddlePosition(room: Room): RoomPosition|null {
        const map: Array<Array<NumericDictionary<number>>> = [];
        for (let x = 1; x < 50; x++) {
            if (map[x] == null) {
                map[x] = [];
            }
            for (let y = 1; y < 50; y++) {
                map[x][y] = {0: -1, 1: -1, 2: -1};
            }
        }

        const targets: RoomPosition[] = [];
        const sources = room.find(FIND_SOURCES);
        for (const source of sources) {
            targets.push(source.pos);
        }
        if (room.controller) {
            targets.push(room.controller.pos);
        }

        const curSteps: RoomPosition[][] = [];
        for (let targetIndex = 0; targetIndex < targets.length; targetIndex++) {
            curSteps[targetIndex] = [];
            curSteps[targetIndex].push(targets[targetIndex]);
        }

        for (let i = 0; i < 50; i++) {
            for (let targetIndex = 0; targetIndex < targets.length; targetIndex++) {
                curSteps[targetIndex] = RoomMap.CalcNextStep(map, curSteps[targetIndex], i, targetIndex);
            }
            for (const curStep of curSteps) {
                for (const pos of curStep) {
                    let notfound = false;
                    for (let targetIndex = 0; targetIndex < targets.length; targetIndex++) {
                        // console.log(pos, targetIndex, map[pos.x][pos.y][targetIndex]);
                        if (map[pos.x][pos.y][targetIndex] === -1) {
                            notfound = true;
                        }
                    }
                    if (!notfound) {
                        return pos;
                    }
                }
            }
        }
        return null;
    }

    // tslint:disable-next-line:max-line-length
    public static CalcNextStep(map: Array<Array<NumericDictionary<number>>>, thisStep: RoomPosition[], stepIndex: number, targetIndex: number): RoomPosition[] {
        const nextStep: RoomPosition[] = [];
        for (const stepPos of thisStep) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const pos = new RoomPosition(stepPos.x + i, stepPos.y + j, stepPos.roomName);
                    // tslint:disable-next-line:max-line-length
                    if (pos && pos.lookFor(LOOK_TERRAIN)[0] !== "wall" && map[pos.x][pos.y] && map[pos.x][pos.y][targetIndex] === -1) {
                        nextStep.push(pos);
                        map[pos.x][pos.y][targetIndex] = stepIndex;
                        // console.log("Set", pos, targetIndex, map[pos.x][pos.y][targetIndex]);
                    }
                }
            }
        }
        return nextStep;
    }
}
