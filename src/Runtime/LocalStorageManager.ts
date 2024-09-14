import { ISingleton } from "./ISingleton";
import { GetManagerPersistNode } from "./Utils/CocosUtils";

/** 持久化存储 */
export class LocalStorageManager extends ISingleton {
    private static instance: LocalStorageManager = null

    public static GetInstance() {
        if (!LocalStorageManager.instance) {
            let node = GetManagerPersistNode("LocalStorageManager")
            LocalStorageManager.instance = node.addComponent(LocalStorageManager)
        }
        return LocalStorageManager.instance
    }

    private KEY_CONFIG: string = 'local_data';

    /** 玩家数据 */
    private userData: { [key: string]: any } = {}
    /** 玩家唯一ID，为空则为全局数据 */
    private userKey = ""
    /** 时间 */
    deltaTime = 0

    userMark = false

    Init() {
        this.Clean()
    }

    Clean() {
        this.userData = {}
        this.userKey = ""
        this.userMark = false
    }

    SetKey(userKey: string) {
        this.userKey = userKey
        let userData = this.GetUserData() || "{}"
        this.userData = JSON.parse(userData)
    }

    SetUserData(key: string, value: any) {
        this.userData[key] = value
        // this.userMark = true
        this.SaveUserData()
    }

    SaveUserData() {
        var str = JSON.stringify(this.userData)
        this.save(this.KEY_CONFIG + this.userKey, str)
        this.userMark = false
    }

    GetUserData(): string {
        return localStorage.getItem(this.KEY_CONFIG + this.userKey) || ""
    }

    private save(key: string, value: any) {
        localStorage.setItem(key, value)
    }

    GetUserDataByKey(key: string) {
        return this.userData[key]
    }

    GetStringForKey(key: string, defaultValue = "") {
        return this.GetUserDataByKey(key) || defaultValue
    }

    GetIntegerForKey(key: string, defaultValue: number = 0) {
        let result = this.GetUserDataByKey(key)
        if (!result)
            return defaultValue

        return Number(result)
    }

    GetJsonForKey(key: string) {
        let jsonStr = this.GetStringForKey(key, "{}")
        return JSON.parse(jsonStr)
    }
}