import { Constructor, sys } from "cc";
import { IECSWorld } from "./IECSWorld";
import { IECSSystem } from "./IECSSystem";
import { IComponent } from "./IComponent";

export class ECSWorld implements IECSWorld {
    private systems: IECSSystem[] = [];

    systemComps: [] = [];

    /** 组件对应的实体 */
    private compEntity: Map<number, number> = new Map()
    /** 组件ID */
    private compSet: Set<number> = new Set<number>()
    /** 已经销毁的实体 */
    private deleteComps: number[] = [];

    /** 实体对应的组件 */
    private entityComp: number[][] = [];
    /** 实体ID */
    private entitySet: Set<number> = new Set<number>()
    /** 已经销毁的实体 */
    private deleteEntities: number[] = [];

    AddSystem<T extends IECSSystem>(systemType: new () => T, args: any[]): T {
        let system = Reflect.construct(systemType, args)
        this.systems.push(system)
        return system
    }

    RemoveSystem<T extends IECSSystem>(systemType: new () => T): void {
        let index = this.GetSystemIndex(systemType)
        if (index < 0) return null
        this.systems.splice(index, 1)
    }

    GetSystem<T extends IECSSystem>(systemType: new () => T): T {
        let index = this.GetSystemIndex(systemType)
        if (index >= 0) return this.systems[index] as T
        return null
    }

    GetSystemIndex<T extends IECSSystem>(systemType: new () => T): number {
        for (let index = 0; index < this.systems.length; index++) {
            if (this.systems[index] instanceof systemType) {
                return index
            }
        }
        return -1
    }

    CreateEntity(): number {
        let index = -1
        if (this.deleteEntities.length > 0) {
            index = this.deleteEntities.pop() as number
            this.entitySet.add(index)
        } else {
            index = this.entitySet.size
            this.entitySet.add(index)
        }

        this.entityComp[index] = []
        return index
    }

    RemoveEntity(entity: number): void {
        this.entitySet.delete(entity)
        this.deleteEntities.push(entity)

        for (let index = 0; index < this.systems.length; index++) {
            this.systems[index].OnEntityRemove(entity)
        }
    }
    AddComponent<T extends IComponent>(entity: number, component: T): void {
        throw new Error("Method not implemented.");
    }
    RemoveComponent(entity: number, componentType: any): void {
        throw new Error("Method not implemented.");
    }
    GetComponent(entity: number, componentType: any) {
        throw new Error("Method not implemented.");
    }

}