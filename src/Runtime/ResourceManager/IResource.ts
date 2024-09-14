import * as cc from "cc";
import { BundleCache } from "./BundleCache";
import { IResourceLoader } from "./Loader/IResourceLoader";
import { LoaderFactory } from "./Loader/LoaderFactory";
import { ResourceArgs } from "./ResourceArgs";
import { AssetLoadStatus, AssetType, LoadAssetResultCallback, ResourceOptions } from "./ResourceDefines";

export class IResource extends ResourceArgs {
    /** 加载的资源 */
    oriAsset: cc.Asset = null;
    /** 依赖的资源 */
    dependAssets: IResource[] = [];
    /** 加载回调 */
    callbacks: LoadAssetResultCallback[] = [];
    /** 加载状态 */
    loadState: AssetLoadStatus = AssetLoadStatus.Unload;
    /** 加载器 */
    loader: IResourceLoader = null

    constructor(url: string = "", type: AssetType = cc.Asset, bundleCache: BundleCache = null, options: ResourceOptions = { needCache: true, version: `${new Date().getDate()}` }) {
        super(url, type, bundleCache, options)
        this.loader = LoaderFactory.GetResoureLoader(this.assetType, this)
    }

    SetAsset(asset: cc.Asset) {
        this.oriAsset = asset;
        asset?.addRef();
        this.bundleCache?.AddRef()
    }
    AddDepends(depends: IResource[]) {
        for (const dependAsset of depends) {
            dependAsset.oriAsset?.addRef();
            this.dependAssets.push(dependAsset);
        }
    }
    Release() {
        this.oriAsset.decRef();
        for (const dependAsset of this.dependAssets) {
            dependAsset.oriAsset?.decRef();
        }
        this.bundleCache?.AddRef()
        if (this.bundleCache) return;
        cc.assetManager.releaseAsset(this.oriAsset);
    }
    UnuseAsset() {
        if (!this.oriAsset) return true
        return this.oriAsset.refCount <= 1
    }
    SetAssetLoadState(state: AssetLoadStatus) {
        this.loadState = state
    }
    LoadSuccess() {
        this.SetAssetLoadState(this.oriAsset ? AssetLoadStatus.Success : AssetLoadStatus.Failed)
        this.callbacks.forEach(callback => callback(this));
        this.callbacks.length = 0;
    }

    IsFinish() {
        return this.loadState == AssetLoadStatus.Success || this.loadState == AssetLoadStatus.Failed
    }

    Load(callback: LoadAssetResultCallback) {
        this.callbacks.push(callback)
        if (this.IsFinish()) {
            this.LoadSuccess()
            return
        }
        if (this.loadState == AssetLoadStatus.Loading)
            return
        this.loader.Load()
    }
}