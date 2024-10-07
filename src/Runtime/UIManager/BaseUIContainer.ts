import * as cc from "cc";
import { Logger } from "../Logger";
import { BundleCache } from "../ResourceManager/BundleCache";
import { BundleManager } from "../ResourceManager/BundleManager";
import { IResource } from "../ResourceManager/IResource";
import { AssetLoadStatus } from "../ResourceManager/ResourceDefines";
import { Resources } from "../ResourceManager/Resources";
import { BaseUIComp } from "./BaseUIComp";
import { UIEnum } from "./UIEnum";

/** 加载状态 */
export enum UIStatus {
    /** 未使用 */
    UNUSED,
    /** 正在加载 */
    LOADING,
    /** 加载完成 */
    FINISH,
    /** 已关闭 */
    CLOSED
}
/** 加载的资源信息 */
@cc._decorator.ccclass("UiRefPrefabProperty")
export class UiRefPrefabProperty {
    /** 对应路径+名字 */
    @cc._decorator.property(cc.CCString)
    prefabName: string
    /** bundle名字 */
    @cc._decorator.property(cc.CCString)
    bundleName: string
}

/** 
 * UI基础容器 
 * @description 用于管理界面的节点，以及界面的加载和销毁
 */
@cc._decorator.ccclass("BaseUIContainer")
export class BaseUIContainer extends cc.Component {
    /** 界面类型 */
    @cc._decorator.property({ type: cc.Enum(UIEnum) })
    uiType: UIEnum;
    /** 节点名字 */
    @cc._decorator.property(cc.CCString)
    layerName: string;
    /** 界面绑定的 脚本 */
    ScriptAsset: new () => BaseUIComp = null
    /** 打开的界面资源 */
    @cc._decorator.property(UiRefPrefabProperty)
    mainPrefabPropty: UiRefPrefabProperty
    /** 子节点资源 */
    @cc._decorator.property([UiRefPrefabProperty])
    subPrefabPropities: UiRefPrefabProperty[] = []

    /** 子节点 */
    childNode: cc.Node = null
    /** 资源加载进度 */
    status: number = UIStatus.UNUSED
    /** 已经加载的资源 */
    loadedResourcs: { [key: string]: IResource } = {}

    protected onLoad(): void {
        this.OnUIResLoadBegin()
    }

    OnUIResLoadBegin() {
        if (!this.mainPrefabPropty) return
        Logger.info(`开始加载界面资源：${this.layerName}`)
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
        Logger.info(`加载资源成功，正在初始化界面：${this.layerName}`)
        this.childNode = Resources.UIUtils.Clone(this.loadedResourcs[this.mainPrefabPropty.prefabName].oriAsset as cc.Prefab)
        this.childNode.layer = this.node.layer
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
        Logger.info(`销毁界面：${this.layerName}`)
    }
}