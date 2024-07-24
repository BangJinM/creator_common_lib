import * as cc from "cc";

export type AssetType = cc.Constructor<cc.Asset>
/** 使用bundle.load直接加载spriteFrame */
export let USE_SPRITE_BUNDLE_LOAD = true
/** 延迟卸载资源 */
export let DELAY_RELEASE_ASSET = true
export let ASSET_CACHE_FLAG = "user_data_asset_cache_flag__"
export let OBSERVER_XX_PROPERTY_FLAG = "user_data_observer_xx_property_flag__"

export let REMOTE_RESOURCE_URL = "http://localhost:8080/"