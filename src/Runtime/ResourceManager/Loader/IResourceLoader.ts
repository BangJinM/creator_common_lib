import { IResource } from "../IResource";

/**
 * 资源加载器
 */
export class IResourceLoader {
    iResource: IResource = null;
    constructor(iResource: IResource) {
        this.iResource = iResource;
    }
    /** 执行加载 */
    Load(): void { }
}
