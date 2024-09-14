import { IComponent } from "./IComponent";
import { IECSSystem } from "./IECSSystem";
import { IEntity } from "./IEntity";

/**
 * 定义了ECSWorld接口，代表一个实体组件系统的世界，管理所有实体和系统。
 */
export interface IECSWorld {

    /**
     * 向世界中添加一个系统。
     * @param system 要添加的系统，实现IECSSystem接口。
     */
    AddSystem<T extends IECSSystem>(systemC: new () => T, args: any[]): T

    /**
     * 从世界中删除一个系统。
     * @param system 要删除的系统，实现IECSSystem接口。
     */
    RemoveSystem<T extends IECSSystem>(systemC: new () => T): void

    /**
     * 根据类型获取系统实例。
     * @param systemC 要获取的系统类型，需要继承自IECSSystem。
     * @returns 返回指定类型的系统实例。
     */
    GetSystem<T extends IECSSystem>(systemC: new () => T): T

    /**
     * 根据类型获取系统实例。
     * @param systemC 要获取的系统类型，需要继承自IECSSystem。
     * @returns 返回指定类型的系统实例。
     */
    GetSystemKey<T extends IECSSystem>(systemC: new () => T): number

    /**
     * 在世界中创建一个新的实体。
     * @returns 新创建的实体的唯一标识符。
     */
    CreateEntity<T extends IEntity>(entityC: new () => T): number

    /**
     * 从世界中删除一个实体。
     * @param entity 要删除的实体的唯一标识符。
     */
    RemoveEntity(entity: number): void

    /**
     * 给指定实体添加一个组件。
     * @param entity 要添加组件的实体的唯一标识符。
     * @param component 要添加的组件实例，实现IComponent接口。
     */
    AddComponent<T extends IComponent>(entity: number, compC: new () => T): T

    /**
     * 从指定实体上移除一个组件。
     * @param entity 要移除组件的实体的唯一标识符。
     * @param componentType 要移除的组件类型。
     */
    RemoveComponent<T extends IComponent>(entity: number, compC: new () => T): void
    /**
     * 从指定实体上移除一个组件。
     * @param entity 要移除组件的实体的唯一标识符。
     * @param componentType 要移除的组件类型。
     */
    RemoveComponentKey(entity: number, key: number): void;
    /**
     * 获取指定实体上的组件。
     * @param entity 要获取组件的实体的唯一标识符。
     * @param componentType 要获取的组件类型。
     * @returns 返回对应类型的组件实例，如果没有找到则返回undefined。
     */
    GetComponent<T extends IComponent>(entity: number, compC: new () => T): T
    /**
     * 获取指定实体上的组件。
     * @param entity 要获取组件的实体的唯一标识符。
     * @param componentType 要获取的组件类型。
     * @returns 返回对应类型的组件实例，如果没有找到则返回undefined。
     */
    GetComponentKey<T extends IComponent>(entity: number, compC: new () => T): number

    Update(deltaTime: number): void
}