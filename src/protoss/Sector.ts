import { Dictionary } from "lodash";
import { Area } from "./areas/Area";

export class Sector {
    public id: string;
    // Key = roomId. value = area
    public areas: Dictionary<Area> = {};
}
