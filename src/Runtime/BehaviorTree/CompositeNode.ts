import { BehaviourNodeType } from "./BTStatus";
import { TreeNode } from "./TreeNode";

export class CompositeNode extends TreeNode {
    public mChildren: Array<TreeNode> = null;

    constructor() {
        super()
        this.mChildren = new Array()
        this.behaviourNodeType = BehaviourNodeType.CompositeNode
    }

    /** 移除节点 */
    public RemoveNode(child: TreeNode) {
        this.mChildren.map((item, index) => {
            if (item == child) {
                this.mChildren.splice(index, 1)
            }
        })
    }

    /** 添加节点 */
    public AddChild(child: TreeNode) {
        this.mChildren.push(child);

    }

    /** 获取节点 */
    public GetNodeByIndex(index: number): TreeNode {
        if (index < this.mChildren.length)
            return this.mChildren[index];
        return null;
    }

    /** 获取节点数量 */
    public GetChildrenCount(): number {
        if (this.mChildren != null) {
            return this.mChildren.length;
        }
        return 0;
    }
}