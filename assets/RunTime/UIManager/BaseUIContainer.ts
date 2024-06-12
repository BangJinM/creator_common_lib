import * as cc from "cc";
import { UIEnum } from "./UIEnum";
import { LoadAssetByName } from "../ResourceManager/ResourceUtils";
import { BundleManager } from "../ResourceManager/BundleManager";
import { Clone } from "../Utils/CocosUtils";
import { UIStatus } from "./UIStatus";
import { BundleCache } from "../ResourceManager/ResourcesDefines";

@cc._decorator.ccclass()
export class BaseUIContainer extends cc.Component {
    /** 界面类型 */
    @cc._decorator.property({ type: cc.Enum(UIEnum), tooltip: "界面类型" })
    public uiType: UIEnum;
    /** 节点名字 */
    public layerName: string;
    /** 子节点 */
    childNode: cc.Node = null

    /** 资源加载进度 */
    status: number = UIStatus.UNUSED
    /** 路径 */
    prefabURL: string = ""
    /** bundleName */
    bundleName: string = ""

    protected onLoad(): void {
        let bundle: BundleCache = BundleManager.GetInstance().GetBundle(this.bundleName)

        let promise = LoadAssetByName(this.layerName, cc.Prefab, bundle)
        promise.then(function (asset: cc.Prefab) {
            if (!asset) return
            this.status = UIStatus.FINISH
            let updateL = Clone(asset)
            this.node.addChild(updateL)
        }.bind(this))
    }

    protected onDestroy(): void {
        this.status = UIStatus.CLOSED
    }
}