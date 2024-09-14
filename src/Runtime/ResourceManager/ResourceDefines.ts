import * as cc from "cc";
import { AssetRefComponent } from "./AssetRefComponent";
import { BundleCache } from "./BundleCache";
import { CacheManager } from "./CacheManager";
import { IResource } from "./IResource";
import { ResourceArgs } from "./ResourceArgs";

export type LoadAssetResultCallback = (iResource: IResource) => void;
export type AssetType = cc.Constructor<cc.Asset>
/** 使用bundle.load直接加载spriteFrame */
export let USE_SPRITE_BUNDLE_LOAD = true
/** 延迟卸载资源 */
export let DELAY_RELEASE_ASSET = true
export let ASSET_CACHE_FLAG = "user_data_asset_cache_flag__"
export let OBSERVER_XX_PROPERTY_FLAG = "user_data_observer_xx_property_flag__"
export let REMOTE_RESOURCE_URL = "http://localhost:8080/"

/**
 * 资源加载参数
 */
export interface ResourceOptions {
    /** 版本 */
    version?: string;
    /** 是否进行存储 */
    needCache?: boolean;
}


/** 
 * 资源加载状态
 */
export enum AssetLoadStatus {
    /** 未加载 */
    Unload,
    /** 正在加载 */
    Loading,
    /** 加载失败 */
    Failed,
    /** 加载成功 */
    Success,
}


export class Resources {
    static LoadAsset(fName: string, resourceType: AssetType, bundleCache: BundleCache, callback: LoadAssetResultCallback = (iResource: IResource) => { }) {
        let cacheManager: CacheManager = CacheManager.GetInstance() as CacheManager
        let iResource: IResource = cacheManager.GetAssetData(ResourceArgs.GetUName(fName, resourceType));
        if (iResource) {
            iResource.Load(callback)
            return
        }
        iResource.Load(callback)
    }

    static LoadSceneAsset(fName: string, bundleCache: BundleCache, callback: LoadAssetResultCallback) {
        return Resources.LoadAsset(fName, cc.SceneAsset, bundleCache, callback)
    }

    static LoadPrefabAsset(url: string, bundleCache: BundleCache, callback: LoadAssetResultCallback) {
        return Resources.LoadAsset(url, cc.Prefab, bundleCache, callback)
    }

    static LoadTextureAsset(url: string, bundleCache: BundleCache, callback: LoadAssetResultCallback) {
        return Resources.LoadAsset(url, cc.Texture2D, bundleCache, callback)
    }

    static LoadSpriteFrameAsset(url: string, bundleCache: BundleCache, callback: LoadAssetResultCallback) {
        return Resources.LoadAsset(url, cc.SpriteFrame, bundleCache, callback)
    }

    static LoadSpriteAtlasAsset(url: string, bundleCache: BundleCache, callback: LoadAssetResultCallback) {
        return Resources.LoadAsset(url, cc.SpriteAtlas, bundleCache, callback)
    }

    static LoadAudioClipAsset(url: string, bundleCache: BundleCache, callback: LoadAssetResultCallback) {
        return Resources.LoadAsset(url, cc.AudioClip, bundleCache, callback)
    }


    /**
     * 克隆时，需要增加引用
     */
    static AfterInstantiatePrefab(origin: cc.Prefab, clone: cc.Node) {
        let prefabRef: AssetRefComponent = clone.addComponent(AssetRefComponent)
        prefabRef.AddAsset(origin)
    }
    /**
     * 克隆时，需要增加引用
     */
    static AfterInstantiateNode(clone: cc.Node) {
        let assetRefs = clone.getComponentsInChildren(AssetRefComponent)
        for (let i = 0; i < assetRefs.length; i++) {
            assetRefs[i].assets.forEach(asset => {
                asset.addRef()
            })
        }
    }

