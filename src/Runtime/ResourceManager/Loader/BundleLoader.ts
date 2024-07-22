import * as cc from "cc";
import { IResourceLoader } from "./IResourceLoader";

/** bundle 资源加载 */
export class BundleLoader extends IResourceLoader {
    Load(): Promise<cc.Asset> {
        return new Promise((success) => {
            this.bundleCache.bundle.load(this.url, this.type, (error, asset) => {
                this.SetAsset(asset);
                success(asset);
            });
        });
    }
}
