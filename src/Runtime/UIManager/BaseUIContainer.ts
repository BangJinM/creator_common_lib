import * as cc from "cc";
import { BundleCache } from "../ResourceManager/BundleCache";
import { BundleManager } from "../ResourceManager/BundleManager";
import { LoadPrefab } from "../ResourceManager/ResourceLoadUtils";
import { Clone } from "../ResourceManager/ResourceUtils";
import { UIEnum } from "./UIEnum";
import { UIStatus } from "./UIStatus";

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

        let promise = LoadPrefab(this.layerName, bundle)
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