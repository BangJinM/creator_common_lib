import { BehaviourNodeType } from "./BTStatus";
import { LeafNode } from "./LeafNode";

export class ConditionNode extends LeafNode {
    constructor() {
        super()
        this.behaviourNodeType = BehaviourNodeType.ConditionNode
    }
}