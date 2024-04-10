# :zzz:

## Nullish Coalescing Operator

空值合并运算符是一个逻辑运算符，当左侧的操作数为 `null` 或 `undefined` 时，返回右侧的操作数，否则返回左侧的操作数。

```javascript
res = a ?? b
// 等价于
ers = a !== null && a !== undefined ? a : b
```

它的使用场景和`||`些许类似，也可以为变量初始化

```javascript
// 当服务器返回的数据中没有 avatar 字段时，使用默认值 default.jpg
console.log(res.data.avatar ?? 'default.jpg')
```

## 与 || 的区别

- `||` 返回第一个 真 值
- `??` 返回第一个 非(`null` 且 `undefined`) 的值

## 优先级

`??`运算符的优先级等同于`||`，低于`&&`。

## 注意事项

`??`不能与 `&&`或者`||`一起使用

出于安全原因，JavaScript 不允许在 `??` 左侧使用 `&&` 或者 `||` 运算符，因为这样会导致一些不明确的行为。可以使用括号明确指定优先级。

下边代码会触发一个语法错误：

```javascript
let a = 1 && 2 ?? 3 // SyntaxError
```

可以明确地使用括号来解决这个问题：

```javascript
let a = (1 && 2) ?? 3 // 2
```
