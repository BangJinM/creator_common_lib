import * as cc from "cc";
import { IResourceLoader } from "./IResourceLoader";

/** Scene 加载 */
export class SceneLoader extends IResourceLoader {
    Load(): Promise<cc.Asset> {
        return new Promise((success) => {
            this.bundleCache.bundle.loadScene(this.url, null, (error, asset) => {
                this.SetAsset(asset);
                success(asset);
            });
        });
    }
}
