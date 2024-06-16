import { IComponent } from "./IComponent"

export interface ECSUtils {
    /**
     * 给指定实体添加一个组件。
     * @param entity 要添加组件的实体的唯一标识符。
     * @param component 要添加的组件实例，实现IComponent接口。
     */
    AddECSComponent<T extends IComponent>(entity: number, component: T): void

    /**
     * 从指定实体上移除一个组件。
     * @param entity 要移除组件的实体的唯一标识符。
     * @param componentType 要移除的组件类型。
     */
    RemoveECSComponent(entity: number, componentType: any): void

    /**
     * 获取指定实体上的组件。
     * @param entity 要获取组件的实体的唯一标识符。
     * @param componentType 要获取的组件类型。
     * @returns 返回对应类型的组件实例，如果没有找到则返回undefined。
     */
    GetECSComponent(entity: number, componentType: any): any
}