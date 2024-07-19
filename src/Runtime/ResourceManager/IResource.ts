import * as cc from "cc";
import { ResourceArgs } from "./ResourceArgs";
import { ResourceManager } from "./ResourceManager";

export class IResource extends ResourceArgs {
    resourceFactory: ResourceManager = null;
    oriAsset: cc.Asset = null;
    dependAssets: cc.Asset[] = [];
    constructor(resourceFactory: ResourceManager) {
        super();
        this.resourceFactory = resourceFactory;
    }
    Load(): Promise<cc.Asset> { return null; }
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
}
