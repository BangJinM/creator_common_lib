import * as cc from "cc";
import { AssetRefComponent } from "./AssetRefComponent";
import { AfterInstantiateNode, AfterInstantiatePrefab, ObserverButtonProperty, ObserverSpriteProperty } from "./AssetRefDefines";
import { BundleCache } from "./BundleCache";
import { LoadSpriteFrame } from "./ResourceLoadUtils";

/** 克隆一个节点或者Prefab */
export function Clone(origin: cc.Node | cc.Prefab) {
    let node: cc.Node = cc.instantiate(origin) as cc.Node
    if (origin instanceof cc.Prefab) AfterInstantiatePrefab(origin, node)
    else AfterInstantiateNode(node)

    let comp= node.getComponent(AssetRefComponent)
    node.on(cc.NodeEventType.NODE_DESTROYED, () => {
        let refComp = node.getComponent(AssetRefComponent)
        if (refComp) {
            refComp.DelAllAssets()
        }
    })
    node.on(cc.NodeEventType.COMPONENT_REMOVED, (component) => {
        if (component instanceof AssetRefComponent) {
            console.error("AssetRefComponent被移除!!!!!!!!!!!!!!!!!!!!!!!!")
        }
    })
    return node
}

/**
 * 设置图片
 */
export function SetSpriteFrame(sprite: cc.Sprite, url: string, bundleCache?: BundleCache) {
    ObserverSpriteProperty(sprite)
    LoadSpriteFrame(url, bundleCache).then(spriteFrame => {
        if (!cc.isValid(sprite)) return
        sprite.spriteFrame = spriteFrame
    })
}

/**
 * 设置按钮
 */
export function SetButton(button: cc.Button, normalSprite: string, pressedSprite: string, hoverSprite: string, disabledSprite: string, bundleCache?: BundleCache) {
    ObserverButtonProperty(button)

    if (normalSprite) {
        LoadSpriteFrame(normalSprite, bundleCache).then(spriteFrame => {
            button.normalSprite = spriteFrame
        })
    }
    if (pressedSprite) {
        LoadSpriteFrame(pressedSprite, bundleCache).then(spriteFrame => {
            button.pressedSprite = spriteFrame
        })
    }
    if (hoverSprite) {
        LoadSpriteFrame(hoverSprite, bundleCache).then(spriteFrame => {
            button.hoverSprite = spriteFrame
        })
    }
    if (disabledSprite) {
        LoadSpriteFrame(disabledSprite, bundleCache).then(spriteFrame => {
            button.disabledSprite = spriteFrame
        })
    }
}