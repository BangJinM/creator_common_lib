import { IECSSystem } from "./Base/IECSSystem";

let compent_system_map: Map<string, new () => IECSSystem> = new Map();
/**
 * 标记组件对应的系统
 */
export function ecs_component(systemType: new (...args: any[]) => IECSSystem) {
    return function (target: any) {
        compent_system_map.set(target.name, systemType);
    }
}
/**
 * 获取组件对应的系统
 * @param compentType 
 * @returns 构造函数
 */
export function GetComponentSystem(compentType: string): new () => IECSSystem {
    return compent_system_map.get(compentType);
}