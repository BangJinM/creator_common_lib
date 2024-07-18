import { BehaviourNodeType, BTStatus } from './BTStatus';

export class TreeNode {

    /** 运行状态 */
    protected btStatus: BTStatus = BTStatus.IDLE;
    /** 节点名字 */
    protected nodeName: string = "";
    // /** 节点ID */
    // protected nodeID: number = -1;
    /** 节点类型 */
    protected behaviourNodeType: BehaviourNodeType;

    public parentNode: TreeNode;

    public constructor() {
        this.nodeName = this.GetNodeName();
    }

    public GetNodeName(): string {
        return typeof (this);
    }

    /** 进入当前节点 */
    public OnEnter(player, actCompleted) {
        this.btStatus = BTStatus.Running;
    }

    /** 执行当前节点 */
    public OnExcute(player, actCompleted): BTStatus {
        return BTStatus.Success;
    }

    /** 推出当前节点 */
    public OnLeave(player, actCompleted) {
        this.btStatus = BTStatus.IDLE;
    }

    /** 更新 */
    public Tick(player, actCompleted): BTStatus {
        let status: BTStatus = BTStatus.IDLE;
        if (this.btStatus == BTStatus.IDLE)
            this.OnEnter(player, actCompleted);
        status = this.OnExcute(player, actCompleted);
        if (this.btStatus != BTStatus.Running)
            this.OnLeave(player, actCompleted);
        return status;
    }

}