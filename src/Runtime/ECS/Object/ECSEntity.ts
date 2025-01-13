import { IEntity } from "../Base/IEntity";

export class ECSEntity implements IEntity {
    /** 唯一ID */
    id: number = 0;
    /** 本实体所有组件 */
    components: Set<number> = new Set()

    constructor(id: number) {
        this.id = id
    }

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