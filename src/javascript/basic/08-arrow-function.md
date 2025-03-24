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
const test = arg => {
  return arg[0] + arg[1]
}
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
