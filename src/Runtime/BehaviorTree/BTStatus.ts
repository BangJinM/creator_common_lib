export enum BTStatus {
    /** 初始状态 */
    IDLE,
    /** 运行 */
    Running,
    /** 成功 */
    Success,
    /** 失败 */
    Failure,
    /** 终止 */
    Aborted,
}

export enum BehaviourNodeType {
    /** 组合节点 */
    CompositeNode,
    /** 叶子节点 */
    LeafNode,
    /** 条件节点 */
    ConditionNode,
    /** 条件节点 */
    DecoratorNode,
}