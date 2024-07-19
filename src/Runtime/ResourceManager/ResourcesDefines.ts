import * as cc from "cc";
import { AssetRefComponent } from "./AssetRefComponent";

export type AssetType = cc.Constructor<cc.Asset>
/** 使用bundle.load直接加载spriteFrame */
export let USE_SPRITE_BUNDLE_LOAD = true
/** 延迟卸载资源 */
export let DELAY_RELEASE_ASSET = true
export let ASSET_CACHE_FLAG = "user_data_asset_cache_flag__"
export let OBSERVER_XX_PROPERTY_FLAG = "user_data_observer_xx_property_flag__"

/** 设置需要监听的get 和set */
function ObserverPropertySetter<T extends cc.Component>(target: T, propertyKey: string, beforeSetterFunc?: Function, afterSetterFunc?: Function) {
    let descriptor = Object.getOwnPropertyDescriptor(target.constructor.prototype, propertyKey)

    if (!descriptor)
        return

    const oldSet = descriptor.set
    const oldGet = descriptor.get

    Object.defineProperty(target, propertyKey, {
        get: oldGet,
        set: function (value: any | null) {
            let oldValue = oldGet?.call(this)
            if (oldValue === value)
                return

            let refComp: AssetRefComponent | null = null
            refComp = this.node.getComponent(AssetRefComponent)
            if (refComp) {
                refComp.DelAsset(oldValue)
            }

            oldSet?.call(this, value)

            if (value && value[ASSET_CACHE_FLAG]) {
                if (!refComp)
                    refComp = this.node.addComponent(AssetRefComponent)
                refComp?.AddAsset(value)
            }
        },
        enumerable: true,
        configurable: true
    });
}

/**
 * 增加Sprite资源监听
 * @description 为什么要用这种方式 
 * @description 第一个方案是CustomSprite继承Sprite x
 * @description 第二个方案是运行时注入Sprite的Setter和OnDestroy x
 * @description 第三个方案是全程交给业务层管理使用SpriteFrameRefComponent √
 * @description 在一个方案中缺陷是 在Button中，得先移除老的Sprite再新增CustomSprite，会移除Sprite失败，CustomSprite和Sprite同时存在
 * @param sprite 
 * @returns 
 */
export function ObserverSpriteProperty(sprite: cc.Sprite) {
    if (!sprite)
        return

    if (!cc.isValid(sprite.node))
        return

    if (sprite[OBSERVER_XX_PROPERTY_FLAG])
        return

    sprite[OBSERVER_XX_PROPERTY_FLAG] = true

    ObserverPropertySetter<cc.Sprite>(sprite, "spriteFrame")
    ObserverPropertySetter<cc.Sprite>(sprite, "spriteAtlas")
}

/** 增加Button资源监听 */
export function ObserverButtonProperty(button: cc.Button) {
    if (!button)
        return

    if (button[OBSERVER_XX_PROPERTY_FLAG])
        return

    button[OBSERVER_XX_PROPERTY_FLAG] = true

    ObserverPropertySetter<cc.Button>(button, "normalSprite")
    ObserverPropertySetter<cc.Button>(button, "pressedSprite")
    ObserverPropertySetter<cc.Button>(button, "hoverSprite")
    ObserverPropertySetter<cc.Button>(button, "disabledSprite")
}

/** 增加Label资源监听 */
export function ObserverLabelProperty(label: cc.Label) {
    if (!label)
        return

    if (label[OBSERVER_XX_PROPERTY_FLAG])
        return

    label[OBSERVER_XX_PROPERTY_FLAG] = true

    ObserverPropertySetter<cc.Label>(label, "font")
    ObserverPropertySetter<cc.Label>(label, "fontAtlas")
    ObserverPropertySetter<cc.Label>(label, "fontEx")
}

/** 增加AudioSource资源监听 */
export function ObserverAudioSourceProperty(audioSource: cc.AudioSource) {
    if (!audioSource)
        return

    if (audioSource[OBSERVER_XX_PROPERTY_FLAG])
        return

    audioSource[OBSERVER_XX_PROPERTY_FLAG] = true
    ObserverPropertySetter<cc.AudioSource>(audioSource, "clip")
}

/** 增加Tmx资源监听 */
export function ObserverTiledMapProperty(tiledMap: cc.TiledMap) {
    if (!tiledMap)
        return

    if (!cc.isValid(tiledMap.node))
        return

    if (tiledMap[OBSERVER_XX_PROPERTY_FLAG])
        return

    tiledMap[OBSERVER_XX_PROPERTY_FLAG] = true

    ObserverPropertySetter<cc.TiledMap>(tiledMap, "tmxAsset")
}

export function asyncify(cb: ((p1?: any, p2?: any) => void) | null): (p1?: any, p2?: any) => void {
    return (p1, p2): void => {
        if (!cb) { return; }
        const refs: cc.Asset[] = [];
        if (Array.isArray(p2)) {
            p2.forEach((x): number | boolean => x instanceof cc.Asset && refs.push(x.addRef()));
        } else if (p2 instanceof cc.Asset) {
            refs.push(p2.addRef());
        }
        cc.misc.callInNextTick((): void => {
            refs.forEach((x): cc.Asset => x.decRef(false));
            cb(p1, p2);
        });
    };
}

@cc._decorator.ccclass("BundleCache")
export class BundleCache {
    /** 路径或者名字 */
    @cc._decorator.property(String)
    url: string = ""
    /** bundle */
    @cc._decorator.property(cc.AssetManager.Bundle)
    bundle: cc.AssetManager.Bundle | null = null
    @cc._decorator.property(Number)
    refCount = 0

    AddRef() { this.refCount++ }
    DecRef() { this.refCount-- }
}

export class AssetCache {
    /** 路径 */
    url: string | null = null
    /** 资源类型 */
    type: AssetType | null = null
    /** bundle缓存 */
    bundle: BundleCache | null = null
    /** 依赖的资源 */
    depends: cc.Asset[] = []
    /** 这个资源未使用时，可用，releaseTime<= 0卸载资源 */
    releaseTime = 0

    static Create(url: string, type: AssetType, bundle: BundleCache | null, depends: cc.Asset[]) {
        let asset = new AssetCache()
        asset.url = url
        asset.type = type
        asset.bundle = bundle
        asset.depends = depends

        for (const iterator of depends) {
            iterator.addRef()
        }

        asset.bundle?.AddRef()
        return asset
    }

    Destroy() {
        for (const asset of this.depends) {
            asset.decRef()
        }
        if (this.bundle) {
            this.bundle.DecRef()
        }
    }
}

