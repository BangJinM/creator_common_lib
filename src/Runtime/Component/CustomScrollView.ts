import * as cc from "cc";

export class CustomItemData {
    public data: any;
    public tempNode: cc.Node | cc.Prefab
    public size: cc.Size
    public updateFunc: Function
    public itemNode: cc.Node
}

@cc._decorator.ccclass("CustomScrollView")
export class CustomScrollView extends cc.Component {
    customItemData: CustomItemData[] = []
    rect: cc.Rect = new cc.Rect()

    AddCustomItemData(data: CustomItemData) {
        this.customItemData.push(data)
        this.AddItemNode(data)
    }

    AddItemNode(customData: CustomItemData) {
        let scrollView: cc.ScrollView = this.node.getComponent(cc.ScrollView)
        if (!scrollView) return

        if (this.rect.xMax < 2 * customData.size.x || this.rect.yMax < 2 * customData.size.y) {
            this.UpdateRect(2 * customData.size.x, 2 * customData.size.y)
        }

        let itemNode = new cc.Node("CustomItemNode")
        let uiT = itemNode.addComponent(cc.UITransform)
        uiT.contentSize = customData.size
        scrollView.content.addChild(itemNode)
    }

    UpdateRect(x: number, y: number) {
        let uiT = this.getComponent(cc.UITransform)
        this.rect = uiT.getBoundingBox().clone()
        this.rect.xMax += x
        this.rect.xMin -= x
        this.rect.yMin -= y
        this.rect.yMax += y
    }

    protected onEnable(): void {
        let scrollView: cc.ScrollView = this.node.getComponent(cc.ScrollView)
        if (!scrollView) return
        this.node.on(cc.ScrollView.EventType.SCROLLING, this.OnScrolling, this)

        this.UpdateRect(100, 100)
        this.OnScrolling()
    }


    protected onDisable(): void {
        let scrollView: cc.ScrollView = this.node.getComponent(cc.ScrollView)
        if (!scrollView) return
        this.node.off(cc.ScrollView.EventType.SCROLLING, this.OnScrolling, this)
    }

    OnScrolling() {
        let scrollView: cc.ScrollView = this.node.getComponent(cc.ScrollView)
        if (!scrollView) return

        let layout: cc.Layout = scrollView.content.getComponent(cc.Layout)
        layout?.updateLayout(true)

        for (let index = 0; index < scrollView.content.children.length; index++) {
            const itemNode = scrollView.content.children[index];

            let data = this.customItemData[index]
            if (!data) continue

            let uiT = itemNode.getComponent(cc.UITransform)
            if (this.rect.intersects(uiT.getBoundingBoxTo(this.node.getWorldMatrix()))) {
                if (!data.itemNode) {
                    data.itemNode = cc.instantiate(data.tempNode) as cc.Node
                    data.itemNode.position = cc.v3(0, 0, 0)
                    itemNode.addChild(data.itemNode)
                }
                data.updateFunc(data.itemNode, data.data)
            } else {
                data.itemNode = null
                itemNode.destroyAllChildren()
            }
        }
    }

    UpdateItemNode(index: number, itemData: CustomItemData) {
        if (index < 0 || index > this.customItemData.length)
            return

        this.customItemData[index] = itemData
        this.OnScrolling()
    }
}