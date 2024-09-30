import * as cc from "cc";
import { IResourceLoader } from "ccl/src/Runtime/ResourceManager/Loader/IResourceLoader";


export class BundleLoader extends IResourceLoader {
    Load(): void {
        let url = this.iResource.url
        let options = this.iResource.options
        let extraData = options.version || "";
        this.iResource.bundleCache.bundle.load(url + extraData, (error: Error, asset: cc.Asset) => {
            this.iResource.SetAsset(asset);
            this.iResource.LoadSuccess()
        });
    }
}
