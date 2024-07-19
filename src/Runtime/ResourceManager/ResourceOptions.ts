/**
 * 资源加载参数
 */
export interface ResourceOptions {
    /** 非cacheManager管理的额外参数 */
    version?: string;
    /** 资源后缀名 */
    resSuffix?: string;
    /** cacheManager管理时需要拼接url */
    baseUrl?: string;
}
