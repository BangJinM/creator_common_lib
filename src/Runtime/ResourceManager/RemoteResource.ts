import * as cc from "cc";
import { IResource } from "./IResource";


export class RemoteResource extends IResource {
    Load(): Promise<cc.Asset> {
        let extraData = this.options.version;
        return new Promise((success) => {
            cc.assetManager.loadRemote((this.options.baseUrl || "") + this.url + extraData, null, (error, asset) => {
                this.SetAsset(asset);
                success(asset);
            });
        });
    }
}
