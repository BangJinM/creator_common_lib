import * as cc from "cc";
import { BundleCache } from "../ResourceManager/BundleCache";
import { BundleManager } from "../ResourceManager/BundleManager";
import { IResource } from "../ResourceManager/IResource";
import { AssetLoadStatus, Resources } from "../ResourceManager/ResourceDefines";
import { UIEnum } from "./UIEnum";
import { UIStatus } from "./UIStatus";


export type UiRefPrefabProperty = {
    /** 对应路径+名字 */
    prefabName: string,
    /** bundle名字 */
    bundleName: string
}

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
    count: number = 0

    mainPrefabPropty: UiRefPrefabProperty
    subPrefabPropities: UiRefPrefabProperty[] = []
    loadedResourcs: { [key: string]: IResource } = {}

    protected onLoad(): void {
        this.OnUIResLoadBegin()
    }

    OnUIResLoadBegin() {
        if (!this.mainPrefabPropty) return
        let count = 0
        let bundleManager: BundleManager = BundleManager.GetInstance()
        let load = (property: UiRefPrefabProperty) => {
            count++
            let bundle: BundleCache = bundleManager.GetBundle(property.bundleName)
            Resources.LoadPrefabAsset(property.prefabName, bundle, (iResource: IResource) => {
                count--
                iResource.oriAsset?.addRef()
                this.loadedResourcs[property.prefabName] = iResource

                if (count <= 0) {
                    this.LoadFinish()
                }
            })
        }

        load(this.mainPrefabPropty)
        for (const element of this.subPrefabPropities) {
            load(element)
        }
    }

    LoadFinish() {
        this.status = UIStatus.FINISH
        for (const key in this.loadedResourcs) {
            if (this.loadedResourcs[key].loadState == AssetLoadStatus.Failed) {
                return
            }
        }

        this.childNode = Resources.Clone(this.loadedResourcs[this.mainPrefabPropty.prefabName].oriAsset as cc.Prefab)
        this.node.addChild(this.childNode)
    }

    onDestroy(): void {
        for (const key in this.loadedResourcs) {
            this.loadedResourcs[key].oriAsset?.decRef()
        }
        this.status = UIStatus.CLOSED
    }
}