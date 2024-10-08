import * as cc from "cc";
import { BundleCache } from "./BundleCache";
import { IResourceLoader } from "./Loader/IResourceLoader";
import { LoaderFactory } from "./Loader/LoaderFactory";
import { AssetType, ResourceArgs } from "./ResourceArgs";
import { ASSET_CACHE_FLAG, AssetLoadStatus, ResourceOptions } from "./ResourceDefines";

export type LoadAssetResultCallback = (iResource: IResource) => void;

@cc._decorator.ccclass("IResource")
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
        this.loader = LoaderFactory.GetResoureLoader(this)
    }

    /** 设置资源 */
    SetAsset(asset: cc.Asset) {
        this.oriAsset = asset;
        asset?.addRef();
        this.bundleCache?.AddRef()
        if (this.oriAsset) Object.defineProperty(this.oriAsset, ASSET_CACHE_FLAG, { value: true, writable: false })
    }
    /** 添加依赖 */
    AddDepends(depends: IResource[]) {
        for (const dependAsset of depends) {
            dependAsset.oriAsset?.addRef();
            this.dependAssets.push(dependAsset);
        }
    }
    /** 释放资源 */
    Release() {
        this.oriAsset?.decRef();
        for (const dependAsset of this.dependAssets) {
            dependAsset.oriAsset?.decRef();
        }
        this.bundleCache?.DecRef()

        if (this.bundleCache) return;
        if (this.oriAsset) cc.assetManager.releaseAsset(this.oriAsset);
    }
    /** 检测是否还在使用 */
    UnuseAsset() {
        if (!this.IsFinish()) return false
        if (!this.oriAsset) return true
        return this.oriAsset.refCount <= 1
    }
    /** 设置加载状态 */
    SetAssetLoadState(state: AssetLoadStatus) {
        this.loadState = state
    }
    /** 加载成功，执行回调 */
    LoadSuccess() {
        if (this.loadState == AssetLoadStatus.Close) {
            this.callbacks.length = 0;
            return
        }
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
        if (this.loadState == AssetLoadStatus.Loading) return

        this.loadState = AssetLoadStatus.Loading
        this.loader.Load()
    }
}