import { BTStatus } from "../BTStatus";
import { CompositeNode } from "../CompositeNode";
import { ConditionNode } from "../ConditionNode";

export class IfNotCompositeNode extends CompositeNode {
    conditionNode: ConditionNode = null

    constructor(condition: ConditionNode) {
        super()

        this.conditionNode = condition
    }

    public OnExcute(): BTStatus {
        if (!this.conditionNode)
            return BTStatus.Failure
        if (this.GetChildrenCount() <= 0)
            return BTStatus.Failure

        if (!this.conditionNode.Tick())
            return this.mChildren[0].Tick()
        return BTStatus.Success
    }

    public AddCondition(condition: ConditionNode) {
        this.conditionNode = condition
    }
}