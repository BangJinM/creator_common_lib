/** 使用bundle.load直接加载spriteFrame */
export let USE_SPRITE_BUNDLE_LOAD = true
/** 延迟卸载资源 */
export let DELAY_RELEASE_ASSET = true
export let ASSET_CACHE_FLAG = "user_data_asset_cache_flag__"
export let OBSERVER_XX_PROPERTY_FLAG = "user_data_observer_xx_property_flag__"
export let REMOTE_RESOURCE_URL = "http://localhost:8080/"

/** 
 * 资源加载状态
 */
export enum AssetLoadStatus {
    /** 未加载 */
    Unload,
    /** 正在加载 */
    Loading,
    /** 加载失败 */
    Failed,
    /** 加载成功 */
    Success,
}

/**
 * 资源加载参数
 */
export interface ResourceOptions {
    /** 版本 */
    version?: string;
    /** 是否进行存储 */
    needCache?: boolean;
}