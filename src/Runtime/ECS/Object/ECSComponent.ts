import { IComponent } from "../Base/IComponent";

export class ECSComponent implements IComponent {

    dirty: boolean = true

    Dirty(dirty: boolean): void {
        this.dirty = dirty
    }

    GetDirty(): boolean {
        return this.dirty
    }

}