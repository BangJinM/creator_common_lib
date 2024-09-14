import * as cc from "cc";
import { DEBUG } from "cc/env";
import { ISingleton, set_manager_instance } from "../ISingleton";
import { BundleCache } from "./BundleCache";

/** 缓存管理类 */
@set_manager_instance()
@cc._decorator.ccclass()
export class BundleManager extends ISingleton {
    bundleMap: Map<string, BundleCache> = new Map()
    bundleFunc: Map<string, Function[]> = new Map()

    @cc._decorator.property(BundleCache)
    bundlsShowInDebug: BundleCache[] = []

    Init() {
        let loadBase = (name: string) => {
            let bundle = cc.assetManager.getBundle(name)
            this.AddBundle(name, bundle)
        }

        loadBase("resources")
    }
    LoadBundle(fName: string, callback?: Function) {
        let flag = this.bundleFunc.has(fName)
        if (flag) {
            this.bundleFunc.get(fName).push(callback)
            return
        }
        else {
            this.bundleFunc.set(fName, [callback])
        }
        cc.assetManager.loadBundle(fName, (err: Error, bundle: cc.AssetManager.Bundle) => {
            this.bundleFunc.get(fName).forEach(callback => callback(bundle))
        })
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