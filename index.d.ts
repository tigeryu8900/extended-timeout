import Timeout from "./timeout.js";
export declare const setImmediate: typeof globalThis.setImmediate;
export declare function setTimeout(callback: (...a: typeof args) => void, delay: number, ...args: any[]): Timeout;
export declare function setInterval(callback: (...a: typeof args) => void, delay: number, ...args: any[]): Timeout;
export declare const clearImmediate: typeof Timeout.clear;
export declare const clearTimeout: typeof Timeout.clear;
export declare const clearInterval: typeof Timeout.clear;