    /**
     * 增加资源监听
     * @description 为什么要用这种方式？ 在游戏中资源改变是一个常见的事情，如果每一个资源改变，都调用addRef和decRef，会增加不必要的心智开销，所以这里采用这种方式、
     * @description 缺点：需要手动的调用ObserverPropertySetter，但可以通过统一的入口进行配置
     */
    static ObserverPropertySetter<T extends cc.Component>(target: T, propertyKey: string) {
        let descriptor = Object.getOwnPropertyDescriptor(target.constructor.prototype, propertyKey);

        if (!descriptor)
            return;

        const oldSet = descriptor.set;
        const oldGet = descriptor.get;

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

    static checkFunc(comp: cc.Component) {
        if (!comp)
            return false
        if (comp.hasOwnProperty(OBSERVER_XX_PROPERTY_FLAG))
            return false

        return true
    }

    static addObserverPropertyTag(comp: cc.Component) {
        Object.defineProperty(comp, OBSERVER_XX_PROPERTY_FLAG, {
            value: true,
            writable: false,
            enumerable: false,
        })
    }

    static ObserverSpriteProperty(sprite: cc.Sprite) {
        if (!Resources.checkFunc(sprite))
            return;

        Resources.addObserverPropertyTag(sprite)
        Resources.ObserverPropertySetter<cc.Sprite>(sprite, "spriteFrame");
        Resources.ObserverPropertySetter<cc.Sprite>(sprite, "spriteAtlas");
    }
    /** 增加Button资源监听 */
    static ObserverButtonProperty(button: cc.Button) {
        if (!Resources.checkFunc(button))
            return;
        Resources.addObserverPropertyTag(button)
        Resources.ObserverPropertySetter<cc.Button>(button, "normalSprite");
        Resources.ObserverPropertySetter<cc.Button>(button, "pressedSprite");
        Resources.ObserverPropertySetter<cc.Button>(button, "hoverSprite");
        Resources.ObserverPropertySetter<cc.Button>(button, "disabledSprite");
    }

    /** 增加Label资源监听 */
    static ObserverLabelProperty(label: cc.Label) {
        if (!Resources.checkFunc(label))
            return;
        Resources.addObserverPropertyTag(label)
        Resources.ObserverPropertySetter<cc.Label>(label, "font");
        Resources.ObserverPropertySetter<cc.Label>(label, "fontAtlas");
        Resources.ObserverPropertySetter<cc.Label>(label, "fontEx");
    }

    /** 增加AudioSource资源监听 */
    static ObserverAudioSourceProperty(audioSource: cc.AudioSource) {
        if (!Resources.checkFunc(audioSource))
            return;
        Resources.addObserverPropertyTag(audioSource)
        Resources.ObserverPropertySetter<cc.AudioSource>(audioSource, "clip");
    }

    /** 增加Tmx资源监听 */
    static ObserverTiledMapProperty(tiledMap: cc.TiledMap) {
        if (!Resources.checkFunc(tiledMap))
            return;
        Resources.addObserverPropertyTag(tiledMap)
        Resources.ObserverPropertySetter<cc.TiledMap>(tiledMap, "tmxAsset");
    }

    /** 克隆一个节点或者Prefab */
    static Clone(origin: cc.Node | cc.Prefab) {
        let node: cc.Node = cc.instantiate(origin) as cc.Node
        if (origin instanceof cc.Prefab) Resources.AfterInstantiatePrefab(origin, node)
        else Resources.AfterInstantiateNode(node)
        return node
    }

    /**
     * 设置图片
     */
    static LoadSpriteFrame(sprite: cc.Sprite, url: string, bundleCache?: BundleCache) {
        Resources.ObserverSpriteProperty(sprite)
        Resources.LoadSpriteFrameAsset(url, bundleCache, (spriteFrame: IResource) => {
            if (!cc.isValid(sprite)) return
            sprite.spriteFrame = spriteFrame.oriAsset as cc.SpriteFrame
        })
    }

    /**
     * 设置按钮
     */
    static LoadButton(button: cc.Button, normalSprite: string, pressedSprite: string, hoverSprite: string, disabledSprite: string, bundleCache?: BundleCache) {
        Resources.ObserverButtonProperty(button)

        if (normalSprite) {
            Resources.LoadSpriteFrameAsset(normalSprite, bundleCache, (spriteFrame: IResource) => {
                if (!cc.isValid(button)) return
                button.normalSprite = spriteFrame.oriAsset as cc.SpriteFrame
            })
        }
        if (pressedSprite) {
            Resources.LoadSpriteFrameAsset(pressedSprite, bundleCache, (spriteFrame: IResource) => {
                if (!cc.isValid(button)) return
                button.pressedSprite = spriteFrame.oriAsset as cc.SpriteFrame
            })
        }
        if (hoverSprite) {
            Resources.LoadSpriteFrameAsset(hoverSprite, bundleCache, (spriteFrame: IResource) => {
                if (!cc.isValid(button)) return
                button.hoverSprite = spriteFrame.oriAsset as cc.SpriteFrame
            })
        }
        if (disabledSprite) {
            Resources.LoadSpriteFrameAsset(disabledSprite, bundleCache, (spriteFrame: IResource) => {
                if (!cc.isValid(button)) return
                button.disabledSprite = spriteFrame.oriAsset as cc.SpriteFrame
            })
        }
    }

}