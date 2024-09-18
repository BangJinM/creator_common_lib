
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
    /** 加速遍历 */
    findIndex = -1

    isObstacle = false;

    constructor(x: number, y: number) {
        this.mapX = x
        this.mapY = y
    }

    clean() {
        this.status = 0
        this.preGridNode = undefined
    }
}

export class AStarNodeSorter {
    public aStarNodes: AStarNode[] = [];
    /** 
     * 添加元素到堆中
     */
    insert(item: AStarNode) {
        this.aStarNodes.push(item)
        item.findIndex = this.aStarNodes.length - 1
        this.bubbleUp(this.aStarNodes.length - 1)
    }

    clear() {
        this.aStarNodes = []
    }

    pop(): AStarNode {
        if (this.aStarNodes.length <= 1)
            return this.aStarNodes.pop()

        let item = this.aStarNodes[0]
        this.aStarNodes[0] = this.aStarNodes.pop()
        this.aStarNodes[0].findIndex = 0
        this.bubbleDown(0)
        return item


    }

    update(item: AStarNode) {
        this.bubbleDown(item.findIndex)
        this.bubbleUp(item.findIndex)
    }

    /** 
     * 上浮操作：将元素从其当前位置调整至正确位置
     * @param index 元素的索引
     */
    private bubbleUp(index: number): void {
        let item = this.aStarNodes[index]

        let pIndex = -1
        while (index > 0) {
            pIndex = (index - 1) >> 1
            if (this.aStarNodes[pIndex].f <= item.f) break

            this.aStarNodes[index] = this.aStarNodes[pIndex]
            this.aStarNodes[index].findIndex = index
            index = pIndex
        }

        this.aStarNodes[index] = item
        item.findIndex = index
    }

    /**
     * 下沉操作：将元素从堆顶向下调整至正确位置
     */
    private bubbleDown(index: number): void {
        const item = this.aStarNodes[index];

        const halfLength = (this.aStarNodes.length - 1) >> 1;

        let left: number, right: number, smallIndex: number

        while (index < halfLength) {
            left = (index << 1) + 1;
            right = left + 1;

            smallIndex = left

            if (right < this.aStarNodes.length - 1 && this.aStarNodes[left].f > this.aStarNodes[right].f) smallIndex = right
            if (item.f < this.aStarNodes[smallIndex].f) break

            this.aStarNodes[index] = this.aStarNodes[smallIndex]
            this.aStarNodes[index].findIndex = index
            index = smallIndex
        }
        this.aStarNodes[index] = item
        this.aStarNodes[index].findIndex = index
    }


    length(): number {
        return this.aStarNodes.length
    }
}