import { ISingleton, set_manager_instance } from "./ISingleton"

export type INoticeData = { [key: string]: any }
export type INoticeFunction = (data: INoticeData) => void

@set_manager_instance()
export class SubjectManager extends ISingleton {
    observers: { [key: number]: INoticeFunction[] } = {}

    AddObserver(key: number, func: INoticeFunction) {
        if (!this.observers[key])
            this.observers[key] = []

        this.observers[key].push(func)
    }

    RemoveAllFuncByKey(key: number) {
        if (!this.observers[key])
            return
        this.observers[key].length = 0
    }

    RemoveAllFunc() {
        this.observers = {}
    }

    RemoveObserver(key: number, func: INoticeFunction) {
        if (!this.observers[key])
            return

        let index = this.observers[key].findIndex(func)
        if (index >= 0) {
            this.observers[key].splice(index, 1)
        }
    }

    NotifyObserver(key: number, data: INoticeData) {
        if (!this.observers[key])
            return

        for (const element of this.observers[key]) {
            element(data)
        }
    }

    public Clean(): void {
        this.RemoveAllFunc()
    }
}