import Timeout from "./timeout.js";
import * as timers from "node:timers";

export const setImmediate = timers.setImmediate;

export function setTimeout(callback: (...a: typeof args) => void, delay: number, ...args: any[]): Timeout {
  return new Timeout(false, true, callback, delay, args);
}

export function setInterval(callback: (...a: typeof args) => void, delay: number, ...args: any[]): Timeout {
  return new Timeout(true, true, callback, delay, args);
}

export const clearImmediate = Timeout.clear;

export const clearTimeout = Timeout.clear;

export const clearInterval = Timeout.clear;
