import { BehaviourNodeType } from "./BTStatus";
import { TreeNode } from "./TreeNode";

export class LeafNode extends TreeNode {
    constructor() {
        super()
        this.behaviourNodeType = BehaviourNodeType.LeafNode
    }
}