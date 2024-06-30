export class ObjectKey {
    /** 有效的ID */
    private objects: Set<number> = new Set();
    /** 失效的ID列表 */
    private deleteObjects: number[] = [];

    RemoveObject(key: number) {
        if (!this.objects.has(key))
            return;

        this.objects.delete(key);
        this.deleteObjects.push(key);
    }

    CreateObject() {
        let index = -1;
        if (this.deleteObjects.length > 0) {
            index = this.deleteObjects.pop();
        } else {
            index = this.objects.size;
        }

        this.objects.add(index);
        return index;
    }
}
