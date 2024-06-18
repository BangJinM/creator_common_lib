
export class IComponent {
    /** 实体ID */
    entity: number;
    /** 系统ID */
    system: number;
    /** 是否有脏数据 */
    dirty = false;

    Mark(): void { this.dirty = true }
    Dirty(): boolean { return this.dirty }
}
