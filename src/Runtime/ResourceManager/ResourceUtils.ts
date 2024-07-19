import * as cc from "cc";
import { BundleManager } from "./BundleManager";
import { CacheManager } from "./CacheManager";
import { ResourceArgs } from "./ResourceArgs";
import { ResourceManager } from "./ResourceManager";
import { BundleCache } from "./ResourcesDefines";

/** 缓存资源 */
function LoadCacheAsset(args: ResourceArgs, needCache): [boolean, Promise<any>] {
    if (!needCache) return [false, null]

    let asset = CacheManager.GetInstance().GetAssetData(args.type, args.url);
    if (!asset) return [false, null]
    let promise = new Promise(function (success) {
        success(asset)
    })
    return [true, promise]
}


/** 判断resources包  */
function LoadBundleAsset(args: ResourceArgs, needCache): [boolean, Promise<any>] {
    if (!args.bundleCache) return [false, null]

    let assetInfo = args.bundleCache.bundle.getInfoWithPath(args.url, args.type)
    if (assetInfo) {
        return [true, new Promise((success) => {
            let resourceManager = ResourceManager.GetInstance() as ResourceManager
            let promise = resourceManager.LoadAsset(args)
            promise.then((asset) => {
                if (needCache) CacheManager.GetInstance().AddAsset(cc.js.getClassName(args.type), args.url, asset)
                success(asset)
            })
        })]
    }
    return [false, null]
}

/** 远程  */
function LoadRemoteAsset(args: ResourceArgs, needCache): [boolean, Promise<any>] {
    return [true, new Promise((success) => {
        let resourceManager = ResourceManager.GetInstance() as ResourceManager
        let promise = resourceManager.LoadAsset(args)
        promise.then((asset) => {
            if (needCache) CacheManager.GetInstance().AddAsset(cc.js.getClassName(args.type), args.url, asset)
            success(asset)
        })
    })]
}

export function LoadAsset(args: ResourceArgs) {
    // 缓存加载
    let [cache, cachePromise] = LoadCacheAsset(args, true)
    if (cache) return cachePromise

    // bundle加载
    let [bundle, bundlePromise] = LoadBundleAsset(args, true)
    if (bundle) return bundlePromise

    // 网络加载
    let [remote, remotePromise] = LoadRemoteAsset(args, true)
    if (remote) return remotePromise
}

export function LoadBundle(fName: string) {
    let bundleManager: BundleManager = BundleManager.GetInstance()
    let bundleCache = bundleManager.GetBundle(fName)
    if (bundleCache)
        return new Promise((success: Function) => {
            success(bundleCache)
        })

    return new Promise((success: Function) => {
        let task = cc.AssetManager.Task.create({
            input: {
                url: fName,
            }
            , options: { bundleManager: BundleManager.GetInstance() }
        })
    })

}

export function LoadScene(fName: String, bundleCache: BundleCache) {
    let Scene: cc.Scene = new cc.Scene("")
}

