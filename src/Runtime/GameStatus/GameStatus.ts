import * as cc from "cc"

@cc._decorator.ccclass("GameStatus")
export class GameStatus {
    @cc._decorator.property(cc.CCString)
    NAME: string = ""

    constructor(name: string) {
        this.NAME = name
    }

    OnEnter() { }
    OnExit() { }
}