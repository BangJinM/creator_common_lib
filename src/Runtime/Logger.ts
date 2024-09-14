import { ISingleton, set_manager_instance } from "./ISingleton";

/** 日志等级 */
export enum LoggerLevel {
    /** 调试 */
    DEBUG = 0,
    /** 详情 */
    INFO,
    /** 警告 */
    WARN,
    /** 报错 */
    ERROR
}

/**
 * 日志管理类
 */
export class Logger {
    /**
     * 用于输出调试信息
     */
    static get debug() {
        return window.console.log.bind(window.console, '%c【调试】', 'color: white; background-color: #007BFF; font-weight: bold; font-size: 14px;');
    }

    /**
     * 用于输出一般信息
     */
    static get info() {
        return window.console.log.bind(window.console, '%c【信息】', 'color: white; background-color: #28A745; font-weight: bold; font-size: 14px;');
    }

    /**
     * 用于输出警告信息
     */
    static get warn() {
        return window.console.log.bind(window.console, '%c【警告】', 'color: black; background-color: #FFC107; font-weight: bold; font-size: 14px;');
    }

    /**
     * 用于输出错误信息
     */
    static get err() {
        return window.console.log.bind(window.console, '%c【错误】', 'color: white; background-color: #DC3545; font-weight: bold; font-size: 14px;');
    }
}

@set_manager_instance()
export class LoggerManager extends ISingleton {
    loggerLevel: LoggerLevel = LoggerLevel.INFO;

    public Update(deltaTime: number): void {

    }
}