import * as cc from 'cc'
import { AStarNode, AStarNodeSorter } from "./AStarNode"
import { ISceneGridManager } from "./ISceneGridManager"

let BIAS_VALUE = 3
let LINE_VALUE = 2
let around = [
    [1, 0, LINE_VALUE], // right
    [0, 1, LINE_VALUE], // bottom
    [-1, 0, LINE_VALUE], // left
    [0, -1, LINE_VALUE], // top
    [1, -1, BIAS_VALUE], // right up    
    [1, 1, BIAS_VALUE], // right bottom
    [-1, 1, BIAS_VALUE], // left bottom
    [-1, -1, BIAS_VALUE], // left top    
]

export class FindAStar {
    sceneGridManager: ISceneGridManager
    /** 排序 */
    sortArray: AStarNodeSorter = new AStarNodeSorter()
    gridNodes: Array<Array<AStarNode>> = []
    doneNodes: AStarNode[] = []

    constructor(sceneGridManager: ISceneGridManager) {
        this.sceneGridManager = sceneGridManager
    }

    Clear() {
        for (const element of this.sortArray.aStarNodes) {
            element.clean()
        }
        for (const element of this.doneNodes) {
            element.clean()
        }
        this.doneNodes = []
        this.sortArray.clear()
    }

    FindPath(beginPoint: cc.Vec2, endPoint: cc.Vec2) {
        this.Clear()

        let points: { x: number; y: number }[] = []
        if (beginPoint.equals(endPoint)) {
            return points
        }

        if (this.sceneGridManager.CheckObstacle(endPoint.x, endPoint.y))
            return points

        let endGrid = this.GetGrid(endPoint.x, endPoint.y)
        let currentNode = this.GetGrid(beginPoint.x, beginPoint.y)
        this.NoFound(currentNode, beginPoint.x, beginPoint.y, endPoint.x, endPoint.y, 0, undefined)

        let [x, y] = [0, 0]
        let [offsetX, offsetY, tempPower] = [0, 0, 0]
        let neighborNode: AStarNode

        while (this.sortArray.length() > 0) {
            currentNode = this.sortArray.pop()
            this.doneNodes.push(currentNode)

            if (!currentNode)
                break
            currentNode.status = 2
            if (endGrid.status == 2)
                break
            for ([offsetX, offsetY, tempPower] of around) {
                x = currentNode.mapX + offsetX
                y = currentNode.mapY + offsetY

                neighborNode = this.GetGrid(x, y)
                if (!neighborNode.isObstacle && neighborNode.status != 2) {
                    if (neighborNode.status == 1) this.Found(neighborNode, currentNode, tempPower)
                    else this.NoFound(neighborNode, x, y, endPoint.x, endPoint.y, tempPower, currentNode)
                }
            }
        }
        while (true) {
            points.push({ x: currentNode.mapX, y: currentNode.mapY })
            currentNode = currentNode.preGridNode as AStarNode
            if (!currentNode.preGridNode)
                break
        }
        return points
    }

    Found(gridNode: AStarNode, preNode: AStarNode, tempPower: number) {
        let tempG = preNode.g + tempPower
        if (gridNode.g > tempG) {
            gridNode.g = tempG
            gridNode.f = gridNode.g + gridNode.h
            gridNode.preGridNode = preNode
            this.sortArray.update(gridNode)
        }
    }

    GetGrid(x: number, y: number): AStarNode {
        if (!this.gridNodes[x]) this.gridNodes[x] = []

        let gridNode: AStarNode = this.gridNodes[x][y]
        if (!gridNode) {
            gridNode = new AStarNode(x, y)
            this.gridNodes[x][y] = gridNode
            gridNode.isObstacle = this.sceneGridManager.CheckObstacle(x, y)
        }
        return gridNode
    }

    NoFound(gridNode: AStarNode, x: number, y: number, endX: number, endY: number, tempPower: number, preNode: AStarNode | undefined) {
        gridNode.g = preNode ? (preNode.g + tempPower) : 0
        gridNode.h = this.Cost(x, y, endX, endY)
        gridNode.f = gridNode.g + gridNode.h
        gridNode.preGridNode = preNode
        gridNode.status = 1
        this.sortArray.insert(gridNode)
    }

    /** 从A到B的消耗 */
    private Cost(x: number, y: number, endX: number, endY: number) {
        return (Math.abs(x - endX) + Math.abs(y - endY)) * LINE_VALUE
    }
}