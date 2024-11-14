import * as cc from "cc";
import { DEBUG } from "cc/env";
import { IObject } from "./IObject";
import { GetManagerPersistNode } from "./Utils/CocosUtils";

/**
 * 单例
 */
@cc._decorator.ccclass("ISingleton")
export abstract class ISingleton extends cc.Component implements IObject {
    private static _instance: ISingleton = null
    protected update(dt: number): void {
        this.Update(dt)
    }

    protected onDestroy(): void {
        this.Clean()
    }

    /** 单例获取方法，实际方法通过set_manager_instance装饰器设置 */
    public static GetInstance<T extends ISingleton>(this: typeof ISingleton): T {
        let _class = this as typeof ISingleton
        if (!_class._instance) {
            let node = GetManagerPersistNode(`__${_class.name}__`) as cc.Node
            _class._instance = node.addComponent(_class.name) as T

            if (DEBUG) {
                Object.defineProperty(window, _class.name, {
                    value: _class._instance
                });
            }
        }

        return _class._instance as T
    }

    public Init() { }
    public Update(deltaTime: number) { }
    public Clean() { }
}

