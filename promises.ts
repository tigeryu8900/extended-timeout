import Timeout from "./timeout.js";
import AsyncIterator = NodeJS.AsyncIterator;
import * as timersPromises from "node:timers/promises";

interface TimeoutOptions {
  ref: boolean;
  signal: AbortSignal;
}

export const setImmediate = timersPromises.setImmediate;

export function setTimeout(delay: number, value?: any, options: Partial<TimeoutOptions> = {}): Promise<typeof value> {
  const {ref, signal} = options;
  return new Promise<typeof value>((resolve, reject) => {
    const timeout = new Timeout(false, ref ?? true, resolve, delay, [value]);
    if (signal) {
      signal.addEventListener("abort", () => {
        timeout[Symbol.dispose]();
        reject(value);
      });
    }
  });
}

export async function* setInterval(delay: number, value?: any, options: Partial<TimeoutOptions> = {}): AsyncIterator<typeof value> {
  const {ref, signal} = options;
  let resolver: (v: typeof value) => void = () => {};
  const timeout = new Timeout(true, ref ?? true, value => resolver(value), delay, [value]);
  const abortSymbol = Symbol("abort");
  const abortPromise = new Promise<typeof abortSymbol>(resolve => {
    if (signal) {
      signal.addEventListener("abort", () => {
        timeout[Symbol.dispose]();
        resolve(abortSymbol);
      });
    }
  });
  while (true) {
    const result = await Promise.race([
      new Promise<typeof value>(resolve => {
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
  async delay(delay: number, options: Partial<TimeoutOptions> = {}): Promise<void> {
    await setTimeout(delay, null, options);
  },
  async yield(): Promise<void> {
    await timersPromises.scheduler.yield();
  }
};
