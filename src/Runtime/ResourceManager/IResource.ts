import * as cc from "cc";
import { ResourceArgs } from "./ResourceArgs";

export class IResource extends ResourceArgs {
    oriAsset: cc.Asset = null;
    dependAssets: cc.Asset[] = [];

    SetAsset(asset: cc.Asset) {
        this.oriAsset = asset;
        asset.addRef();
        this.bundleCache?.AddRef()
    }
    AddDepends(depends: cc.Asset[]) {
        for (const dependAsset of depends) {
            dependAsset.addRef();
            this.dependAssets.push(dependAsset);
        }
    }
    Release() {
        this.oriAsset.decRef();
        for (const dependAsset of this.dependAssets) {
            dependAsset?.decRef();
        }
        this.bundleCache?.AddRef()
        if (this.bundleCache) return;
        cc.assetManager.releaseAsset(this.oriAsset);
    }
    UnuseAsset() {
        if (!this.oriAsset) return true
        return this.oriAsset.refCount <= 1
    }
}