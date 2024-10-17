import * as cc from "cc";
import { CacheManager } from "../CacheManager";
import { IResource, LoadAssetResultCallback } from "../IResource";
import { IResourceLoader } from "./IResourceLoader";

export class SpriteAtlasLoader extends IResourceLoader {
    GetNumArray(str: string) {
        let regex: RegExp = /[0-9\-\.]+/g;
        let result: number[] = []

        while (true) {
            let t = regex.exec(str)
            if (!t) break
            result.push(parseInt(t[0]))
        }
        return result
    }


    Load(): void {
        let url = this.iResource.url
        let options = this.iResource.options;
        let bundleCache = this.iResource.bundleCache

        let cacheManager: CacheManager = CacheManager.GetInstance() as CacheManager;
        let spriteFrameResource: IResource = cacheManager.GetAssetData(IResource.GetUName(url, cc.SpriteFrame))
        let plistResource: IResource = cacheManager.GetAssetData(IResource.GetUName(url, cc.JsonAsset))

        if (!spriteFrameResource) spriteFrameResource = cacheManager.CreateAsset(url, cc.SpriteFrame, bundleCache, options)
        if (!plistResource) plistResource = cacheManager.CreateAsset(url, cc.JsonAsset, bundleCache, options)

        let callback: LoadAssetResultCallback = (iResource: IResource) => {
            iResource.oriAsset?.addRef()
            if (plistResource.IsFinish() && spriteFrameResource.IsFinish()) {
                plistResource.oriAsset?.decRef()
                spriteFrameResource.oriAsset?.decRef()

                if (!plistResource.oriAsset || !spriteFrameResource.oriAsset) {
                    this.iResource.SetAsset(null)
                    this.iResource.LoadSuccess()
                    return
                }

                let spriteFrame = spriteFrameResource.oriAsset as cc.SpriteFrame
                let plistAsset = plistResource.oriAsset as cc.Asset

                let customAtlas = new cc.SpriteAtlas(url)
                let frames = plistAsset._nativeAsset?.frames
                if (frames) {
                    for (const key of Object.keys(frames)) {
                        let childSpriteFrame = new cc.SpriteFrame()
                        let spriteFrameInfo = frames[key]

                        let array1 = this.GetNumArray(spriteFrameInfo.frame)
                        let array2 = this.GetNumArray(spriteFrameInfo.offset)
                        let array3 = this.GetNumArray(spriteFrameInfo.sourceSize)

                        childSpriteFrame.reset({
                            texture: spriteFrame.texture,
                            rect: new cc.Rect(...array1),
                            isRotate: spriteFrameInfo.rotated,
                            offset: new cc.Vec2(...array2),
                            originalSize: new cc.Size(...array3)
                        })
                        customAtlas.spriteFrames[key.replace(/.jpg|.png/, "")] = childSpriteFrame
                    }
                }

                this.iResource.SetAsset(customAtlas)
                this.iResource.AddDepends([spriteFrameResource, plistResource])
                this.iResource.LoadSuccess()
            }
        };

        plistResource.Load(callback)
        spriteFrameResource.Load(callback)
    }
}
