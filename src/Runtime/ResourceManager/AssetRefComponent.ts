import * as cc from "cc";
const { ccclass, property } = cc._decorator;

@ccclass('AssetRefComponent')
export class AssetRefComponent extends cc.Component {
    @property({ type: [cc.Asset] })
    assets: cc.Asset[] = []

    /**
     * 添加资源
     */
    AddAsset(asset: cc.Asset) {
        if (!asset || !cc.isValid(this))
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
        let resultIndex = this.assets.findIndex(item => item === asset)
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