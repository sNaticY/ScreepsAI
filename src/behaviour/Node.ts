import { Status } from "./Status";

export default interface TreeNode {
    execute(name: string, id: string): Status;
}
