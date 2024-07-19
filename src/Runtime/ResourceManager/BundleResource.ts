import * as cc from "cc";
import { IResource } from "./IResource";

/** bundle 资源加载 */
export class BundleResource extends IResource {
    Load(): Promise<cc.Asset> {
        return new Promise((success) => {
            this.bundleCache.bundle.load(this.url, this.type, (error, asset) => {
                this.SetAsset(asset);
                success(asset);
            });
        });
    }
}
