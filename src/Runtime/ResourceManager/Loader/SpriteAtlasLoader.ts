import * as cc from "cc";
import { CacheManager } from "../CacheManager";
import { IResource, LoadAssetResultCallback } from "../IResource";
import { IResourceLoader } from "./IResourceLoader";

export class SpriteAtlasLoader extends IResourceLoader {
    GetFrameData(str: string) {
        if (str.length < 13) {
            return null;
        }
        let newStr: string = str;
        newStr = newStr.slice(2);
        newStr = newStr.slice(0, newStr.length - 2);
        let newList_0: string[] = newStr.split('},{');
        let newList_1: string[] = newList_0[0].split(",");
        let newList_2: string[] = newList_0[1].split(",");
        if (newList_1.length < 2 || newList_2.length < 2) {
            return null;
        }
        return new cc.Rect(parseInt(newList_1[0]), parseInt(newList_1[1]), parseInt(newList_2[0]), parseInt(newList_2[1]));
    }

    GetSizeData(str: string) {
        if (str.length < 5) {
            return null;
        }
        let newStr: string = str;
        newStr = newStr.slice(1);
        newStr = newStr.slice(0, newStr.length - 1);
        let newList_0: string[] = newStr.split(',');
        if (newList_0.length < 2) {
            return null;
        }
        return new cc.Size(parseInt(newList_0[0]), parseInt(newList_0[1]));
    }
    GetOffsetData(str: string) {
        if (str.length < 5) {
            return null;
        }
        let newStr: string = str;
        newStr = newStr.slice(1);
        newStr = newStr.slice(0, newStr.length - 1);
        let newList_0: string[] = newStr.split(',');
        if (newList_0.length < 2) {
            return null;
        }
        return new cc.Vec2(parseInt(newList_0[0]), parseInt(newList_0[1]));
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
                        childSpriteFrame.reset({
                            texture: spriteFrame.texture,
                            rect: this.GetFrameData(spriteFrameInfo.frame),
                            isRotate: spriteFrameInfo.rotated,
                            offset: this.GetOffsetData(spriteFrameInfo.offset),
                            originalSize: this.GetSizeData(spriteFrameInfo.sourceSize)
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
