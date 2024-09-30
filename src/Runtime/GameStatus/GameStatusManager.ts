import * as cc from "cc";
import { ISingleton, set_manager_instance } from "../ISingleton";
import { GameStatus } from "./GameStatus";

@set_manager_instance()
@cc._decorator.ccclass("GameStatusManager")
export class GameStatusManager extends ISingleton {
    gameStatuses: Map<string, GameStatus> = new Map()
    @cc._decorator.property(GameStatus)
    curStatus?: GameStatus = undefined
    @cc._decorator.property(GameStatus)
    lastStatus?: GameStatus = undefined

    Init() {
    }

    AddGameStatus(gameStatus: GameStatus) {
        this.gameStatuses.set(gameStatus.NAME, gameStatus)
    }

    GetGameStatus(name: string) {
        return this.gameStatuses.get(name)
    }

    GetCurStatus() {
        return this.curStatus
    }

    SetCurStatus(status: GameStatus) {
        this.curStatus = status
    }

    GetLastStatus() {
        return this.lastStatus
    }

    SetLastStatus(status: GameStatus) {
        this.lastStatus = status
    }

    ChangeStatus(name: string) {
        let gameStatus = this.gameStatuses.get(name)

        if (!gameStatus) return
        if (this.curStatus && this.curStatus.NAME == gameStatus.NAME) return

        this.lastStatus = this.curStatus
        if (this.lastStatus) this.lastStatus.OnExit()

        this.curStatus = gameStatus
        this.curStatus.OnEnter()
    }
}