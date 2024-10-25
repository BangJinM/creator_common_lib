import * as cc from "cc";
import { ISingleton, set_manager_instance } from "../ISingleton";
import { Logger } from "../Logger";
import { BaseUIContainer } from "./BaseUIContainer";
import { UIEnum } from "./UIEnum";

/** UI 根节点 管理 */
@cc._decorator.ccclass()
@set_manager_instance()
export class UIGraphManager extends ISingleton {
    /** ui相机 */
    uiCameraNode: cc.Node = null
    /** UICanvas */
    uiCanvasNode: cc.Node = null
    /** 节点属性列表 */
    uiNodes: Map<number, BaseUIContainer[]> = new Map()

    Init() {
        this.InitUIRootNode()
    }

    InitUIRootNode() {
        if (!this.uiCameraNode) {
            this.uiCameraNode = new cc.Node("ui_camera_node")
            this.node.addChild(this.uiCameraNode);

            let uiCamera = this.uiCameraNode.addComponent(cc.Camera)
            uiCamera.visibility = cc.Layers.Enum.UI_2D | cc.Layers.Enum.UI_3D
            uiCamera.clearFlags = cc.Camera.ClearFlag.DEPTH_ONLY
            uiCamera.projection = cc.Camera.ProjectionType.ORTHO
            uiCamera.priority = 0xffffff
        }

        if (!this.uiCanvasNode) {
            this.uiCanvasNode = new cc.Node("ui_canvas_node")
            this.node.addChild(this.uiCanvasNode);

            let canvas: cc.Canvas = this.uiCanvasNode.addComponent(cc.Canvas)
            canvas.cameraComponent = this.uiCameraNode.getComponent(cc.Camera)
            canvas.alignCanvasWithScreen = true
        }

        for (let index = 0; index < UIEnum.UI_MAX; index++) {
            let name = UIEnum[index]
            let childNode = new cc.Node(name)
            this.uiCanvasNode.addChild(childNode)
            childNode.layer = cc.Layers.Enum.UI_2D
        }

        Logger.info("UIGraphManager 初始化成功")
    }

    GetUINode(nodeType: UIEnum) {
        return this.uiCanvasNode.getChildByName(UIEnum[nodeType])
    }

    Clean() {
        this.RemoveAllNode()

        this.node.destroyAllChildren()
        this.node.removeAllChildren()

        this.uiCameraNode = null
        this.uiCanvasNode = null

        Logger.info("UIGraphManager 清理成功")
    }


    /** 添加界面节点 */
    AddNode(baseUIContainer: BaseUIContainer) {
        if (!baseUIContainer.uiType)
            return

        if (!this.uiNodes.has(baseUIContainer.uiType))
            this.uiNodes.set(baseUIContainer.uiType, [])

        let parent = this.GetUINode(baseUIContainer.uiType)
        if (!parent)
            return

        let properties = this.uiNodes.get(baseUIContainer.uiType)
        properties.push(baseUIContainer)
        parent.addChild(baseUIContainer.node)

        baseUIContainer.node.layer = parent.layer

        Logger.info(`UIGraphManager 添加节点:${baseUIContainer.layerName}`)
    }

    /** 移除界面节点 */
    RemoveNode(baseUIContainer: BaseUIContainer) {
        if (!baseUIContainer.uiType)
            return

        if (!this.uiNodes.has(baseUIContainer.uiType))
            return

        let properties = this.uiNodes.get(baseUIContainer.uiType)
        if (!properties) return

        let layerIndex = properties.findIndex(v => v == baseUIContainer)
        if (layerIndex < 0)
            return

        properties.slice(layerIndex, 1)

        if (baseUIContainer.node && cc.isValid(baseUIContainer.node)) {
            baseUIContainer.node.removeFromParent()
            baseUIContainer.node.destroy()
        }

        Logger.info(`UIGraphManager 删除节点:${baseUIContainer.layerName}`)
    }

    /** 移除所有界面节点 */
    RemoveAllNode() {
        for (const properties of this.uiNodes.values()) {
            for (const property of properties.values()) {
                if (property.node && cc.isValid(property.node)) {
                    property.node.removeFromParent()
                    property.node.destroy()
                }
            }
        }
        this.uiNodes.clear()
        Logger.info(`UIGraphManager 清理所有节点`)
    }
}