import { IECSSystem } from "../Base/IECSSystem";
import { ECSWorld } from "./ECSWorld";

export class ECSSystem implements IECSSystem {
    /** 唯一ID */
    id: number = 0;
    /** 本系统中的实体 */
    entities: Set<number> = new Set<number>()
    ecsWorld: ECSWorld = null

    constructor(id: number, ecsWorld: ECSWorld) {
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