import AsyncIterator = NodeJS.AsyncIterator;
import * as timersPromises from "node:timers/promises";
interface TimeoutOptions {
    ref: boolean;
    signal: AbortSignal;
}
export declare const setImmediate: typeof timersPromises.setImmediate;
export declare function setTimeout(delay: number, value?: any, options?: Partial<TimeoutOptions>): Promise<typeof value>;
export declare function setInterval(delay: number, value?: any, options?: Partial<TimeoutOptions>): AsyncIterator<typeof value>;
export declare const scheduler: {
    delay(delay: number, options?: Partial<TimeoutOptions>): Promise<void>;
    yield(): Promise<void>;
};
export {};
