import * as cc from "cc";
import { AssetRefComponent } from "./AssetRefComponent";
import { BundleCache } from "./BundleCache";
import { CacheManager } from "./CacheManager";
import { IResource, LoadAssetResultCallback } from "./IResource";
import { AssetType, ResourceArgs } from "./ResourceArgs";
import { ASSET_CACHE_FLAG, OBSERVER_XX_PROPERTY_FLAG } from "./ResourceDefines";

export namespace Resources {
    export class Loader {
        static LoadAsset(fName: string, resourceType: AssetType, bundleCache: BundleCache, callback: LoadAssetResultCallback = (iResource: IResource) => { }) {
            let cacheManager: CacheManager = CacheManager.GetInstance() as CacheManager
            let iResource: IResource = cacheManager.GetAssetData(ResourceArgs.GetUName(fName, resourceType));
            if (iResource) {
                iResource.Load(callback)
                return
            }
            iResource = cacheManager.CreateAsset(fName, resourceType, bundleCache, {})
            iResource.Load(callback)
        }

        static LoadSceneAsset(fName: string, bundleCache: BundleCache, callback: LoadAssetResultCallback) {
            return Loader.LoadAsset(fName, cc.SceneAsset, bundleCache, callback)
        }

        static LoadPrefabAsset(url: string, bundleCache: BundleCache, callback: LoadAssetResultCallback) {
            return Loader.LoadAsset(url, cc.Prefab, bundleCache, callback)
        }

        static LoadTextureAsset(url: string, bundleCache: BundleCache, callback: LoadAssetResultCallback) {
            return Loader.LoadAsset(url, cc.Texture2D, bundleCache, callback)
        }

        static LoadSpriteFrameAsset(url: string, bundleCache: BundleCache, callback: LoadAssetResultCallback) {
            return Loader.LoadAsset(url, cc.SpriteFrame, bundleCache, callback)
        }

        static LoadSpriteAtlasAsset(url: string, bundleCache: BundleCache, callback: LoadAssetResultCallback) {
            return Loader.LoadAsset(url, cc.SpriteAtlas, bundleCache, callback)
        }

        static LoadAudioClipAsset(url: string, bundleCache: BundleCache, callback: LoadAssetResultCallback) {
            return Loader.LoadAsset(url, cc.AudioClip, bundleCache, callback)
        }
    }

    export class UIUtils {

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

        /** 克隆一个节点或者Prefab */
        static Clone(origin: cc.Node | cc.Prefab) {
            let node: cc.Node = cc.instantiate(origin) as cc.Node
            if (origin instanceof cc.Prefab) UIUtils.AfterInstantiatePrefab(origin, node)
            else UIUtils.AfterInstantiateNode(node)
            return node
        }

        /**
         * 设置图片
         */
        static LoadSpriteFrame(sprite: cc.Sprite, url: string, bundleCache?: BundleCache) {
            ResourceRef.ObserverSpriteProperty(sprite)
            Loader.LoadSpriteFrameAsset(url, bundleCache, (spriteFrame: IResource) => {
                if (!cc.isValid(sprite)) return
                sprite.spriteFrame = spriteFrame.oriAsset as cc.SpriteFrame
            })
        }
        /**
         * 设置按钮
         */
        static LoadButton(button: cc.Button, normalSprite: string, pressedSprite: string, hoverSprite: string, disabledSprite: string, bundleCache?: BundleCache) {
            ResourceRef.ObserverButtonProperty(button)

            if (normalSprite) {
                Loader.LoadSpriteFrameAsset(normalSprite, bundleCache, (spriteFrame: IResource) => {
                    if (!cc.isValid(button)) return
                    button.normalSprite = spriteFrame.oriAsset as cc.SpriteFrame
                })
            }
            if (pressedSprite) {
                Loader.LoadSpriteFrameAsset(pressedSprite, bundleCache, (spriteFrame: IResource) => {
                    if (!cc.isValid(button)) return
                    button.pressedSprite = spriteFrame.oriAsset as cc.SpriteFrame
                })
            }
            if (hoverSprite) {
                Loader.LoadSpriteFrameAsset(hoverSprite, bundleCache, (spriteFrame: IResource) => {
                    if (!cc.isValid(button)) return
                    button.hoverSprite = spriteFrame.oriAsset as cc.SpriteFrame
                })
            }
            if (disabledSprite) {
                Loader.LoadSpriteFrameAsset(disabledSprite, bundleCache, (spriteFrame: IResource) => {
                    if (!cc.isValid(button)) return
                    button.disabledSprite = spriteFrame.oriAsset as cc.SpriteFrame
                })
            }
        }
    }

    export class ResourceRef {
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
                set: function (value: cc.Asset) {
                    let oldValue = oldGet?.call(this);
                    if (oldValue === value)
                        return;

                    let refComp: AssetRefComponent | null = null;
                    refComp = this.node.getComponent(AssetRefComponent);
                    if (refComp) {
                        refComp.DelAsset(oldValue);
                    }

                    oldSet?.call(this, value);

                    if (value && value.hasOwnProperty(ASSET_CACHE_FLAG)) {
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
            if (!ResourceRef.checkFunc(sprite))
                return;

            ResourceRef.addObserverPropertyTag(sprite)
            ResourceRef.ObserverPropertySetter<cc.Sprite>(sprite, "spriteFrame");
            ResourceRef.ObserverPropertySetter<cc.Sprite>(sprite, "spriteAtlas");
        }
        /** 增加Button资源监听 */
        static ObserverButtonProperty(button: cc.Button) {
            if (!ResourceRef.checkFunc(button))
                return;
            ResourceRef.addObserverPropertyTag(button)
            ResourceRef.ObserverPropertySetter<cc.Button>(button, "normalSprite");
            ResourceRef.ObserverPropertySetter<cc.Button>(button, "pressedSprite");
            ResourceRef.ObserverPropertySetter<cc.Button>(button, "hoverSprite");
            ResourceRef.ObserverPropertySetter<cc.Button>(button, "disabledSprite");
        }

        /** 增加Label资源监听 */
        static ObserverLabelProperty(label: cc.Label) {
            if (!ResourceRef.checkFunc(label))
                return;
            ResourceRef.addObserverPropertyTag(label)
            ResourceRef.ObserverPropertySetter<cc.Label>(label, "font");
            ResourceRef.ObserverPropertySetter<cc.Label>(label, "fontAtlas");
            ResourceRef.ObserverPropertySetter<cc.Label>(label, "fontEx");
        }

        /** 增加AudioSource资源监听 */
        static ObserverAudioSourceProperty(audioSource: cc.AudioSource) {
            if (!ResourceRef.checkFunc(audioSource))
                return;
            ResourceRef.addObserverPropertyTag(audioSource)
            ResourceRef.ObserverPropertySetter<cc.AudioSource>(audioSource, "clip");
        }

        /** 增加Tmx资源监听 */
        static ObserverTiledMapProperty(tiledMap: cc.TiledMap) {
            if (!ResourceRef.checkFunc(tiledMap))
                return;
            ResourceRef.addObserverPropertyTag(tiledMap)
            ResourceRef.ObserverPropertySetter<cc.TiledMap>(tiledMap, "tmxAsset");
        }
    }
}
