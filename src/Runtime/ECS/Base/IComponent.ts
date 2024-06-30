/**
 * ECS世界中的组件
 */
export class IComponent {
    /** 脏数据 */
    dirty = false;
    /**
     * 设置标记，表示对象需要更新。
     */
    Mark(): void { this.dirty = true }
    /**
     * 检查对象是否已被标记为脏状态，即需要更新。
     * 
     * @returns {boolean} - 如果对象被标记为脏，则返回true，否则返回false。
     */
    Dirty(): boolean { return this.dirty }
}
