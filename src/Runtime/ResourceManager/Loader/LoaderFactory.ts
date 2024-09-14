import * as cc from "cc"
import { IResource } from "../IResource"
import { IResourceLoader } from "./IResourceLoader"
import { RemoteLoader } from "./RemoteLoader"
import { SceneLoader } from "./SceneLoader"
import { SpriteAtlasLoader } from "./SpriteAtlasLoader"
import { SpriteFrameLoader } from "./SpriteFrameLoader"
import { TextureLoader } from "./TextureLoader"
import { AssetType } from "../ResourceDefines"

export class LoaderFactory {
    static GetResoureLoader(assetType: AssetType, resource: IResource): IResourceLoader {
        let loader = undefined
        if (assetType == cc.SpriteFrame) { loader = new SpriteFrameLoader(resource) }
        else if (assetType == cc.Texture2D) { loader = new TextureLoader(resource) }
        else if (assetType == cc.SpriteAtlas) { loader = new SpriteAtlasLoader(resource) }
        else if (assetType == cc.SceneAsset) { loader = new SceneLoader(resource) }
        else { loader = new RemoteLoader(resource) }
        return loader
    }
}