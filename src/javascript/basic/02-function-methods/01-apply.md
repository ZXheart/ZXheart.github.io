# :zzz:

## Function.prototype.apply()

`Function`实例的`apply()`方法会以给定的`this`值和作为数组（或**类数组对象**）提供的`arguments`调用该函数。

### 简单实现（待测试 / 补充）

```javascript
Function.prototype._apply = function (thisArg, args) {
  if (typeof this !== 'function') {
    throw new TypeError(this + 'is not a function')
  }
  if (thisArg === undefined || thisArg === null) {
    thisArg = window
  } else {
    thisArg = Object(thisArg)
  }
  if (typeof args !== 'object' || args === null) {
    throw new TypeError('CreateListFromArrayLike called on non-object')
  }
  if (!args.hasOwnProperty('length')) {
    throw new TypeError('CreateListFromArrayLike called on object without a length property')
  }
  const argArr = []
  for (let i = 0; i < args.length; i++) {
    argArr.push(args[i])
  }
  const fn = Symbol('fn')
  thisArg[fn] = this
  const result = thisArg[fn](...argArr)
  delete thisArg[fn]
  return result
}
```
