import * as cc from "cc";
import { BundleCache } from "./BundleCache";
import { ResourceOptions } from "./ResourceDefines";

export type AssetType = cc.Constructor<cc.Asset>

/**
 * 资源加载参数
 */
@cc._decorator.ccclass("ResourceArgs")
export class ResourceArgs {
    /** 唯一名字 类型 + 路径 */
    @cc._decorator.property(cc.CCString)
    private uName: string = "";
    /** 资源的路径 不唯一 */
    @cc._decorator.property(cc.CCString)
    url: string = "";
    /** 资源所在的包 */
    @cc._decorator.property({ type: BundleCache })
    bundleCache: BundleCache = null;
    /** 资源类型 */
    assetType: AssetType = null;
    /** 资源加载选项 */
    options: ResourceOptions = null;

    static GetUName(fName: string, type: AssetType): string {
        return `${cc.js.getClassName(type)}+${fName}`
    }

    constructor(url: string = "", type: AssetType = cc.Asset, bundleCache: BundleCache = null, options: ResourceOptions = { needCache: true, version: `${new Date().getDate()}` }) {
        this.url = url
        this.assetType = type
        this.bundleCache = bundleCache
        this.options = options
        this.uName = ResourceArgs.GetUName(url, type)
    }

    GetUName(): string {
        return this.uName
    }
}
