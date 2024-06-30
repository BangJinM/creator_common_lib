import { IECSWorld } from "ccl/src/Runtime/ECS/Base/IECSWorld";
import { IECSSystem } from "ccl/src/Runtime/ECS/Base/IECSSystem";
import { IComponent } from "ccl/src/Runtime/ECS/Base/IComponent";
import { ObjectKey } from "../Base/ObjectKey";
import { GetComponentSystem } from "../Base/ECSDefines";

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

    /** 实体与组件的映射 */
    entityComps = new Map<number, Set<number>>()
    /** 系统与组件的映射 */
    systempComps = new Map<number, Set<number>>()

    AddSystem<T extends IECSSystem>(systemC: new () => T, args: any[]): T {
        let index = this.GetSystemKey(systemC)
        if (index >= 0) return this.systems[index]
        let system = Reflect.construct(systemC, args)

        index = this.systemIds.CreateObject()
        this.systems.set(index, system)
        this.systempComps.set(index, new Set())
        return system
    }

    RemoveSystem<T extends IECSSystem>(systemC: new () => T): void {
        let index = this.GetSystemKey(systemC)
        if (index < 0) return null

        let comps = this.systempComps.get(index)
        for (const compId of comps) {

        }

        this.systems.delete(index)
        this.systemIds.RemoveObject(index)
    }

    GetSystem<T extends IECSSystem>(systemC: new () => T): T {
        let index = this.GetSystemKey(systemC)
        if (index >= 0) return this.systems[index] as T
        return null
    }

    GetSystemKey<T extends IECSSystem>(systemC: new () => T): number {
        for (const key of this.systems.keys()) {
            if (this.systems.get(key) instanceof systemC)
                return key
        }

        return -1
    }

    CreateEntity(): number {
        let entity = this.entities.CreateObject()
        this.entityComps.set(entity, new Set())
        return entity
    }

    RemoveEntity(entity: number): void {
        return this.entities.RemoveObject(entity)
    }

    AddComponent<T extends IComponent>(entity: number, compC: new () => T): T {
        let entityObject = this.entityComps.get(entity)
        if (!entityObject) return

        let systemC = GetComponentSystem(compC.name)
        let systemKey = this.GetSystemKey(systemC)
        if (systemKey < 0) return

        let key = this.GetComponentKey(entity, compC)
        if (key >= 0) return this.comps.get(key) as T

        key = this.compIds.CreateObject()
        let comp = Reflect.construct(compC, [])
        this.comps.set(key, comp)

        this.entityComps.get(entity).add(key)
        this.systempComps.get(systemKey).add(key)
    }
    RemoveComponent<T extends IComponent>(entity: number, compC: new () => T): void {
        this.RemoveComponentKey(entity, this.GetComponentKey(entity, compC))
    }

    RemoveComponentKey(entity: number, key: number) {
        let comps = this.entityComps.get(entity)
        if (!comps) return

        // 在系统中删除
        this.systempComps
    }
    GetComponent<T extends IComponent>(entity: number, compC: new () => T): T {
        let index = this.GetComponentKey(entity, compC)
        if (index >= 0) return this.comps.get(index) as T
        return null
    }

    GetComponentKey<T extends IComponent>(entity: number, compC: new () => T): number {
        let comps = this.entityComps.get(entity)
        if (!comps || comps.size <= 0) return -1

        for (const compKey of comps) {
            if (this.comps.get(compKey) instanceof compC) {
                return compKey
            }
        }

        return -1
    }
}