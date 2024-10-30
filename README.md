# extended-timeout

A timeout implementation for Node.js that supports delays greater than 2147483647

## Usage

The usage is exactly the same as Node.js [Timers API](https://nodejs.org/api/timers.html).

```typescript
import * as timers from "extended-timeout";
import * as timersPromises from "extended-timeout/promises";

// timers.setTimeout and the other APIs support delays above 2147483647
timers.setTimeout(console.log, 2147483648, "hi");

const immediate = timers.setImmediate(console.log, "hi");
console.log(immediate.hasRef()); // returns true
immediate.ref();
immediate.unref();
console.log(immediate.hasRef()); // returns false
timers.clearImmediate(immediate);
const timeout = timers.setTimeout(console.log, 1000, "hi");
timers.clearTimeout(interval);
const interval = timers.setInterval(console.log, 1000, "hi");
timers.clearInterval(interval);

timersPromises.setTimeout(1000).then(() => console.log("hi"));
timersPromises.setTimeout(1000, "hi").then(console.log);
const controller = new AbortController();
timersPromises.setTimeout(1000, "hi", {
  ref: true,
  abort: controller.abort
}).then(console.log);
(async () => {
  for await (const value of timersPromises.setInterval(1000, "hi")) {
    console.log(value);
  }
  let i = 0;
  const controller = new AbortController();
  for await (const value of timersPromises.setInterval(1000, "hi", {
    ref: true,
    abort: controller.abort
  })) {
    console.log(value);
    if (i++ === 5) {
      controller.abort();
    }
  }
})();
```
