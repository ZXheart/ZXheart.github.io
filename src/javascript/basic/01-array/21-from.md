# :zzz:

## Array.prototype.from()

`from()`方法从一个类数组或可迭代对象中创建一个新的浅拷贝的数组实例。

## 语法

```javascript
Array.from(arrayLike[, mapFn[, thisArg]])
```

值得一提的就是第二个参数`mapFn`。

```javascript
const arrayLike = {
  0: 'foo',
  1: 'bar',
  length: 2,
}
// 两种写法等价
const values1 = Array.from(arrayLike).map(value => value)
const values2 = Array.from(arrayLike, value => value)

// 平时大多使用`from`的情况都紧接着使用了`map`。没曾想`from`本身也支持`map`。又可以少敲几次键盘了。
```
