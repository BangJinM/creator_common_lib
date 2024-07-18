import { BTStatus } from "../BTStatus";
import { DecoratorNode } from "../DecoratorNode";

export class TrueDecoratorNode extends DecoratorNode {
    constructor() {
        super()
    }

    public OnExcute(player, actCompleted): BTStatus {
        this.childNode.Tick(player, actCompleted)
        return BTStatus.Success;
    }
}