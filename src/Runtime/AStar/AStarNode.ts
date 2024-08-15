

/** 寻路算法的节点 */
export class AStarNode {
    /**
     * x 轴坐标
     */
    mapX: number = 0
    /** 
     * y轴坐标
     */
    mapY: number = 0
    /**
     * 剩余路线cost
     */
    h: number = 0
    /** 
     * 常规路线cost
     */
    g: number = 0
    /**
     * 总消耗
     */
    f: number = 0
    /** 
     * 前置节点
     */
    preGridNode?: AStarNode = undefined
    /** 
     * 状态0 未使用， 1再搜索列表，2已关闭 
     */
    status = 0

    constructor(x: number, y: number) {
        this.mapX = x
        this.mapY = y
    }

    clean() {
        this.h = 0
        this.g = 0
        this.f = 0
        this.status = -1
        this.preGridNode = undefined
    }
}
