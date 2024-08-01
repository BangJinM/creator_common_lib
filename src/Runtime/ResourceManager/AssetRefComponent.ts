import * as cc from "cc";
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
        if (!asset)
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
        if (!asset)
            return

        let resultIndex = this.assets.findIndex(value => value === asset)
        if (resultIndex >= 0) {
            this.assets.splice(resultIndex, 1)
            asset.decRef()
        }
    }
    
    DelAllAssets() {
        let array = []
        for (const asset of this.assets) {
            array.push(asset)
        }
        this.assets.length = 0

        for (const asset of array) {
            this.DelAsset(asset)
        }
    }
}
