
/**
 * 日志管理类
 */
export class Logger {
    /**
     * 用于输出调试信息
     */
    static get debug() {
        return window.console.debug.bind(window.console, `%c[调试][${new Date().toISOString()}]`, 'color: white; background-color: #007BFF; font-weight: bold; font-size: 12px;');
    }

    /**
     * 用于输出一般信息
     */
    static get info() {
        return window.console.info.bind(window.console, `%c[信息][${new Date().toISOString()}]`, 'color: white; background-color: #28A745; font-weight: bold; font-size: 12px;');
    }

    /**
     * 用于输出警告信息
     */
    static get warn() {
        return window.console.warn.bind(window.console, `%c[警告][${new Date().toISOString()}]`, 'color: black; background-color: #FFC107; font-weight: bold; font-size: 12px;');
    }

    /**
     * 用于输出错误信息
     */
    static get error() {
        return window.console.error.bind(window.console, `%c [错误[${new Date().toISOString()}]`, 'color: white; background-color: #DC3545; font-weight: bold; font-size: 12px;');
    }
}
