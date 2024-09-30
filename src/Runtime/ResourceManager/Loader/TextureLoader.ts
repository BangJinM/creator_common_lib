import * as cc from "cc";
import { CacheManager } from "../CacheManager";
import { IResource, LoadAssetResultCallback } from "../IResource";
import { IResourceLoader } from "./IResourceLoader";

/**
 * 图片资源加载
 */
export class TextureLoader extends IResourceLoader {
    Load(): void {
        let url = this.iResource.url
        let options = this.iResource.options;
        let bundleCache = this.iResource.bundleCache

        let cacheManager: CacheManager = CacheManager.GetInstance() as CacheManager;
        let imageResource: IResource = cacheManager.GetAssetData(IResource.GetUName(url, cc.ImageAsset))

        if (!imageResource) imageResource = cacheManager.CreateAsset(url, cc.Texture2D, bundleCache, options)

        let callback: LoadAssetResultCallback = (iResource: IResource) => {
            if (imageResource.IsFinish()) {
                if (!imageResource.oriAsset) {
                    this.iResource.SetAsset(null)
                    this.iResource.LoadSuccess()
                    return
                }

                let texture = new cc.Texture2D();
                texture.image = imageResource.oriAsset as cc.ImageAsset

                this.iResource.SetAsset(texture)
                this.iResource.AddDepends([imageResource])
                this.iResource.LoadSuccess()
            }
        };
        imageResource.Load(callback)
    }
}
