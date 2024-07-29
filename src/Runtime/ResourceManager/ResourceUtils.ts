import * as cc from "cc";
import { AfterInstantiateNode, AfterInstantiatePrefab, ObserverButtonProperty, ObserverSpriteProperty } from "./AssetRefDefines";
import { BundleCache } from "./BundleCache";
import { BundleManager } from "./BundleManager";
import { ResourceArgs } from "./ResourceArgs";
import { LoadAsset, LoadPrefab, LoadSpriteFrame } from "./ResourceLoadUtils";

/** 克隆一个节点或者Prefab */
export function Clone(origin: cc.Node | cc.Prefab) {
    let node: cc.Node = cc.instantiate(origin) as cc.Node
    if (origin instanceof cc.Prefab) AfterInstantiatePrefab(origin, node)
    else AfterInstantiateNode(node)
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

LoadPrefab("prefabs/test", BundleManager.GetInstance().GetBundle("resources")).then(function (asset) {
    let newNode = Clone(asset)
})

SetSpriteFrame(new cc.Sprite(), "images/test", BundleManager.GetInstance().GetBundle("resources"))

LoadAsset(new ResourceArgs("images/test", cc.SpriteFrame, BundleManager.GetInstance().GetBundle("resources")))