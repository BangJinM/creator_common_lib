
/**
 * 四叉树的象限枚举
 */
export enum Quadrant {
    // 右上象限
    TopRight,
    // 左上象限
    TopLeft,
    // 左下象限
    BottomLeft,
    // 右下象限
    BottomRight
}

/**
 * 表示一个二维边界的类
 */
export class QuadBoundary {
    // x 坐标
    x: number;
    // y 坐标
    y: number;
    // 边界的宽度
    width: number;
    // 边界的高度
    height: number;

    /**
     * 创建一个新的 QuadBoundary 实例
     * @param x - x 坐标
     * @param y - y 坐标
     * @param width - 宽度，默认为 1
     * @param height -高度，默认为 1
     */
    constructor(x: number, y: number, width: number = 1, height: number = 1) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}

/**
 * 四叉树类，用于高效地存储和查询二维空间中的对象
 */
export class QuadTree {
    /**
     * 当前对象数量，包括子节点中的对象
     */
    objectCount: number = 0;
    /**
     * 每个节点允许的最大对象数量
     */
    maxObjectCount: number = 0;
    /**
     * 四叉树的最大深度
     */
    maxDeepth: number = 0;
    /**
     * 当前节点的深度
     */
    deepth: number = 0;
    /**
     * 子节点数组
     */
    children: QuadTree[] = [];
    /**
     * 存储在当前节点的对象集合
     */
    objects: Set<QuadBoundary> = new Set();
    /**
     * 当前节点的边界
     */
    boundary: QuadBoundary;

    /**
     * 创建一个新的 QuadTree 实例
     * @param boundary - 节点的边界
     * @param maxObjectCount - 每个节点允许的最大对象数量
     * @param maxDeepth - 四叉树的最大深度
     * @param deepth - 当前节点的深度
     */
    constructor(boundary: QuadBoundary, maxObjectCount: number, maxDeepth: number, deepth: number) {
        this.boundary = boundary;
        this.maxObjectCount = maxObjectCount;
        this.maxDeepth = maxDeepth;
        this.deepth = deepth;
    }

    /**
     * 向四叉树中添加一个对象
     * @param object - 要添加的对象
     */
    Add(object: QuadBoundary) {
        // 增加当前对象数量
        this.objectCount++;
        // 如果当前节点有子节点，将对象添加到子节点中
        if (this.children.length > 0) {
            let indexs = this.GetQuadrant(object);
            for (const element of indexs) {
                this.children[element].Add(object);
            }
            return;
        }
        // 将对象添加到当前节点的对象集合中
        this.objects.add(object);

        // 如果当前节点的对象数量超过了最大允许数量，并且当前深度小于最大深度，则分割当前节点
        if (this.objects.size > this.maxObjectCount && this.deepth < this.maxDeepth) {
            this.Split();
        }
    }

    /**
     * 从四叉树中移除一个对象
     * @param object - 要移除的对象
     */
    Remove(object: QuadBoundary) {
        // 减少当前对象数量
        this.objectCount--;
        // 如果当前节点有子节点，从子节点中移除对象
        if (this.children.length > 0) {
            let indexs = this.GetQuadrant(object);
            for (const element of indexs) {
                this.children[element].Remove(object);
            }

            // 如果当前节点的对象数量小于等于最大允许数量，将子节点中的对象合并到当前节点
            if (this.objectCount <= this.maxObjectCount) {
                for (const element of this.children) {
                    for (const obj of element.objects) {
                        this.objects.add(obj);
                    }
                }
                this.children = [];
            }
            return;
        }

        // 从当前节点的对象集合中移除对象
        this.objects.delete(object);
    }

    /**
     * 在四叉树中查找与给定边界相交的对象
     * @param object - 用于查找的边界
     * @returns 找到的对象数组
     */
    Find(object: QuadBoundary) {
        let indexes = this.GetQuadrant(object);
        let results: any[] = [];

        // 如果当前节点有子节点，递归查找子节点中的对象
        if (this.children.length > 0) {
            for (const element of indexes) {
                results = results.concat(this.children[element].Find(object));
            }
            return results;
        }
        // 返回当前节点中的所有对象
        return Array.from(this.objects.values());
    }

    /**
     * 在四叉树中查找包含给定边界的子树
     * @param object - 用于查找的边界
     * @returns 找到的子树数组
     */
    FindTree(object: QuadBoundary): QuadTree[] {
        let indexes = this.GetQuadrant(object);

        let results: QuadTree[] = [];
        // 如果当前节点没有子节点，返回当前节点
        if (this.children.length <= 0) return [this];

        // 如果当前节点有子节点，递归查找包含边界的子树
        if (this.children.length > 0) {
            for (const element of indexes) {
                results = results.concat(this.children[element].FindTree(object));
            }
        }
        return results;
    }

    /**
     * 分割当前节点，创建四个子节点，并将当前节点中的对象分配到子节点中
     */
    Split() {
        let midX = this.boundary.x + this.boundary.width / 2;
        let midY = this.boundary.y + this.boundary.height / 2;

        let midW = this.boundary.width / 2;
        let midH = this.boundary.height / 2;

        // 创建四个子节点
        this.children[Quadrant.TopRight] = new QuadTree(new QuadBoundary(midX, midY, midW, midH), this.maxObjectCount, this.maxDeepth, this.deepth + 1);
        this.children[Quadrant.TopLeft] = new QuadTree(new QuadBoundary(this.boundary.x, midY, midW, midH), this.maxObjectCount, this.maxDeepth, this.deepth + 1);
        this.children[Quadrant.BottomLeft] = new QuadTree(new QuadBoundary(this.boundary.x, this.boundary.y, midW, midH), this.maxObjectCount, this.maxDeepth, this.deepth + 1);
        this.children[Quadrant.BottomRight] = new QuadTree(new QuadBoundary(midX, this.boundary.y, midW, midH), this.maxObjectCount, this.maxDeepth, this.deepth + 1);

        // 将当前节点中的对象分配到子节点中
        for (let item of this.objects) {
            let indexs = this.GetQuadrant(item);
            for (const element of indexs) {
                this.children[element].Add(item);
            }
        }
        // 清空当前节点的对象集合
        this.objects.clear();
    }

    /**
     * 获取给定边界所在的象限
     * @param boundary - 用于查找的边界
     * @returns 边界所在的象限数组
     */
    GetQuadrant(boundary: QuadBoundary): number[] {
        let indexs: number[] = [];

        let midX = this.boundary.x + this.boundary.width / 2;
        let midY = this.boundary.y + this.boundary.height / 2;

        let endX = boundary.x + boundary.width;
        let endY = boundary.y + boundary.height;

        if (endX >= midX && endY >= midY) indexs.push(Quadrant.TopRight);
        if (boundary.x <= midX && endY >= midY) indexs.push(Quadrant.TopLeft);
        if (boundary.x <= midX && boundary.y <= midY) indexs.push(Quadrant.BottomLeft);
        if (endX >= midX && boundary.y <= midY) indexs.push(Quadrant.BottomRight);

        return indexs;
    }

    Clear() {
        this.objects.clear()
        this.children = []
    }
}