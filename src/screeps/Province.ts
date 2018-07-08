export class Province {
    public static Initialize(name: string, capitalName: string) {
        const province = Memory.provinces[name];
        if (!province) {
            Memory.provinces[name] = {
                name,
                roomNames: [capitalName],
                state: "DEVELOPMENT",
                taskIds: [],
                // tslint:disable-next-line:object-literal-sort-keys
                capitalRoomName: capitalName
            };
            Memory.empire.provinceIds.push(name);
        }
    }
}
