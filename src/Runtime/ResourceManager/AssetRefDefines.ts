import * as cc from "cc";
import { AssetRefComponent } from "./AssetRefComponent";
import { ASSET_CACHE_FLAG, OBSERVER_XX_PROPERTY_FLAG } from "./ResourcesDefines";

/**
 * 克隆时，需要增加引用
 */
export function AfterInstantiatePrefab(origin: cc.Prefab, clone: cc.Node) {
    let prefabRef: AssetRefComponent = clone.addComponent(AssetRefComponent)
    prefabRef.AddAsset(origin)
    ObserverXX(clone)
}
/**
 * 克隆时，需要增加引用
 */
export function AfterInstantiateNode(clone: cc.Node) {
    let assetRefs = clone.getComponentsInChildren(AssetRefComponent)
    for (let i = 0; i < assetRefs.length; i++) {
        assetRefs[i].assets.forEach(asset => {
            asset.addRef()
        })
    }
    ObserverXX(clone)
}

export function ObserverXX(node: cc.Node) {
    if (node["__observerXX__"]) return
    node["__observerXX__"] = true

    node.on(cc.NodeEventType.NODE_DESTROYED, () => {
        let refComp = node.getComponent(AssetRefComponent)
        if (refComp) {
            refComp.DelAllAssets()
        }
    })
    node.on(cc.NodeEventType.COMPONENT_REMOVED, (component) => {
        if (component instanceof AssetRefComponent) {
            console.error("AssetRefComponent被移除!!!!!!!!!!!!!!!!!!!!!!!!")
        }
    })
}

/**
 * 增加资源监听
 * @description 为什么要用这种方式？ 在游戏中资源改变是一个常见的事情，如果每一个资源改变，都调用addRef和decRef，会增加不必要的心智开销，所以这里采用这种方式、
 * @description 缺点：需要手动的调用ObserverPropertySetter，但可以通过统一的入口进行配置
 */
export function ObserverPropertySetter<T extends cc.Component>(target: T, propertyKey: string, beforeSetterFunc?: Function, afterSetterFunc?: Function) {
    let descriptor = Object.getOwnPropertyDescriptor(target.constructor.prototype, propertyKey);

    if (!descriptor)
        return;

    const oldSet = descriptor.set;
    const oldGet = descriptor.get;

    ObserverXX(this.node)

    Object.defineProperty(target, propertyKey, {
        get: oldGet,
        set: function (value: any | null) {
            let oldValue = oldGet?.call(this);
            if (oldValue === value)
                return;

            let refComp: AssetRefComponent | null = null;
            refComp = this.node.getComponent(AssetRefComponent);
            if (refComp) {
                refComp.DelAsset(oldValue);
            }

            oldSet?.call(this, value);

            if (value && value[ASSET_CACHE_FLAG]) {
                if (!refComp) {
                    refComp = this.node.addComponent(AssetRefComponent);
                }
                refComp?.AddAsset(value);
            }
        },
        enumerable: true,
        configurable: true
    });
}

export function ObserverSpriteProperty(sprite: cc.Sprite) {
    if (!sprite)
        return;

    if (sprite[OBSERVER_XX_PROPERTY_FLAG])
        return;

    sprite[OBSERVER_XX_PROPERTY_FLAG] = true;
    ObserverPropertySetter<cc.Sprite>(sprite, "spriteFrame");
    ObserverPropertySetter<cc.Sprite>(sprite, "spriteAtlas");
}
/** 增加Button资源监听 */
export function ObserverButtonProperty(button: cc.Button) {
    if (!button)
        return;

    if (button[OBSERVER_XX_PROPERTY_FLAG])
        return;

    button[OBSERVER_XX_PROPERTY_FLAG] = true;
    ObserverPropertySetter<cc.Button>(button, "normalSprite");
    ObserverPropertySetter<cc.Button>(button, "pressedSprite");
    ObserverPropertySetter<cc.Button>(button, "hoverSprite");
    ObserverPropertySetter<cc.Button>(button, "disabledSprite");
}

/** 增加Label资源监听 */
export function ObserverLabelProperty(label: cc.Label) {
    if (!label)
        return;

    if (label[OBSERVER_XX_PROPERTY_FLAG])
        return;

    label[OBSERVER_XX_PROPERTY_FLAG] = true;
    ObserverPropertySetter<cc.Label>(label, "font");
    ObserverPropertySetter<cc.Label>(label, "fontAtlas");
    ObserverPropertySetter<cc.Label>(label, "fontEx");
}

/** 增加AudioSource资源监听 */
export function ObserverAudioSourceProperty(audioSource: cc.AudioSource) {
    if (!audioSource)
        return;

    if (audioSource[OBSERVER_XX_PROPERTY_FLAG])
        return;

    audioSource[OBSERVER_XX_PROPERTY_FLAG] = true;
    ObserverPropertySetter<cc.AudioSource>(audioSource, "clip");
}

/** 增加Tmx资源监听 */
export function ObserverTiledMapProperty(tiledMap: cc.TiledMap) {
    if (!tiledMap)
        return;

    if (tiledMap[OBSERVER_XX_PROPERTY_FLAG])
        return;

    tiledMap[OBSERVER_XX_PROPERTY_FLAG] = true;
    ObserverPropertySetter<cc.TiledMap>(tiledMap, "tmxAsset");
}

