import * as cc from "cc";
import { BundleManager } from "./BundleManager";
import { CacheManager } from "./CacheManager";
import { ResourceArgs } from "./ResourceArgs";
import { ResourceManager } from "./ResourceManager";
import { BundleCache } from "./BundleCache";


/** 缓存资源 */
function LoadCacheAsset(args: ResourceArgs): [boolean, Promise<any>] {
    let asset = CacheManager.GetInstance().GetAssetData(args.GetUName());
    if (!asset) return [false, null]
    let promise = new Promise(function (success) {
        success(asset)
    })
    return [true, promise]
}

/** 判断resources包  */
function LoadBundleAsset(args: ResourceArgs): [boolean, Promise<any>] {
    if (!args.bundleCache) {
        let bundles = BundleManager.GetInstance().GetBundles()
        for (const bundleCache of bundles) {
            if (bundleCache && bundleCache.bundle.getInfoWithPath(args.url, args.type)) {
                args.bundleCache = bundleCache
            }
        }
    } else {
        if (!args.bundleCache.bundle.getInfoWithPath(args.url, args.type)) {
            args.bundleCache = null
        }
    }

    if (args.bundleCache && args.bundleCache.bundle.getInfoWithPath(args.url, args.type)) {
        return [true, new Promise((success) => {
            let resourceManager = ResourceManager.GetInstance() as ResourceManager
            resourceManager.LoadAsset(args).then((asset) => {
                success(asset)
            })
        })]
    }
    return [false, null]
}

/** 远程  */
function LoadRemoteAsset(args: ResourceArgs): [boolean, Promise<any>] {
    return [true, new Promise((success) => {
        let resourceManager = ResourceManager.GetInstance() as ResourceManager
        resourceManager.LoadAsset(args).then((asset) => {
            success(asset)
        })
    })]
}

export function LoadAsset(args: ResourceArgs) {
    // 缓存加载
    let [cache, cachePromise] = LoadCacheAsset(args)
    if (cache) return cachePromise

    // bundle加载
    let [bundle, bundlePromise] = LoadBundleAsset(args)
    if (bundle) return bundlePromise

    // 网络加载
    let [remote, remotePromise] = LoadRemoteAsset(args)
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

export function LoadScene(fName: string, bundleCache: BundleCache) {
    return LoadAsset(new ResourceArgs(fName, cc.SceneAsset, bundleCache))
}

export function LoadPrefab(url: string, bundleCache: BundleCache) {
    return LoadAsset(new ResourceArgs(url, cc.Prefab, bundleCache))
}

export function LoadTexture(url: string, bundleCache: BundleCache) {
    return LoadAsset(new ResourceArgs(url, cc.Texture2D, bundleCache))
}

export function LoadSpriteFrame(url: string, bundleCache: BundleCache) {
    return LoadAsset(new ResourceArgs(url, cc.SpriteFrame, bundleCache))
}

export function LoadSpriteAtlas(url: string, bundleCache: BundleCache) {
    return LoadAsset(new ResourceArgs(url, cc.SpriteAtlas, bundleCache))
}

export function LoadAudioClip(url: string, bundleCache: BundleCache) {
    return LoadAsset(new ResourceArgs(url, cc.AudioClip, bundleCache))
}