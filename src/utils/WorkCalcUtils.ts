export class WorkCalc {
    public static ClacCarrierNumber(spawn: StructureSpawn, targetPos: RoomPosition, carryNum: number): number {
        const path = PathFinder.search(spawn.pos, { pos: targetPos, range: 3});
        const rate = 50 / path.path.length * 2.5;
        return 10 / (carryNum * rate);
    }
}
