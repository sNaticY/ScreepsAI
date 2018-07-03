import Status from "./Status";

export default interface TreeNode {
    Execute(name:string, id: string) : Status ;
}