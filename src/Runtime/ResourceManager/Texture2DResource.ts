import * as cc from "cc";
import { ResourceArgs } from "./ResourceArgs";
import { IResource } from "./IResource";


export class Texture2DResource extends IResource {
    Load(): Promise<cc.Texture2D> {
        return new Promise((success) => {
            let newArgs = new ResourceArgs();
            newArgs.Copy(this);

            let promise = this.resourceFactory.LoadAsset(newArgs);
            promise.then(function (asset) {
                if (!asset) {
                    success(null);
                    return;
                }

                let texture = new cc.Texture2D();
                texture.image = asset as cc.ImageAsset;

                this.AddDepends([asset]);
                this.SetAsset(texture);

                success(texture);
            }.bind(this));
        });
    }
}
