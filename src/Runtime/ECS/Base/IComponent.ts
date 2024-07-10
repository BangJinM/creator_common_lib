/**
 * 组件接口
 */
export interface IComponent {
    /**
     * 置为脏方法
     */
    Dirty(dirty: boolean): void;
    /**
     * 是否为脏
     */
    GetDirty(): boolean
}