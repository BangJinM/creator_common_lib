import * as cc from "cc";
import { IResourceLoader } from "./IResourceLoader";


export class RemoteLoader extends IResourceLoader {
    Load(): Promise<cc.Asset> {
        let extraData = this.options.version;
        return new Promise((success) => {
            cc.assetManager.loadRemote(this.url + extraData, null, (error, asset) => {
                this.SetAsset(asset);
                success(asset);
            });
        });
    }
}
