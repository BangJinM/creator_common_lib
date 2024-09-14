import { BTStatus } from "../BTStatus";
import { CompositeNode } from "../CompositeNode";

export class SequenceCompositeNode extends CompositeNode {
    constructor() {
        super()
    }

    public OnExcute(): BTStatus {
        if (this.GetChildrenCount() <= 0)
            return BTStatus.Success
        for (const child of this.mChildren) {
            if (child.Tick() != BTStatus.Success)
                return BTStatus.Failure
        }
        return BTStatus.Success
    }
}