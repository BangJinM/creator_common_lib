import * as cc from "cc"
import { IResource } from "../IResource"
import { BundleLoader } from "./BundleLoader"
import { IResourceLoader } from "./IResourceLoader"
import { RemoteLoader } from "./RemoteLoader"
import { SceneLoader } from "./SceneLoader"
import { SpriteAtlasLoader } from "./SpriteAtlasLoader"
import { SpriteFrameLoader } from "./SpriteFrameLoader"
import { TextureLoader } from "./TextureLoader"

export class LoaderFactory {
    static GetResoureLoader(resource: IResource): IResourceLoader {
        let loader = undefined
        if (resource.bundleCache) {
            if (resource.assetType == cc.SceneAsset) { loader = new SceneLoader(resource) }
            else { loader = new BundleLoader(resource) }
        }
        else {
            if (resource.assetType == cc.SpriteFrame) { loader = new SpriteFrameLoader(resource) }
            else if (resource.assetType == cc.Texture2D) { loader = new TextureLoader(resource) }
            else if (resource.assetType == cc.SpriteAtlas) { loader = new SpriteAtlasLoader(resource) }
            else { loader = new RemoteLoader(resource) }
        }
        return loader
    }
}