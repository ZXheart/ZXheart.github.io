# :zzz:

## Logical Operators

## ||

- 从左到右依次计算操作数，转为布尔值
- 如果遇到`true`，停止计算，并返回该操作数的**初始值**
- 如果所有操作数都被计算过（全为`false`），则返回最后一个操作数的**初始值**

总结: `||`操作符返回第一个`true`的操作数，如果所有操作数都是`false`，则返回最后一个操作数

根据这个规则，`||`操作符可以简化代码

1. 为变量赋值默认值

```javascript
// 例如，在函数中为参数赋默认值
function foo(a) {
  a = a || 'default'
  console.log(a)
}
// 例如，为变量赋默认值
const res = getStorage() || 0
```

2.  短路求值(Short-circuit evaluation)

`||`运算符遇到`true`时，会立即返回，不再计算后面的操作数，利用这个特性。左侧操作数为 false 时，可以执行右侧有副作用的表达式

从而实现条件判断，可读性不及 if 语句

```javascript
// 例如，在条件判断中调用函数
function foo() {
  console.log('do something')
}
// 当 trueOrFalse 为 false 时，调用 foo()
trueOrFalse || foo()
// 等同于
if (!trueOrFalse) {
  foo()
}
```

## &&

- 从左到右依次计算操作数，转为布尔值
- 如果遇到`false`，停止计算，并返回该操作数的**初始值**
- 如果所有操作数都被计算过（全为`true`），则返回最后一个操作数的**初始值**

总结: `&&`操作符返回第一个`false`的操作数，如果所有操作数都是`true`，则返回最后一个操作数

`&&`操作符同样有简化代码的应用场景，最常见的是条件判断

```javascript
token && (options.headers['Authorization'] = `Bearer ${token}`)
// 等同于
if (token) {
  options.headers['Authorization'] = `Bearer ${token}`
}
```

::: tip
`&&`操作符的优先级高于`||`操作符

所以`a && b || c && d` 等价于 `(a && b) || (c && d)`

是否使用括号明确优先级，取决于你的代码风格
:::
::: warning
不要使用`&&` `||`取代`if`语句，这样会降低代码的可读性

虽然`&&` `||`操作符可以简化代码，但是可读性远不如`if`语句，除非是简单的条件判断，否则尽量不要使用
:::

## !

`!`用于取反操作数的布尔值

它同样有些简化代码的妙用，将一个值转为布尔值

```javascript
const res = !!'string' // true
// 等同于下边略显冗长的写法
const res = Boolean('string') // true
```

::: tip
`!`操作符的优先级高于`&&` `||`操作符
:::
