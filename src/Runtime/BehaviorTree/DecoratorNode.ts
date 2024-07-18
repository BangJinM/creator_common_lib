import { BehaviourNodeType } from "./BTStatus";
import { TreeNode } from "./TreeNode";

export class DecoratorNode extends TreeNode {
    childNode: TreeNode = null

    constructor() {
        super()
        this.behaviourNodeType = BehaviourNodeType.DecoratorNode
    }

    /** 添加修饰节点 */
    public AddDecoratorNode(treeNode: TreeNode) {
        this.childNode = treeNode;
    }
    /** 移除修饰节点 */
    public RemoveDecoratorNode() {
        this.childNode = null;
    }
}