import * as cc from "cc";
import { UIEnum } from "./UIEnum";
import { ISingleton, set_manager_instance } from "../ISingleton";
import { BaseUIContainer } from "./BaseUIContainer";

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
    }

    GetUINode(nodeType: UIEnum) {
        return this.uiCanvasNode.getChildByName(UIEnum[nodeType])
    }

    Clean() {
        this.node.destroy()
        this.node.removeFromParent()

        this.uiCameraNode = null
        this.uiCanvasNode = null
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
        for (const property of properties) {
            if (property.layerName == baseUIContainer.layerName)
                return
        }

        properties.push(baseUIContainer)
        parent.addChild(baseUIContainer.node)
    }

    /** 移除界面节点 */
    RemoveNode(baseUIContainer: BaseUIContainer) {
        if (!baseUIContainer.uiType)
            return

        if (!this.uiNodes.has(baseUIContainer.uiType))
            return

        let layerIndex = -1
        let properties = this.uiNodes.get(baseUIContainer.uiType)
        for (let index = 0; index < properties.length; index++) {
            let property = properties[index]
            if (property.layerName == baseUIContainer.layerName)
                layerIndex = index
        }

        if (layerIndex < 0)
            return

        properties.slice(layerIndex, 1)

        if (baseUIContainer.node && cc.isValid(baseUIContainer.node)) {
            baseUIContainer.node.removeFromParent()
            baseUIContainer.node.destroy()
        }
    }

    /** 移除所有界面节点 */
    RemoveAllNode() {
        for (const properties of this.uiNodes.values()) {
            for (const property of properties.values()) {
                this.RemoveNode(property)
            }
        }
    }

}