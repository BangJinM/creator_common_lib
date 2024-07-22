import * as cc from "cc";
import { BundleCache } from "./BundleCache";
import { ResourceOptions } from "./ResourceOptions";

export class ResourceArgs {
    /** 唯一名字 类型 + 路径 */
    private uName: string = "";
    /** 资源的路径 不唯一 */
    url: string = "";
    /** 资源所在的包 */
    bundleCache: BundleCache = null;
    /** 资源类型 */
    type: new () => cc.Asset;
    /** 资源加载选项 */
    options: ResourceOptions = null;

    constructor(url: string = "", type = cc.Asset, bundleCache: BundleCache = null, options: ResourceOptions = { needCache: true, version: `${new Date().getDate()}` }) {
        this.url = url
        this.type = type
        this.bundleCache = bundleCache
        this.options = options
    }

    Copy(resArgs) {
        this.type = resArgs.type;
        this.bundleCache = resArgs.bundleCache;
        this.options = resArgs.options;
        this.url = resArgs.url;
    }

    GetUName() {
        if (this.uName.length <= 0) this.uName = `${cc.js.getClassName(this.type)}+${this.url}`;
        return this.uName;
    }
}
