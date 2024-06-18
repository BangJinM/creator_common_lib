import { Constructor, sys } from "cc";
import { IECSWorld } from "./IECSWorld";
import { IECSSystem } from "./IECSSystem";
import { IComponent } from "./IComponent";

class ObjectKey {
    /** 有效的ID */
    private objects: Set<number> = new Set();
    /** 失效的ID列表 */
    private deleteObjects: number[] = [];

    RemoveObject(key: number) {
        if (!this.objects.has(key))
            return

        this.objects.delete(key)
        this.deleteObjects.push(key)
    }

    CreateObject() {
        let index = -1
        if (this.deleteObjects.length > 0) {
            index = this.deleteObjects.pop()
        } else {
            index = this.objects.size
        }

        this.objects.add(index)
        return index
    }
}

export class ECSWorld implements IECSWorld {
    /** 实体列表 */
    entities: ObjectKey = new ObjectKey()

    /** 系统ID */
    systemIds: ObjectKey = new ObjectKey()
    /** 系统 */
    systems: Map<number, IECSSystem> = new Map()

    /** 组件ID管理列表 */
    compIds: ObjectKey = new ObjectKey()
    /** 组件列表 */
    comps: Map<number, IComponent> = new Map()

    /** 组件与实体的映射关系 */
    entityComps = new Map<number, number[]>()
    /** 系统与组件的映射关系 */
    systempComps = new Map<number, number[]>()

    AddSystem<T extends IECSSystem>(systemType: new () => T, args: any[]): T {
        let index = this.GetSystemIndex(systemType)
        if (index >= 0) return this.systems[index]
        let system = Reflect.construct(systemType, args)

        index = this.systemIds.CreateObject()
        this.systems.set(index, system)
        return system
    }

    RemoveSystem<T extends IECSSystem>(systemType: new () => T): void {
        let index = this.GetSystemIndex(systemType)
        if (index < 0) return null
        this.systems.delete(index)

        let comps = this.systempComps.get(index)

        for (const compId of comps) {
            let comp = this.comps.get(compId)
            // this.RemoveComponent(comp.entity)
        }
    }

    GetSystem<T extends IECSSystem>(systemType: new () => T): T {
        let index = this.GetSystemIndex(systemType)
        if (index >= 0) return this.systems[index] as T
        return null
    }

    GetSystemIndex<T extends IECSSystem>(systemType: new () => T): number {
        this.systems.forEach((v, k) => {
            if (v instanceof systemType) {
                return k
            }
        });
        return -1
    }

    CreateEntity(): number {
        return this.entities.CreateObject()
    }

    RemoveEntity(entity: number): void {
        return this.entities.RemoveObject(entity)
    }

    AddComponent<T extends IComponent>(entity: number, systemType: new () => T): T {
        let index = this.GetComponentIndex(entity, systemType)
        if (index >= 0) return this.comps.get(index) as T

        index = this.compIds.CreateObject()
        let comp = Reflect.construct(systemType, [entity])
        this.comps.set(index, comp)

        this.entityComps.get(entity).push(index)
        this.systempComps.get(1).push(index)
    }
    RemoveComponent<T extends IComponent>(entity: number, systemType: new () => T): void {
        let index = this.GetComponentIndex(entity, systemType)
        if (index >= 0) {
            this.comps.delete(index)
            this.compIds.RemoveObject(index)
        }

        index = this.systempComps.get(1).indexOf(index)
        this.systempComps.get(1).splice(index, 1)
    }
    GetComponent<T extends IComponent>(entity: number, systemType: new () => T): T {
        let index = this.GetComponentIndex(entity, systemType)
        if (index >= 0) return this.comps.get(index) as T
        return null
    }
    GetComponentIndex<T extends IComponent>(entity: number, systemType: new () => T): number {
        let comps = this.entityComps.get(entity)
        if (comps.length <= 0) return -1

        for (const compId of comps) {
            if (this.comps.get(compId) instanceof systemType) {
                return compId
            }
        }
        return -1
    }
}