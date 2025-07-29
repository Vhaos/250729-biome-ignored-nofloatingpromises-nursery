// should raise a lint/nursery/noBitwiseOperators error. Works as expected
let x = 1 | 0;

// should raise a lint/nursery/noFloatingPromises error.
// however, doesn't raise one if lint/nursery/noFloatingPromises is configured in a non-root biome.jsonc file
const promise = new Promise((resolve) => resolve("value"));
promise.then(() => {});
