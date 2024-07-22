import * as cc from "cc";
import { ISingleton, set_manager_instance } from "../ISingleton";
import { IResource } from "./IResource";


export class AssetMap {
    private assets: Map<string, IResource> = new Map()

    HaveAsset(uName: string = ""): boolean {
        if (uName.length <= 0) return false
        return this.assets.has(uName)
    }

    GetAsset(uName: string): IResource {
        return this.assets.get(uName)
    }

    DelAsset(uName: string) {
        this.assets.delete(uName)
    }

    AddAsset(asset: IResource) {
        this.assets.set(asset.GetUName(), asset)
    }

    GetAssets() {
        return this.assets.values()
    }

    Clear() {
        this.assets.clear()
    }
}

/** 缓存管理类 */
@set_manager_instance()
export class CacheManager extends ISingleton {
    private usingAssets: AssetMap = new AssetMap()

    Update(deltaTime: number) {
        this.updateAssets(deltaTime)
    }
    Clean() {
        this.DelAsset(this.usingAssets)
    }

    GetAssetData(uName: string): IResource {
        if (this.usingAssets.HaveAsset(uName)) return this.usingAssets.GetAsset(uName)
        return null
    }

    AddAsset(asset: IResource) {
        this.usingAssets.AddAsset(asset)
    }

    /** 释放所有资源 */
    public DelAsset(tab: AssetMap) {
        for (const asset of tab.GetAssets()) {
            asset.Release()
        }
        tab.Clear()
    }

    /**
     * 更新所有资源的状态， 将需要删除的资源放入deleteAssets
     */
    private updateAssets(deltaTime) {
        let assets = this.usingAssets.GetAssets()
        for (const asset of assets) {
            if (asset.oriAsset.refCount <= 1) {
                this.usingAssets.DelAsset(asset.GetUName())
                asset.Release()
            }
        }
    }
}