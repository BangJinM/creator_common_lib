import * as cc from "cc";
import { IResourceLoader } from "./IResourceLoader";

export class BundleLoader extends IResourceLoader {
    Load(): void {
        let url = this.iResource.url
        let options = this.iResource.options
        let assetType = this.iResource.assetType
        let extraData = options.version || "";
        if (assetType == cc.SpriteFrame)
            url += "/spriteFrame"
        else if (assetType == cc.Texture2D)
            url += "/texture"
        this.iResource.bundleCache.bundle.load(url + extraData, assetType, (error: Error, asset: cc.Asset) => {
            this.iResource.SetAsset(asset);
            this.iResource.LoadSuccess()
        });
    }
}
