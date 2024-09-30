import * as cc from "cc";
import { IResourceLoader } from "./IResourceLoader";


export class RemoteLoader extends IResourceLoader {
    Load(): void {
        let url = this.iResource.url
        let options = this.iResource.options
        let extraData = options.version || "";
        cc.assetManager.loadRemote(url + extraData, null, (error: Error, asset: cc.Asset) => {
            this.iResource.SetAsset(asset);
            this.iResource.LoadSuccess()
        });
    }
}
