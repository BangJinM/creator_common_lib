import * as cc from "cc";
import { DEBUG } from "cc/env";
import { ISingleton, set_manager_instance } from "../ISingleton";
import { BundleCache } from "./BundleCache";

/** 缓存管理类 */
@set_manager_instance()
@cc._decorator.ccclass()
export class BundleManager extends ISingleton {
    bundleMap: Map<string, BundleCache> = new Map()

    @cc._decorator.property(BundleCache)
    bundlsShowInDebug = []

    Init() {
        let loadBase = function (name) {
            let bundle = cc.assetManager.getBundle(name)
            this.AddBundle(name, bundle)
        }.bind(this)

        loadBase("resources")
    }

    GetBundle(fName: string): BundleCache {
        return this.bundleMap.get(fName)
    }

    AddBundleCache(fName: string, bundleCache: BundleCache) {
        if (this.bundleMap.has(fName)) {
            return
        }

        this.bundleMap.set(fName, bundleCache)
        this.UpdateBundleStatus()
    }

    AddBundle(fName: string, bundle: cc.AssetManager.Bundle) {
        let bundleCache = new BundleCache()
        bundleCache.url = fName
        bundleCache.bundle = bundle

        this.AddBundleCache(fName, bundleCache)
    }

    RemoveBundle(fName: string) {
        if (!this.bundleMap.has(fName)) {
            return
        }

        let bundleCache = this.bundleMap.get(fName)
        bundleCache.bundle.releaseAll()
        this.bundleMap.delete(fName)
        cc.assetManager.removeBundle(bundleCache.bundle)

        this.UpdateBundleStatus()
    }

    GetBundles() {
        return this.bundleMap.values()
    }

    UpdateBundleStatus() {
        if (!DEBUG) return
        for (const iterator of this.bundleMap.values()) { this.bundlsShowInDebug.push(iterator) }
    }
}