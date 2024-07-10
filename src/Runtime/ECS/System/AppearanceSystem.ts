import * as cc from "cc"
import { ECSSystem } from "../Object/ECSSystem";

export class AppearanceSystem extends ECSSystem {
    /** 根节点 */
    rootNode: cc.Node | undefined = undefined

    OnUpdate(entity: number): void {
        throw new Error("Method not implemented.");
    }

}