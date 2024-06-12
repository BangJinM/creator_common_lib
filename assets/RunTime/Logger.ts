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

@set_manager_instance()
export class Logger extends ISingleton {
    /** 最大日志数量，超过清空 */
    private static MAXSIZE = 1000
    /** 当前日志等级 */
    private static LOGGERLEVEL = LoggerLevel.DEBUG
    /** 每次打印最大数量 */
    private static OUTPUTSIZE = 5
    /** 日志列表 */
    private static logInfos = new Array()

    Init() {
        this.Clean()
    }
    Update(deltaTime: number) {
        let index = 0
        let outputSize = Logger.logInfos.length >= Logger.OUTPUTSIZE ? Logger.OUTPUTSIZE : Logger.logInfos.length

        while (outputSize >= 1) {
            Logger.printf(Logger.logInfos.shift())
            outputSize--
        }
    }
    Clean() {
        Logger.logInfos.length = 0
        Logger.LOGGERLEVEL = LoggerLevel.DEBUG
    }

    static debug(log, immediately?) {
        if (Logger.LOGGERLEVEL > LoggerLevel.DEBUG) {
            return
        }
        log = "[DEBUG]" + log
        Logger.addLogs(LoggerLevel.DEBUG, log)
    }

    static info(log, immediately?) {
        if (Logger.LOGGERLEVEL > LoggerLevel.INFO) {
            return
        }
        log = "[INFO]" + log
        Logger.addLogs(LoggerLevel.INFO, log)
    }

    static warn(log, immediately?) {
        if (Logger.LOGGERLEVEL > LoggerLevel.WARN) {
            return
        }
        log = "[WARN]" + log
        Logger.addLogs(LoggerLevel.WARN, log)
    }

    static error(log, immediately?) {
        if (Logger.LOGGERLEVEL > LoggerLevel.ERROR) {
            return
        }
        log = "[ERROR]" + log
        Logger.addLogs(LoggerLevel.ERROR, log, immediately)
    }

    private static addLogs(level: LoggerLevel, str: string, immediately?) {
        if (Logger.logInfos.length >= Logger.MAXSIZE) {
            Logger.logInfos.length = 0
        }

        if (!immediately)
            Logger.logInfos.push({ level: level, logString: str })
        else
            Logger.printf({ level: level, logString: str })
    }

    private static printf(logInfo) {
        console.log(logInfo.logString)
    }
}