import { ISingleton, set_manager_instance } from "../ISingleton";
import { BundleCache } from "./BundleCache";
import { IResource } from "./IResource";
import { AssetType } from "./ResourceArgs";
import { ResourceOptions } from "./ResourceDefines";


/** 缓存管理类 */
@set_manager_instance()
export class CacheManager extends ISingleton {
    private usingAssets: Map<string, IResource> = new Map()

    Update(deltaTime: number) {
        this.updateAssets(deltaTime)
    }
    Clean() {
        this.usingAssets.forEach(element => {
            element.Release()
        });
        this.usingAssets.clear()
    }

    GetAssetData(uName: string): IResource {
        if (this.usingAssets.has(uName)) return this.usingAssets.get(uName)
        return null
    }

    CreateAsset(fName: string, resourceType: AssetType, bundleCache: BundleCache, options: ResourceOptions): IResource {
        let iResource: IResource = new IResource(fName, resourceType, bundleCache, options)
        this.usingAssets.set(iResource.GetUName(), iResource)
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

        for (const element of deleteAssets) {
            this.usingAssets.delete(element.GetUName())
        }
    }
}