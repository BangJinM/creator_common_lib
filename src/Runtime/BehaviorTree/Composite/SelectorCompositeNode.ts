import { BTStatus } from "../BTStatus";
import { CompositeNode } from "../CompositeNode";

export class SelectorCompositeNode extends CompositeNode {
    constructor() {
        super()
    }

    public OnExcute(): BTStatus {
        if (this.GetChildrenCount() <= 0)
            return BTStatus.Success
        for (const child of this.mChildren) {
            if (child.Tick() == BTStatus.Success)
                return BTStatus.Success
        }
        return BTStatus.Failure
    }
}