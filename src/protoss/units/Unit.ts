export class Unit {
    public id: string;
    public creep: Creep;

    constructor(creep: Creep) {
        this.id = creep.id;
        this.creep = creep;
    }
}
