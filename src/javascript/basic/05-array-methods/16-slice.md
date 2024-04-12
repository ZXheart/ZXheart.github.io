# :zzz:

## Array.prototype.slice()

这个破方法，基本上每次用都要去 MDN 查一遍，次次用次次查，记不得一点。:punch: 来一拳！

`slice()`方法返回一个新的数组对象，这个对象是一个由`begin`和`end`（不包括`end`）决定的原数组的浅拷贝。原数组不会被改变。

### 语法

```javascript
slice()
slice(begin)
slice(begin, end)
```

### 参数

- start(optional)

  起始索引（从 0 开始），会转换为整数

  1.  如果`start < 0`；`start = arr.length + start` —— `start = 倒数第 Math.abs(start) 个`
  2.  如果`start < -arr.length`或者`省略了 start`；`start = 0`
  3.  如果`start >= arr.length`；不提取任何元素

- end(optional)

  结束索引（不包括），会转换为整数

  1. 如果`end < 0`；`end = arr.length + end` —— `end = 倒数第 Math.abs(end) 个`
  2. 如果`end < -arr.length`；`end = 0`
  3. 如果`end >= arr.length`或者`省略了 end`；`end = arr.length`
  4. 如果`end 在规范后小于或等于 start`；不提取任何元素

### 返回值

含有提取元素的新数组

:::tip

- `slice()`是一个复制方法。不改变`this`，而是返回一个[浅拷贝](/javascript/advanced/04-copy#shallow-copy)，其中包含了原数组的一部分相同元素。
- `slice()`会保留[空槽](/javascript/basic/06-sparse-arrays)。如果被切片的部分是[稀疏的](/javascript/basic/06-sparse-arrays)，则返回的数组也是稀疏的。
- `slice()`方法是通用的。它只要求`this`上有`length`属性和整数键属性。比如：

```javascript
const arr = { 0: 'a', 1: 'b', length: 2 }
```

:::

### 简单实现（待测试 / 补充）

```javascript
Array.prototype._slice = function () {
  const arr = this
  const len = arr.length
  let start = arguments[0]
  let end = arguments[1]

  start = start === undefined ? 0 : start
  end = end === undefined ? len : end

  start = start < 0 ? Math.max(len + start, 0) : Math.min(start, len)
  end = end < 0 ? Math.max(len + end, 0) : Math.min(end, len)

  if (end <= start) return []

  const result = []
  result.length = end - start
  for (let i = start; i < end; i++) {
    if (i in arr) {
      result[i - start] = arr[i]
    }
  }
  return result
}
```
