import * as cc from "cc";
import { IResource } from "../ResourceManager/IResource";

export class BaseUIComp extends cc.Component {
    loadedResourcs: { [key: string]: IResource } = {}

    InitData(loadedResourcs: { [key: string]: IResource } = {}) {
        this.loadedResourcs = loadedResourcs
    }


}