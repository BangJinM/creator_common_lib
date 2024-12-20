
export enum Quadrant {
    TopRight,
    TopLeft,
    BottomLeft,
    BottomRight
}

export class QuadBoundary {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number = 1, height: number = 1) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}

// export class QuadObject<T> extends QuadBoundary {
//     /** 唯一Id */
//     idx: number = 0
//     /** 数据 */
//     object: T;
// }

/** 四叉树 */
export class QuadTree {
    /** 最大对象数量 */
    maxObjectCount: number = 0;
    /** 最大深度 */
    maxDeepth: number = 0;
    /** 当前深度 */
    deepth: number = 0;
    /** 子节点 */
    children: QuadTree[] = [];
    /** 对象 */
    objects: Set<QuadBoundary> = new Set();
    /** 四叉树边界 */
    boundary: QuadBoundary;

    constructor(boundary: QuadBoundary, maxObjectCount: number, maxDeepth: number, deepth: number) {
        this.boundary = boundary
        this.maxObjectCount = maxObjectCount
        this.maxDeepth = maxDeepth
        this.deepth = deepth
    }

    Add(object: QuadBoundary) {
        if (this.children.length > 0) {
            let indexs = this.GetQuadrant(object)
            for (const element of indexs) {
                this.children[element].Add(object)
            }
            return
        }

        this.objects.add(object)

        // 分割
        if (this.objects.size > this.maxObjectCount && this.deepth < this.maxDeepth) {
            this.Split()
        }
    }

    Remove(object: QuadBoundary) {
        if (this.children.length > 0) {
            let indexs = this.GetQuadrant(object)
            for (const element of indexs) {
                this.children[element].Remove(object)
            }
            return
        }

        this.objects.delete(object)
    }

    Find(object: QuadBoundary) {
        let indexes = this.GetQuadrant(object);
        let results: any[] = [];

        if (this.children.length > 0) {
            for (const element of indexes) {
                results = results.concat(this.children[element].Find(object));
            }
            return results
        }
        return Array.from(this.objects.values());
    }

    FindTree(object: QuadBoundary): QuadTree[] {
        let indexes = this.GetQuadrant(object);

        let results: QuadTree[] = []
        if (this.children.length <= 0) return [this]

        if (this.children.length > 0) {
            for (const element of indexes) {
                results = results.concat(this.children[element].FindTree(object))
            }
        }
        return results
    }

    UpdateObject(object: QuadBoundary) {
        // let 
    }

    Split() {
        let midX = this.boundary.x + this.boundary.width / 2
        let midY = this.boundary.y + this.boundary.height / 2

        let midW = this.boundary.width / 2
        let midH = this.boundary.height / 2

        this.children[Quadrant.TopRight] = new QuadTree(new QuadBoundary(midX, midY, midW, midH), this.maxObjectCount, this.maxDeepth, this.deepth + 1);
        this.children[Quadrant.TopLeft] = new QuadTree(new QuadBoundary(this.boundary.x, midY, midW, midH), this.maxObjectCount, this.maxDeepth, this.deepth + 1);
        this.children[Quadrant.BottomLeft] = new QuadTree(new QuadBoundary(this.boundary.x, this.boundary.y, midW, midH), this.maxObjectCount, this.maxDeepth, this.deepth + 1);
        this.children[Quadrant.BottomRight] = new QuadTree(new QuadBoundary(midX, this.boundary.y, midW, midH), this.maxObjectCount, this.maxDeepth, this.deepth + 1);

        for (let item of this.objects) {
            this.Add(item)
        }
        this.objects.clear()
    }

    GetQuadrant(boundary: QuadBoundary): number[] {
        let indexs: number[] = []

        let midX = this.boundary.x + this.boundary.width / 2
        let midY = this.boundary.y + this.boundary.height / 2

        let endX = boundary.x + boundary.width
        let endY = boundary.y + boundary.height

        if (endX > midX && endY > midY) indexs.push(Quadrant.TopRight)
        if (boundary.x < midX && endY > midY) indexs.push(Quadrant.TopLeft)
        if (boundary.x < midX && boundary.y < midY) indexs.push(Quadrant.BottomLeft)
        if (endX > midX && endY < midY) indexs.push(Quadrant.BottomRight)

        return indexs;
    }

    Clean() {
        this.objects.clear()
        this.children = []
    }
}