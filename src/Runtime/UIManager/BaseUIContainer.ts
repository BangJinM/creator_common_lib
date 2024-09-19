import * as cc from "cc";
import { Logger } from "../Logger";
import { BundleCache } from "../ResourceManager/BundleCache";
import { BundleManager } from "../ResourceManager/BundleManager";
import { IResource } from "../ResourceManager/IResource";
import { AssetLoadStatus } from "../ResourceManager/ResourceDefines";
import { Resources } from "../ResourceManager/Resources";
import { BaseUIComp } from "./BaseUIComp";
import { UIEnum } from "./UIEnum";
import { UIStatus } from "./UIStatus";


export class UiRefPrefabProperty {
    /** 对应路径+名字 */
    prefabName: string
    /** bundle名字 */
    bundleName: string
}

export class BaseUIContainer extends cc.Component {
    /** 界面类型 */
    public uiType: UIEnum;
    /** 节点名字 */
    public layerName: string;
    /** 子节点 */
    childNode: cc.Node = null
    /** 资源加载进度 */
    status: number = UIStatus.UNUSED

    ScriptAsset: new () => BaseUIComp = null
    mainPrefabPropty: UiRefPrefabProperty
    subPrefabPropities: UiRefPrefabProperty[] = []
    loadedResourcs: { [key: string]: IResource } = {}

    protected onLoad(): void {
        this.OnUIResLoadBegin()
    }

    OnUIResLoadBegin() {
        if (!this.mainPrefabPropty) return
        Logger.debug(`开始加载资源：${this.layerName}`)
        let count = 0
        let bundleManager: BundleManager = BundleManager.GetInstance()
        let load = (property: UiRefPrefabProperty) => {
            count++
            let bundle: BundleCache = bundleManager.GetBundle(property.bundleName)
            Resources.Loader.LoadPrefabAsset(property.prefabName, bundle, (iResource: IResource) => {
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
                Logger.warn(`销毁界面：${this.layerName}`)
                return
            }
        }
        Logger.debug(`加载资源成功，正在初始化界面：${this.layerName}`)
        this.childNode = Resources.UIUtils.Clone(this.loadedResourcs[this.mainPrefabPropty.prefabName].oriAsset as cc.Prefab)
        this.node.addChild(this.childNode)
        if (this.ScriptAsset) {
            let comp = this.childNode.addComponent(this.ScriptAsset)
            comp.InitData(this.loadedResourcs)
        }
    }

    onDestroy(): void {
        for (const key in this.loadedResourcs) {
            this.loadedResourcs[key].oriAsset?.decRef()
        }
        this.status = UIStatus.CLOSED
        Logger.debug(`销毁界面：${this.layerName}`)
    }
}