import Timeout from "./timeout.js";
export declare const setImmediate: typeof globalThis.setImmediate;
export declare function setTimeout(callback: (...a: typeof args) => void, delay: number, ...args: any[]): Timeout;
export declare function setInterval(callback: (...a: typeof args) => void, delay: number, ...args: any[]): Timeout;
declare function clear(timeoutId: string | NodeJS.Timeout | Timeout | undefined): void;
export declare const clearImmediate: typeof clear;
export declare const clearTimeout: typeof clear;
export declare const clearInterval: typeof clear;
export {};
