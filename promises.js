import Timeout from "./timeout.js";
import * as timersPromises from "node:timers/promises";
export const setImmediate = timersPromises.setImmediate;
export function setTimeout(delay, value, options = {}) {
    const { ref, signal } = options;
    return new Promise((resolve, reject) => {
        const timeout = new Timeout(false, ref ?? true, resolve, delay, [value]);
        if (signal) {
            signal.addEventListener("abort", () => {
                timeout[Symbol.dispose]();
                reject(value);
            });
        }
    });
}
export async function* setInterval(delay, value, options = {}) {
    const { ref, signal } = options;
    let resolver = () => { };
    const timeout = new Timeout(true, ref ?? true, value => resolver(value), delay, [value]);
    const abortSymbol = Symbol("abort");
    const abortPromise = new Promise(resolve => {
        if (signal) {
            signal.addEventListener("abort", () => {
                timeout[Symbol.dispose]();
                resolve(abortSymbol);
            });
        }
    });
    while (true) {
        const result = await Promise.race([
            new Promise(resolve => {
                resolver = resolve;
            }),
            abortPromise
        ]);
        if (result === abortSymbol) {
            return;
        }
        yield result;
    }
}
export const scheduler = {
    async delay(delay, options = {}) {
        await setTimeout(delay, null, options);
        await setTimeout(delay);
    },
    async yield() {
        await timersPromises.scheduler.yield();
    }
};
