import { BTStatus } from "../BTStatus";
import { DecoratorNode } from "../DecoratorNode";

export class InverseDecoratorNode extends DecoratorNode {
    constructor() {
        super()
    }

    public OnExcute(): BTStatus {
        if (this.childNode == null)
            return BTStatus.Success;
        let status = this.childNode.Tick();
        let result = BTStatus.Running;
        switch (status) {
            case BTStatus.Success:
                result = BTStatus.Failure;
                break;
            case BTStatus.Failure:
                result = BTStatus.Success;
                break;
            default:
                break;
        }
        return result;
    }
}