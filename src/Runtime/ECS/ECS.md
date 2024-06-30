### ECS
#### 组成
    系统
    世界
    组件
    实体

#### 对应关系
1. 世界
   1. 系统
   2. 实体
   3. 组件
2. 系统
   1. 组件
3. 实体
   1. 组件

### 接口

IECSWorld.ts
``` ts
    /**
     * 向世界中添加一个系统。
     * @param system 要添加的系统，实现IECSSystem接口。
     */
    AddSystem<T extends IECSSystem>(systemType: new () => T, args: any[]): T

    /**
     * 从世界中删除一个系统。
     * @param system 要删除的系统，实现IECSSystem接口。
     */
    RemoveSystem<T extends IECSSystem>(systemType: new () => T): void

    /**
     * 根据类型获取系统实例。
     * @param systemType 要获取的系统类型，需要继承自IECSSystem。
     * @returns 返回指定类型的系统实例。
     */
    GetSystem<T extends IECSSystem>(systemType: new () => T): T

    /**
     * 根据类型获取系统实例。
     * @param systemType 要获取的系统类型，需要继承自IECSSystem。
     * @returns 返回指定类型的系统实例。
     */
    GetSystemIndex<T extends IECSSystem>(systemType: new () => T): number
```
``` ts
    /**
     * 在世界中创建一个新的实体。
     * @returns 新创建的实体的唯一标识符。
     */
    CreateEntity(): number

    /**
     * 从世界中删除一个实体。
     * @param entity 要删除的实体的唯一标识符。
     */
    RemoveEntity(entity: number): void
```

``` ts
    /**
     * 给指定实体添加一个组件。
     * @param entity 要添加组件的实体的唯一标识符。
     * @param component 要添加的组件实例，实现IComponent接口。
     */
    AddComponent<T extends IComponent>(entity: number, compC:new() => T): T

    /**
     * 从指定实体上移除一个组件。
     * @param entity 要移除组件的实体的唯一标识符。
     * @param componentType 要移除的组件类型。
     */
    RemoveComponent<T extends IComponent>(entity: number, compC: new () => T): void

    /**
     * 获取指定实体上的组件。
     * @param entity 要获取组件的实体的唯一标识符。
     * @param componentType 要获取的组件类型。
     * @returns 返回对应类型的组件实例，如果没有找到则返回undefined。
     */
    GetComponent<T extends IComponent>(entity: number, compC: new () => T): T
    GetComponentIndex<T extends IComponent>(entity: number, compC: new () => T): number
```

IECSSystem.ts
``` ts
    /**
     * 当实体进入时触发。
     * @param entity 进入的实体的唯一标识符。
     */
    OnEntityEnter(entity: number): void;

    /**
     * 当实体离开时触发。
     * @param entity 离开的实体的唯一标识符。
     */
    OnEntityExit(entity: number): void;

    /**
     * 每帧更新时调用，用于处理实体的状态更新。
     * @param entity 需要更新的实体的唯一标识符。
     */
    OnUpdate(entity: number): void;
```

IComponent.ts
``` ts
    /** 脏数据 */
    dirty = false;
    /**
     * 设置标记，表示对象需要更新。
     */
    Mark(): void { this.dirty = true }
    /**
     * 检查对象是否已被标记为脏状态，即需要更新。
     * 
     * @returns {boolean} - 如果对象被标记为脏，则返回true，否则返回false。
     */
    Dirty(): boolean { return this.dirty }
```
#### 问题
