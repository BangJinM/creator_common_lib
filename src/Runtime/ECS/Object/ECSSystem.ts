import { IECSSystem } from "../Base/IECSSystem";

export class ECSSystem implements IECSSystem {

    /** 本系统中的实体 */
    entities: Set<number> = new Set<number>()

    GetEntities() {
        return this.entities
    }

    OnEntityEnter(entity: number): void {
        this.entities.add(entity)
    }
    OnEntityExit(entity: number): void {
        this.entities.delete(entity)
    }
    OnUpdate(entity: number): void {

    }
}