import { BuildHelper } from "utils/BuildHelper";
import Board from "../Board";
import Status from "../Status";
import Tree from "../Tree";

export class CheckBackupEnergy extends Tree {
    public ifEqual: boolean;

    constructor(ifEqual: boolean) {
        super();
        this.ifEqual = ifEqual;
    }

    public Execute(name: string, id: string): Status {
        const storages = Board.CurrentRoom.find<StructureStorage>(FIND_STRUCTURES, {
            filter: (s) => {
                return s.structureType === STRUCTURE_STORAGE;
            }
        });
        if (storages.length > 0) {
            const result = storages[0].store.energy === storages[0].storeCapacity;
            return this.ifEqual ? this.ReturnStateBoolean(result, id) : this.ReturnStateBoolean(!result, id);
        }
        return this.ReturnStateBoolean(this.ifEqual, id);
    }
}
