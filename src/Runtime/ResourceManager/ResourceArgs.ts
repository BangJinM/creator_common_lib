import * as cc from "cc";
import { BundleCache } from "./BundleCache";
import { AssetType, ResourceOptions } from "./ResourceDefines";



export class ResourceArgs {
    /** 唯一名字 类型 + 路径 */
    private uName: string = "";
    /** 资源的路径 不唯一 */
    url: string = "";
    /** 资源所在的包 */
    bundleCache: BundleCache = null;
    /** 资源类型 */
    assetType: AssetType;
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

    Copy(resArgs: ResourceArgs) {
        this.assetType = resArgs.assetType;
        this.bundleCache = resArgs.bundleCache;
        this.options = resArgs.options;
        this.url = resArgs.url;
        this.uName = resArgs.uName;
    }

    GetUName(): string {
        return this.uName
    }
}
