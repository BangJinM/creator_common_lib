import { IComponent } from "../Base/IComponent";

export class ECSComponent implements IComponent {
    /** 唯一ID */
    id: number = 0;
    /** 脏标记 */
    dirty: boolean = false

    constructor(id: number) {
        this.id = id
    }

    SetDirty(dirty: boolean): void {
        this.dirty = dirty
    }

    GetDirty(): boolean {
        return this.dirty
    }

}