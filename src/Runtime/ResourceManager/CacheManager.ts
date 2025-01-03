import * as cc from "cc";
import { DEBUG } from "cc/env";
import { ISingleton } from "../ISingleton";
import { Logger } from "../Logger";
import { BundleCache } from "./BundleCache";
import { IResource } from "./IResource";
import { AssetType, ResourceArgs } from "./ResourceArgs";
import { ResourceOptions } from "./ResourceDefines";


/** 缓存管理类 */

@cc._decorator.ccclass("CacheManager")
export class CacheManager extends ISingleton {
    private usingAssets: Map<string, IResource> = new Map()

    @cc._decorator.property([ResourceArgs])
    public resourceArgs: ResourceArgs[] = []
    dirty: boolean = false

    Update(deltaTime: number) {
        this.updateAssets(deltaTime)
    }
    Clean() {
        this.usingAssets.forEach(element => {
            element.Release()
        });
        this.usingAssets.clear()
        Logger.info(`清理所有资源`)
    }

    GetAssetData(uName: string): IResource {
        if (this.usingAssets.has(uName)) return this.usingAssets.get(uName)
        return null
    }

    CreateAsset(fName: string, resourceType: AssetType, bundleCache: BundleCache, options: ResourceOptions): IResource {
        this.dirty = true

        let iResource: IResource = new IResource(fName, resourceType, bundleCache, options)
        this.usingAssets.set(iResource.GetUName(), iResource)
        Logger.info(`创建资源：${iResource.GetUName()}`)
        return iResource
    }

    /**
     * 更新所有资源的状态， 将需要删除的资源放入deleteAssets
     */
    private updateAssets(dt: number) {
        let deleteAssets: IResource[] = []
        this.usingAssets.forEach((asset) => {
            if (asset.UnuseAsset()) {
                asset.Release()
                deleteAssets.push(asset)
            }
        })

        if (deleteAssets.length > 0) this.dirty = true

        for (const element of deleteAssets) {
            this.usingAssets.delete(element.GetUName())
        }

        if (this.dirty && DEBUG) {
            this.resourceArgs = []
            this.usingAssets.forEach((asset) => {
                this.resourceArgs.push(asset)
            })
            this.dirty = false
        }
    }
}