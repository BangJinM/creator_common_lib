import * as cc from "cc";
import { IResourceLoader } from "./IResourceLoader";

/** Scene 加载 */
export class SceneLoader extends IResourceLoader {
    Load(): void {
        let bundleCache = this.iResource.bundleCache
        let url = this.iResource.url
        bundleCache.bundle.loadScene(url, null, (error, asset) => {
            this.iResource.SetAsset(asset);
            this.iResource.LoadSuccess()
        });
    }
}
