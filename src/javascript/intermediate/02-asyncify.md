# :zzz:

```javascript
function asyncify(fn) {
  const originalFn = fn
  let timer = setTimeout(() => {
    timer = null
    if (fn) fn()
  }, 0)

  fn = null

  return function (...args) {
    if (timer) {
      // 将originalFn绑定到this和args，并赋值给fn，fn会在timer执行时调用
      fn = originalFn.bind(this, ...args)
    } else {
      // 已经是异步，直接调用originalFn
      originalFn.apply(this, args)
    }
  }
}
```
