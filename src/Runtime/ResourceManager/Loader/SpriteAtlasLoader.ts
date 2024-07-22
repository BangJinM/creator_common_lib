import * as cc from "cc";
import { ResourceArgs } from "../ResourceArgs";
import { IResourceLoader } from "./IResourceLoader";

export class SpriteAtlasLoader extends IResourceLoader {
    Load(): Promise<cc.SpriteAtlas> {
        return new Promise(function (success) {
            let promise = Promise.all<cc.Asset>([new Promise((subSuccess) => {
                let newArgs = new ResourceArgs();
                newArgs.Copy(this);

                newArgs.url = this.url + this.options.resSuffix;
                newArgs.type = cc.SpriteFrame;

                let promise = this.resourceFactory.LoadAsset(newArgs);
                promise.then((asset) => {
                    asset?.addRef();
                    subSuccess(asset);
                });
            }), new Promise((subSuccess) => {
                let newArgs = new ResourceArgs();
                newArgs.Copy(this);

                newArgs.url = this.url + ".plist";
                newArgs.type = cc.JsonAsset;

                let promise = this.resourceFactory.LoadAsset(newArgs);
                promise.then((asset) => {
                    asset?.addRef();
                    subSuccess(asset);
                });
            })]);
            promise.then(function (array) {
                for (const asset of array) {
                    asset?.decRef();
                }
                if (!array[0] || !array[1]) {
                    success(null);
                    return;
                }


                function GetFrameData(str: string) {
                    if (str.length < 13) {
                        return null;
                    }
                    let newStr: string = str;
                    newStr = newStr.slice(2);
                    newStr = newStr.slice(0, newStr.length - 2);
                    let newList_0: string[] = newStr.split('},{');
                    let newList_1: string[] = newList_0[0].split(",");
                    let newList_2: string[] = newList_0[1].split(",");
                    if (newList_1.length < 2 || newList_2.length < 2) {
                        return null;
                    }
                    return new cc.Rect(parseInt(newList_1[0]), parseInt(newList_1[1]), parseInt(newList_2[0]), parseInt(newList_2[1]));
                }

                function GetSizeData(str: string) {
                    if (str.length < 5) {
                        return null;
                    }
                    let newStr: string = str;
                    newStr = newStr.slice(1);
                    newStr = newStr.slice(0, newStr.length - 1);
                    let newList_0: string[] = newStr.split(',');
                    if (newList_0.length < 2) {
                        return null;
                    }
                    return new cc.Size(parseInt(newList_0[0]), parseInt(newList_0[1]));
                }
                function GetOffsetData(str: string) {
                    if (str.length < 5) {
                        return null;
                    }
                    let newStr: string = str;
                    newStr = newStr.slice(1);
                    newStr = newStr.slice(0, newStr.length - 1);
                    let newList_0: string[] = newStr.split(',');
                    if (newList_0.length < 2) {
                        return null;
                    }
                    return new cc.Vec2(parseInt(newList_0[0]), parseInt(newList_0[1]));
                }

                let spriteFrame = array[0] as cc.SpriteFrame
                let plistAsset = array[1] as cc.Asset

                let customAtlas = new cc.SpriteAtlas(this.url)
                let frames = plistAsset._nativeAsset?.frames
                if (frames) {
                    for (const key of Object.keys(frames)) {
                        let childSpriteFrame = new cc.SpriteFrame()
                        let spriteFrameInfo = frames[key]
                        childSpriteFrame.reset({
                            texture: spriteFrame.texture,
                            rect: GetFrameData(spriteFrameInfo.frame),
                            isRotate: spriteFrameInfo.rotated,
                            offset: GetOffsetData(spriteFrameInfo.offset),
                            originalSize: GetSizeData(spriteFrameInfo.sourceSize)
                        })
                        // 跟SpriteAtlas保持一致
                        customAtlas.spriteFrames[key.replace(/.jpg|.png/, "")] = childSpriteFrame
                    }
                }

                this.AddDepends(array);
                this.SetAsset(customAtlas);

                success(customAtlas);
            }.bind(this));
        }.bind(this));
    }
}
