# :zzz:

## Redux createThunkMiddleware

```javascript
const createThunkMiddleware =
  extraArgument =>
  ({ dispatch, getState }) =>
  next =>
  action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument)
    }

    return next(action)
  }
```

这一串箭头确实给我射晕了。

```javascript
function foo(item) {
  return function (it) {
    return function (i) {
      console.log(item, it, i)
    }
  }
}
// 等价于
const foo1 = item => it => i => console.log(item, it, i)

// 使用
function test(fn) {
  const item = 5
  const it = 6
  const i = 7
  fn(item)(it)(i)
}
test(foo)
```

```javascript
const foo =
  () =>
  ({ a1, a2 }) =>
  bar =>
  baz => {
    if (a1 > a2) {
      return bar()
    } else {
      return baz()
    }
  }

foo()({ a1: 1, a2: 2 })(() => 55)(() => 66)
```
