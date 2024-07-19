import * as cc from "cc"
import { ISingleton, set_manager_instance } from "../ISingleton"
import { ResourceArgs } from "./ResourceArgs"
import { IResource } from "./IResource"
import { Texture2DResource } from "./Texture2DResource"
import { SpriteFrameResource } from "./SpriteFrameResource"
import { SpriteAtlasResource } from "./SpriteAtlasResource"
import { BundleResource } from "./BundleResource"
import { RemoteResource } from "./RemoteResource"

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

                let promise = this.GetResoureLoader(args).Load()
                promise.then((asset) => {
                    loadingAsset = this.loading.get(key)
                    for (const iterator of loadingAsset.get(args.url)) {
                        iterator(asset)
                    }
                    this.loading.get(key).delete(args.url)
                })
            }
        )
    }

    GetResoureLoader(args: ResourceArgs): IResource {
        let resource = undefined
        if (args.bundleCache) { resource = new BundleResource(this) }
        else if (args.type == cc.SpriteFrame) { resource = new SpriteFrameResource(this) }
        else if (args.type == cc.Texture2D) { resource = new Texture2DResource(this) }
        else if (args.type == cc.SpriteAtlas) { resource = new SpriteAtlasResource(this) }
        else { resource = new RemoteResource(this) }

        resource.Copy(args)

        return resource
    }
}

