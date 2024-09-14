import * as cc from "cc";
import { CacheManager } from "../CacheManager";
import { IResource } from "../IResource";
import { IResourceLoader } from "./IResourceLoader";
import { LoadAssetResultCallback } from "../ResourceDefines";

export class SpriteFrameLoader extends IResourceLoader {
    Load(): void {
        let url = this.iResource.url
        let options = this.iResource.options;
        let bundleCache = this.iResource.bundleCache

        let cacheManager: CacheManager = CacheManager.GetInstance() as CacheManager;
        let textureResource: IResource = cacheManager.GetAssetData(IResource.GetUName(url, cc.Texture2D))

        if (!textureResource) textureResource = cacheManager.CreateAsset(url, cc.Texture2D, bundleCache, options)

        let callback: LoadAssetResultCallback = (iResource: IResource) => {
            if (textureResource.IsFinish()) {
                if (!textureResource.oriAsset) {
                    this.iResource.SetAsset(null)
                    this.iResource.LoadSuccess()
                    return
                }

                let sp = new cc.SpriteFrame();
                sp.texture = textureResource.oriAsset as cc.Texture2D

                this.iResource.SetAsset(sp)
                this.iResource.AddDepends([textureResource])
                this.iResource.LoadSuccess()
            }
        };

        textureResource.Load(callback)
    }
}
