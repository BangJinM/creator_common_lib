import * as cc from "cc";
import { ResourceArgs } from "../ResourceArgs";
import { IResourceLoader } from "./IResourceLoader";

export class SpriteFrameLoader extends IResourceLoader {
    Load(): Promise<cc.SpriteFrame> {
        return new Promise((success) => {
            let newArgs = new ResourceArgs();
            newArgs.Copy(this);

            let promise = this.resourceFactory.LoadAsset(newArgs);
            promise.then(function (asset) {
                if (!asset) {
                    success(null);
                    return;
                }

                let sp = new cc.SpriteFrame();
                sp.texture = asset as cc.Texture2D;

                this.AddDepends([asset]);
                this.SetAsset(sp);

                success(sp);
            }.bind(this));
        });
    }
}
