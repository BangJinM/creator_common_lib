/** 
 * 堆排序 
 */
export class Heap<T> {
    private heap: T[] = [];
    /** A - B */
    compareTo: (valueA, valueB) => number = null

    constructor(compare: (valueA, valueB) => number) {
        this.compareTo = compare
    }

    /** 
     * 添加元素到堆中
     */
    insert(item: T) {
        this.heap.push(item);
        this.bubbleUp(this.heap.length - 1);
    }

    clear() {
        this.heap.length = 0;
    }

    pop(): T {
        if (this.heap.length === 0) return undefined;

        let min = this.heap[0]
        if (this.heap.length > 0) {
            this.heap[0] = this.heap.pop()
            this.bubbleDown(0)
        }

        return min
    }

    update(item: T, newItem?: T) {
        let index = this.heap.findIndex(v => v === item)
        if (newItem) this.heap[index] = newItem
        this.bubbleDown(index)
        this.bubbleUp(index)
    }

    /** 
     * 上浮操作：将元素从其当前位置调整至正确位置
     * @param index 元素的索引
     */
    private bubbleUp(index: number): void {
        let item = this.heap[index]

        let pIndex = -1
        while (index > 0) {
            // 2 - 1 = 1 >> 1 = 0
            // 1 - 1 = 0 >> 1 = 0
            pIndex = (index - 1) >> 1
            if (this.compareTo(this.heap[pIndex], item) <= 0) break
            this.heap[index] = this.heap[pIndex]
            index = pIndex
        }

        this.heap[index] = item
    }

    /**
     * 下沉操作：将元素从堆顶向下调整至正确位置
     */
    private bubbleDown(index: number): void {
        const item = this.heap[index];

        const halfLength = (this.heap.length - 1) >> 1;
        const lastIndex = this.heap.length - 1;

        while (index < halfLength) {
            // 0 << 1 = 0 + 1 = 1
            // 0 << 1 = 0 + 2 = 2
            let left = (index << 1) + 1;
            let right = left + 1;
            let smallIndex = left;

            if (right <= lastIndex && this.compareTo(this.heap[right], this.heap[left]) < 0) smallIndex = right
            if (this.compareTo(item, this.heap[smallIndex]) < 0) break

            this.heap[index] = this.heap[smallIndex]
            index = smallIndex
        }

        this.heap[index] = item
    }


    length(): number {
        return this.heap.length
    }
}
