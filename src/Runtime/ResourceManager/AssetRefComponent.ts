import * as cc from "cc";
import { ASSET_CACHE_FLAG } from "./ResourcesDefines";
const { ccclass, property } = cc._decorator;

/**
 * 管理资源引用
 */
@ccclass('AssetRefComponent')
export class AssetRefComponent extends cc.Component {
    @property({ type: [cc.Asset] })
    public assets: cc.Asset[] = []
    /**
     * 添加资源
     */
    AddAsset(asset: cc.Asset) {
        if (!asset || !asset[ASSET_CACHE_FLAG])
            return

        if (!cc.isValid(this))
            return

        this.assets.push(asset)
        asset.addRef()
    }
    /**
     * 删除资源
     */
    DelAsset(asset: cc.Asset) {
        if (!asset || !asset[ASSET_CACHE_FLAG])
            return

        let resultIndex = -1
        for (let index = 0; index < this.assets.length; index++) {
            if (asset[ASSET_CACHE_FLAG].url == this.assets[index][ASSET_CACHE_FLAG].url) {
                resultIndex = index
            }
        }

        if (resultIndex >= 0) {
            this.assets.splice(resultIndex, 1)
            asset.decRef()
        }
    }
    onDestroy() {
        for (const asset of this.assets) {
            this.DelAsset(asset)
        }
        this.assets.length = 0
    }
}
