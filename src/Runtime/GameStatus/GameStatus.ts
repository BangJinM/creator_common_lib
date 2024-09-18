import * as cc from "cc"

@cc._decorator.ccclass()
export class GameStatus {
    @cc._decorator.property(String)
    NAME: string = ""

    constructor(name: string) {
        this.NAME = name
    }

    OnEnter() { }
    OnExit() { }
}