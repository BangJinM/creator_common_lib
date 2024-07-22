import * as cc from "cc";
import { ResourceManager } from "../ResourceManager";
import { IResource } from "../IResource";

/**
 * 资源加载器
 */
export class IResourceLoader extends IResource {
    resourceFactory: ResourceManager = null;
    constructor(resourceFactory: ResourceManager) {
        super();
        this.resourceFactory = resourceFactory;
    }
    Load(): Promise<cc.Asset> { return null; }
}
