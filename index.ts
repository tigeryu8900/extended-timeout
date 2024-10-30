import Timeout from "./timeout.js";
import * as timers from "node:timers";

export const setImmediate = timers.setImmediate;

export function setTimeout(callback: (...a: typeof args) => void, delay: number, ...args: any[]): Timeout {
  return new Timeout(false, true, callback, delay, args);
}

export function setInterval(callback: (...a: typeof args) => void, delay: number, ...args: any[]): Timeout {
  return new Timeout(true, true, callback, delay, args);
}

function clear(timeoutId: string | NodeJS.Timeout | Timeout | undefined): void {
  switch (typeof timeoutId) {
    case "string":
      Timeout.entries[timeoutId][Symbol.dispose]();
      break;
    case "object":
      timeoutId[Symbol.dispose]();
      break;
    default:
      break;
  }
}

export const clearImmediate = clear;

export const clearTimeout = clear;

export const clearInterval = clear;