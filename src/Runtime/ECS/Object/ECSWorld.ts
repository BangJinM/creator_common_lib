import { IComponent } from "../Base/IComponent";
import { IECSSystem } from "../Base/IECSSystem";
import { IECSWorld } from "../Base/IECSWorld";
import { IEntity } from "../Base/IEntity";
import { SingleObject } from "../Base/SingleObject";
import { GetComponentSystem } from "../ECSDefines";
import { ECSEntity } from "./ECSEntity";

export class ECSWorld implements IECSWorld {
    /** 实体列表 */
    entities: SingleObject<IEntity> = new SingleObject()
    /** 系统ID */
    systems: SingleObject<IECSSystem> = new SingleObject()
    /** 组件列表 */
    components: SingleObject<IComponent> = new SingleObject()


    AddSystem<T extends IECSSystem>(systemC: new () => T, args: any[] = []): T {
        let sysId = this.GetSystemKey(systemC)
        if (sysId >= 0) return this.systems.GetObject(sysId) as T

        let system = Reflect.construct(systemC, args)
        sysId = this.systems.CreateObject(system)
        system.ecsWorld = this
        system.OnEnter()
        return system
    }

    RemoveSystem<T extends IECSSystem>(systemC: new () => T): void {
        let sysId = this.GetSystemKey(systemC)
        if (sysId < 0) return

        let system = this.systems.GetObject(sysId)
        for (const entity of system.GetEntities()) {
            let object = this.entities.GetObject(entity)
            for (const compId of object.GetComponents()) {
                let comp = this.components.GetObject(compId)
                if (GetComponentSystem(typeof (comp)) == systemC) {
                    object.RemoveComponent(compId)
                    this.components.RemoveObject(compId)
                }
            }
            system.OnEntityExit(entity)
        }
        this.systems.RemoveObject(sysId)
        system.OnExit()
    }

    GetSystem<T extends IECSSystem>(systemC: new () => T): T {
        let sysId = this.GetSystemKey(systemC)
        if (sysId >= 0) return this.systems.GetObject(sysId) as T
        return null
    }

    GetSystemKey<T extends IECSSystem>(systemC: new () => T): number {
        let map = this.systems.GetObjects()
        for (const sysId of map.keys()) {
            if (this.systems.GetObject(sysId) instanceof systemC)
                return sysId
        }
        return -1
    }

    CreateEntity<T extends IEntity>(entityC: new () => T = null): number {
        if (!entityC)
            return this.entities.CreateObject(new ECSEntity())
        else
            return this.entities.CreateObject(Reflect.construct(entityC, []))
    }

    RemoveEntity(entity: number): void {
        let entityObject = this.entities.GetObject(entity) as ECSEntity
        if (!entityObject) return
        let comps = entityObject.GetComponents()
        for (const compId of comps) {
            let comp = this.components.GetObject(compId)

            let systemC = GetComponentSystem(comp.constructor.name)
            let system = this.GetSystem(systemC)
            if (system)
                system.OnEntityExit(entity)
            this.components.RemoveObject(compId)
        }
        return this.entities.RemoveObject(entity)
    }

    AddComponent<T extends IComponent>(entity: number, compC: new () => T): T {
        let entityObject = this.entities.GetObject(entity)
        if (!entityObject) return

        let system = this.GetSystem(GetComponentSystem(compC.name))
        if (!system) return

        let compId = this.GetComponentKey(entity, compC)
        if (compId >= 0) return this.components.GetObject(compId) as T

        let comp = Reflect.construct(compC, [])
        compId = this.components.CreateObject(comp)

        entityObject.AddComponent(compId)
        system.OnEntityEnter(entity)

        return comp
    }

    RemoveComponent<T extends IComponent>(entity: number, compC: new () => T): void {
        this.RemoveComponentKey(entity, this.GetComponentKey(entity, compC))
    }

    RemoveComponentKey(entity: number, compId: number) {
        let entityObject = this.entities.GetObject(entity)
        if (!entityObject) return

        let comp = this.components.GetObject(compId)
        if (!comp) return

        let system = this.GetSystem(GetComponentSystem(comp.constructor.name))
        if (!system) return

        entityObject.RemoveComponent(compId)
        this.components.RemoveObject(compId)
        system.OnEntityExit(entity)
    }
    GetComponent<T extends IComponent>(entity: number, compC: new () => T): T {
        let key = this.GetComponentKey(entity, compC)
        if (key >= 0) return this.components.GetObject(key) as T
        return null
    }

    GetComponentKey<T extends IComponent>(entity: number, compC: new () => T): number {
        let entityObject = this.entities.GetObject(entity)
        if (!entityObject) return -1

        for (const compKey of entityObject.GetComponents()) {
            if (this.components.GetObject(compKey) instanceof compC) {
                return compKey
            }
        }
        return -1
    }

    Update(deltaTime: number): void {
        for (const sysId of this.systems.GetObjects().keys()) {
            let system = this.systems.GetObject(sysId)
            system.OnUpdate(deltaTime)
        }
    }
}