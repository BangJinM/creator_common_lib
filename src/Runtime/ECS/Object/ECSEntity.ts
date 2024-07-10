import { IEntity } from "../Base/IEntity";

export class ECSEntity implements IEntity {
    /** 本实体所有组件 */
    components: Set<number> = new Set()

    AddComponent(key: number) {
        this.components.add(key)
    }
    RemoveComponent(key: number) {
        this.components.delete(key)
    }
    GetComponents(): Set<number> {
        return this.components
    }
}