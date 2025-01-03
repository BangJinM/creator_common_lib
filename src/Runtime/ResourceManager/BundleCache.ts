import * as cc from "cc";

@cc._decorator.ccclass("BundleCache")
export class BundleCache {
    /** 路径或者名字 */
    @cc._decorator.property(cc.CCString)
    url: string = "";
    /** bundle */
    @cc._decorator.property(cc.AssetManager.Bundle)
    bundle: cc.AssetManager.Bundle | null = null;
    @cc._decorator.property(cc.CCInteger)
    refCount = 0;

    AddRef() { this.refCount++; }
    DecRef() { this.refCount--; }
}
