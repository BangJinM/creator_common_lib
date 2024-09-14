import { BTStatus } from "../BTStatus";
import { DecoratorNode } from "../DecoratorNode";

export class TrueDecoratorNode extends DecoratorNode {
    constructor() {
        super()
    }

    public OnExcute(): BTStatus {
        this.childNode.Tick()
        return BTStatus.Success;
    }
}