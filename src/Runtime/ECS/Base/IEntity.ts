/**
 * 实体接口定义了实体的基本行为，实体是组件的容器。
 * 它负责添加、移除和获取实体上的组件。
 */
export interface IEntity {
    /**
     * 向实体添加一个组件。
     * @param key 组件的唯一标识符。使用数字键值来代表不同的组件类型。
     */
    AddComponent(key: number);

    /**
     * 从实体中移除一个组件。
     * @param key 组件的唯一标识符。通过此标识符来定位并移除特定的组件。
     */
    RemoveComponent(key: number);

    /**
     * 获取实体上所有组件的标识符集合。
     * @returns 返回一个Set集合，其中包含实体上所有组件的标识符。
     */
    GetComponents(): Set<number>;
}