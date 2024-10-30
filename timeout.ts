import * as timers from "node:timers";

export default class Timeout {
  private readonly created_at: number;
  private readonly delay: number;
  private readonly repeat: boolean;
  private readonly callback: (...args: typeof this.args) => void;
  private readonly args: any[];
  private is_ref: boolean;
  private readonly key: string;
  private is_extended: boolean;
  private internal_timeout: NodeJS.Timeout | null = null;

  static ref_count: number = 0;
  static readonly MAX_TIMEOUT = 2147483647;
  static dummy_timeout: NodeJS.Timeout = timers.setInterval(() => {}, Timeout.MAX_TIMEOUT).unref();
  static entries: Record<string, Timeout> = {};

  constructor(repeat: boolean, is_ref: boolean, callback: (...a: typeof args) => void, delay: number, args: any[]) {
    this.created_at = Date.now();
    this.delay = delay;
    this.repeat = repeat;
    this.callback = callback;
    this.args = args;
    this.is_ref = is_ref;
    this.key = Math.random().toString(36).substring(2);
    if (delay > Timeout.MAX_TIMEOUT) {
      this.is_extended = true;
      if (is_ref) {
        Timeout.ref_count++;
        Timeout.dummy_timeout.ref();
      }
      this.args = args;
      Timeout.entries[this.key] = this;
    } else {
      this.is_extended = false;
      if (repeat) {
        this.internal_timeout = timers.setInterval(() => {
          this.callback(...this.args);
          this.internal_timeout = null;
        }, delay);
      } else {
        this.internal_timeout = timers.setTimeout(() => {
          this.callback(...this.args);
          this.internal_timeout = null;
        }, delay);
      }
    }
  }

  hasRef(): boolean {
    return this.is_ref;
  }

  ref(): Timeout {
    if (this.is_extended) {
      Timeout.inc_ref();
    } else if (this.internal_timeout) {
      this.internal_timeout.ref();
    }
    this.is_ref = true;
    return this;
  }

  unref(): Timeout {
    if (this.is_extended) {
      Timeout.dec_ref();
    } else if (this.internal_timeout) {
      this.internal_timeout.unref();
    }
    this.is_ref = false;
    return this;
  }

  [Symbol.dispose](): void {
    if (this.internal_timeout) {
      this.internal_timeout[Symbol.dispose]();
      this.internal_timeout = null;
    }
    delete Timeout.entries[this.key];
    this.unref();
  }

  [Symbol.toPrimitive](): string {
    return this.key;
  }

  private static inc_ref(): void {
    Timeout.ref_count++;
    Timeout.dummy_timeout.ref();
  }

  private static dec_ref(): void {
    switch (Timeout.ref_count) {
      case 0:
        break;
      case 1:
        Timeout.ref_count = 0;
        Timeout.dummy_timeout.unref();
        break;
      default:
        Timeout.ref_count--;
    }
  }

  private dispatch(): void {
    if (this.is_extended) {
      if (this.repeat) {
        const delay = this.delay - (Date.now() - this.created_at) % this.delay;
        if (delay <= Timeout.MAX_TIMEOUT) {
          this.internal_timeout = timers.setTimeout(() => this.callback(...this.args), delay).unref();
        }
      } else {
        const delay = this.created_at + this.delay - Date.now();
        if (delay <= Timeout.MAX_TIMEOUT) {
          this.is_extended = false;
          delete Timeout.entries[this.key];
          if (this.is_ref) {
            Timeout.dec_ref();
          }
          this.internal_timeout = timers.setTimeout(() => {
            this.callback(...this.args);
          }, delay);
        }
      }
    }
  }

  static main() {
    timers.setInterval(() => {
      for (const entry of Object.values(Timeout.entries)) {
        entry.dispatch();
      }
    }, Timeout.MAX_TIMEOUT).unref();
  }
}

Timeout.main();
