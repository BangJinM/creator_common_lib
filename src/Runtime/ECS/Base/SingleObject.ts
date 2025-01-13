/**
 * 每个对象赋予一个唯一的key
 */
export class SingleObject<T> {
    /** 有效的ID */
    private objects: Map<number, T> = new Map();
    /** 失效的ID列表 */
    private deleteObjects: number[] = [];

    RemoveObject(key: number) {
        if (!this.objects.has(key))
            return;

        this.objects.delete(key);
        this.deleteObjects.push(key);
    }

    SetObject(key: number, object: T) {
        if (this.objects.has(key)) return;
        this.objects.set(key, object);
    }

    GetObjectIndex() {
        let index = -1;
        if (this.deleteObjects.length > 0) {
            index = this.deleteObjects.pop();
        } else {
            index = this.objects.size;
        }
        return index;
    }

    GetObjects(): Map<number, T> {
        return this.objects
    }

    GetObject(key: number): T {
        return this.objects.get(key);
    }

    HasObject(key: number): boolean {
        return this.objects.has(key);
    }
}
