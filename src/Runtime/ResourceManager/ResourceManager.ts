import * as cc from "cc"
import { ISingleton, set_manager_instance } from "../ISingleton"
import { ResourceArgs } from "./ResourceArgs"
import { TextureLoader } from "./Loader/TextureLoader"
import { SpriteFrameLoader } from "./Loader/SpriteFrameLoader"
import { SpriteAtlasLoader } from "./Loader/SpriteAtlasLoader"
import { BundleLoader } from "./Loader/BundleLoader"
import { RemoteLoader } from "./Loader/RemoteLoader"
import { IResourceLoader } from "./Loader/IResourceLoader"
import { SceneLoader } from "./Loader/SceneLoader"
import { CacheManager } from "./CacheManager"

@set_manager_instance()
export class ResourceManager extends ISingleton {
    /** 正在加载的资源列表 */
    private loading: Map<string, Map<string, Function[]>> = new Map()

    LoadAsset(args: ResourceArgs): Promise<cc.Asset> {
        let key = cc.js.getClassName(args.type)
        let loadingAsset = this.loading.get(key)
        if (!loadingAsset) {
            loadingAsset = new Map()
            this.loading.set(key, loadingAsset)
        }
        if (!loadingAsset.has(args.url)) {
            loadingAsset.set(args.url, [])
        } else {
            return new Promise((success) => {
                loadingAsset.get(args.url).push((asset) => {
                    success(asset)
                })
            })
        }

        return new Promise(
            (success) => {
                this.loading.get(key).get(args.url).push((asset) => {
                    success(asset)
                })

                let loader = this.GetResoureLoader(args)
                loader.Load().then((asset) => {
                    loadingAsset = this.loading.get(key)
                    for (const iterator of loadingAsset.get(args.url)) {
                        iterator(asset)
                    }
                    this.loading.get(key).delete(args.url)
                    if (asset && loader.options.needCache) CacheManager.GetInstance()?.AddAsset(loader);
                })
            }
        )
    }

    GetResoureLoader(args: ResourceArgs): IResourceLoader {
        let resource = undefined
        if (args.bundleCache) { resource = new BundleLoader(this) }
        else if (args.type == cc.SpriteFrame) { resource = new SpriteFrameLoader(this) }
        else if (args.type == cc.Texture2D) { resource = new TextureLoader(this) }
        else if (args.type == cc.SpriteAtlas) { resource = new SpriteAtlasLoader(this) }
        else if (args.type == cc.SceneAsset) { resource = new SceneLoader(this) }
        else { resource = new RemoteLoader(this) }

        resource.Copy(args)
        return resource
    }
}

