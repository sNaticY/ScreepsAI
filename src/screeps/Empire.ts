export class Empire {
    public static Initialize() {
        const empireMemory = Memory.empire;
        if (!empireMemory) {
            Memory.empire = {provinceIds: [], unmanaged: {} };
            Memory.provinces = {};
        }
    }
}
