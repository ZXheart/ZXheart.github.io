# :zzz:

## Array.prototype.join()

`join()`方法将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串，用逗号或指定的分割字符串分割。如果数组只有一个元素，那么将返回该元素而不是用分隔符。

### 简单实现（待测试 / 补充）

```javascript
Array.prototype._join = function (...args) {
  if (this.hasOwnProperty('length') === false) {
    throw new TypeError('CreateListFromArrayLike called on object without a length property')
  }

  if (this.length === 0) {
    return ''
  }
  if (this.length === 1) {
    if (this[0] === undefined || this[0] === null) {
      return ''
    }
    if (typeof this[0] === 'object') {
      return this[0].toString()
    }
    return '' + this[0]
  }

  const separator = args[0] || ','
  let result = ''
  for (let i = 0; i < this.length; i++) {
    // null、undefined、空槽 都会被判断为 true
    // 如果想判断出空槽，可以使用hasOwnProperty或in
    // this[i] === undefined && !(i in this) true则代表空槽
    // this[i] === undefined && !this.hasOwnProperty(i) true则代表空槽
    // hasOwnProperty 会更安全一些
    if (this[i] === null || this[i] === undefined) {
      if (i > 0) {
        result += separator
      }
    } else {
      if (i > 0) {
        result += separator
      }
      result += this[i]
    }
  }
  return result
}
```
