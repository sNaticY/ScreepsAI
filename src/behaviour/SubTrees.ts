import Tree from "./Tree";
import Sequence from "./Sequence";
import { CheckHarvesterNum, BuildHarvester } from "./Actions";

export default class SubTrees{
    static AISpawn() : Tree {
        let tree = new Sequence();
        tree.SubTrees.push(new CheckHarvesterNum(), new BuildHarvester())
        return tree;
    }
}