import * as cc from "cc";
import { BundleCache } from "./ResourcesDefines";
import { ResourceOptions } from "./ResourceOptions";

export class ResourceArgs {
    url: string = "";
    bundleCache: BundleCache = null;
    type: new () => cc.Asset;
    options: ResourceOptions = null;

    Copy(resArgs) {
        this.type = resArgs.type;
        this.bundleCache = resArgs.bundleCache;
        this.options = resArgs.options;
        this.url = resArgs.url;
    }
}
