import { IECSSystem } from "../Base/IECSSystem";
import { ECSWorld } from "./ECSWorld";

export class ECSSystem implements IECSSystem {
    /** 本系统中的实体 */
    entities: Set<number> = new Set<number>()
    ecsWorld: ECSWorld = null

    constructor(ecsWorld: ECSWorld) {
        this.ecsWorld = ecsWorld
    }

    GetEntities() {
        return this.entities
    }

    OnEntityEnter(entity: number): void {
        this.entities.add(entity)
    }
    OnEntityExit(entity: number): void {
        this.entities.delete(entity)
    }
    OnUpdate(deltaTime: number): void {

    }
    OnEnter(): void {
    }
    OnExit(): void {
    }
}