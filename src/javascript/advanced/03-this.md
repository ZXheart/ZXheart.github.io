# this

[《你不知道的 JavaScript》](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20%26%20object%20prototypes/ch1.md)

## 为什么要用 this

```javascript
function identity() {
  return this.name
}
function speak() {
  const greeting = `Hello, I'm ${identity.call(this)}`
  console.log(greeting)
}
const me = {
  name: 'Jack',
}
const you = {
  name: 'Joy',
}
console.log(identity.call(me)) // Jack
console.log(identity.call(you)) // Joy

speak.call(me) // Hello, I'm Jack
speak.call(you) // Hello, I'm Joy
```

这个代码片段`identity()`和`speak()`函数对多个环境对象(`me`和`you`)进行复用，而不是针对每个对象定义函数的分离版本。

与使用`this`的方式相比，可以明确的将环境对象传递给`identity`和`speak`。

```javascript
function identity(context) {
  return context.name
}
function speak(context) {
  const greeting = `Hello, I'm ${identity(context)}`
  console.log(greeting)
}
const me = {
  name: 'Jack',
}
const you = {
  name: 'Joy',
}
console.log(identity(me)) // Jack
console.log(identity(you)) // Joy

speak(me) // Hello, I'm Jack
speak(you) // Hello, I'm Joy
```

然而，`this`机制提供了更加优雅的方式来隐含的传递一个对象引用，带来更加干净的 API 设计和更好的可复用性。

你的设计模式越复杂，你就会越清晰地看到：将执行环境作为一个明确参数传递，通常比传递`this`执行环境要乱。**(看不懂，让子弹飞一会)**

## this 的绑定时机

`this`不是编写时绑定，而是**运行时绑定**。它依赖于函数调用时的上下文条件。`this`绑定与函数声明的位置没有任何关系，而与**函数被调用的方式**紧密相连。

当一个函数被调用时，会建立一个被称为执行环境的活动记录。这个记录包含函数是从何处（调用栈-call-stack）被调用的，函数是如何被调用的，被传递了什么
参数等信息。这个记录的属性之一，就是函数执行期间将被使用的`this`引用。

`this`实际上是在函数被调用时建立的一个绑定，它指向什么完全由函数被调用的调用点决定。

## this 的绑定规则

### 默认绑定(Default Binding)

函数最常见的调用情况：独立函数调用。可以认为这种`this`规则是在没有其他规则适用时的默认规则。

```javascript
function foo() {
  console.log(this.a)
}
var a = 2
foo() // 2
```

这段代码中，`foo()`是直接使用不带任何修饰的函数引用进行调用的。没有其他的规则适用于这里，所以默认绑定在这里适用。

如果使用严格模式，`this`会绑定到`undefined`，而不是全局对象。

```javascript
function foo() {
  'use strict'
  console.log(this.a)
}
var a = 2
foo() // TypeError: `this` is `undefined`
```

一个微妙但是重要的细节：即便所有的`this`绑定规则都是完全基于调用点的，但如果`foo()`的内容没有在`strict mode`下执行，对于默认绑定来说
全局对象是唯一合法的；`foo()`的调用点的`strict mode`状态与此无关

```javascript
function foo() {
  console.log(this.a)
}
var a = 2

!(function () {
  'use strict'
  foo() // 2
})()
```

:::warning
不要在代码中故意混用严格模式和非严格模式，你的程序整体应当不是 Strict 就是非 Strict。
:::

### 隐式绑定(Implicit Binding)

调用点是否一个环境对象（context object）。当一个方法引用存在一个环境对象时，这个对象就会被用于这个函数调用的`this`绑定。

```javascript
function foo() {
  console.log(this.a)
}
var obj = {
  a: 2,
  foo: foo,
}
obj.foo() // 2
```

只有对象属性引用链的最后一层是影响调用点的。

```javascript
function foo() {
  console.log(this.a)
}
var obj2 = {
  a: 42,
  foo: foo,
}
var obj1 = {
  a: 2,
  obj2: obj2,
}
obj1.obj2.foo() // 42
```

隐式丢失(Implicitly Lost)：

- 隐式绑定会丢失绑定对象，从而应用默认绑定，根据`strict mode`的状态，其结果不是全局对象就是`undefined`。

```javascript
function foo() {
  console.log(this.a)
}
var obj = {
  a: 2,
  foo: foo,
}
var bar = obj.foo
var a = 'oops, global'
bar() // <-- 调用点！ 'oops, global'
```

bar()实际上是一个不带任何修饰的函数引用，因此只能使用默认绑定。

- 传入回调函数

```javascript
function foo() {
  console.log(this.a)
}
function doFoo(fn) {
  fn() // <-- 调用点！
}
var obj = {
  a: 2,
  foo: foo,
}
var a = 'oops, global'
doFoo(obj.foo) // 'oops, global'
```

- 传入内置回调函数

```javascript
function foo() {
  console.log(this.a)
}
var obj = {
  a: 2,
  foo: foo,
}
var a = 'oops, global'
setTimeout(obj.foo, 100) // 'oops, global'
```

假设`setTimeout`实现如下：

```javascript
function setTimeout(fn, delay) {
  // 等待 delay 毫秒
  fn() // <-- 调用点！
}
```

### 显式绑定(Explicit Binding)

使用隐式绑定时，不得不改变目标对象使它自身包含一个对目标函数的引用，而后使用这个函数引用属性来间接的将`this`绑定到该对象上。

而过`call()`和`apply()`方法，可以在调用函数时显式指定`this`。

```javascript
function foo() {
  console.log(this.a)
}
var obj = {
  a: 2,
}
foo.call(obj) // 2
```

单独依靠显示绑定，还无法解决函数丢失原本`this`绑定，或被第三方框架覆盖等问题。

```javascript
function foo() {
  console.log(this.a)
}
var doFoo = function (fn) {
  fn()
}
var obj = {
  a: 2,
  foo: foo,
}
var a = 'oops, global'
doFoo.call(obj, obj.foo) // oops, global
```

- 硬绑定(Hard Binding)：一个显式绑定的变种可以实现这个技巧。

```javascript
function foo() {
  console.log(this.a)
}
var bar = function () {
  foo.call(obj)
}
var obj = {
  a: 2,
}
bar() // 2
setTimeout(bar, 100) // 2
// bar 将 foo 的 this 绑定到 obj 上
// 且不可以被覆盖
bar.call(window) // 2
```

bar()函数内部手动调用`foo.call(obj)`，强制将`foo`的`this`绑定到`obj`上。无论之后如何调用`bar`，`foo`都会在`obj`上执行。

- 可复用的硬绑定函数

```javascript
function foo(args) {
  return this.a + args
}
function bind(fn, obj) {
  return function (...args) {
    return fn.apply(obj, args)
  }
}
var obj = {
  a: 2,
}
var bar = bind(foo, obj)
console.log(bar(3)) // 5
```

- 内置函数的硬绑定

硬绑定已作为 ES5 的内置方法`Function.prototype.bind`。

```javascript
function foo(args) {
  return this.a + args
}
var obj = {
  a: 2,
}
var bar = foo.bind(obj)
var res = bar(3)
console.log(res) // 5
```

`bind()`返回一个硬编码的新函数，它使用你指定的`this`环境来调用原始函数。

::: tip
在 ES6 中，`bind()`生成的硬绑定函数有一个名为`.name`的属性，它源于原始的目标函数。
举例来说：`var bar = foo.bind(obj)`，`bar.name`的值是`bound foo`。
:::

- API 调用的`环境`

许多库中的函数，和许多在 JavaScript 语言以及宿主环境中的内建函数，都提供一个可选参数，通常称为“环境（context）”，这种设计作为一种替代方案
来确保你的回调函数使用特定的`this`而不必非得使用`bind()`。

```javascript
function foo(item) {
  console.log(item, this.id)
}
const obj = {
  id: 'awesome',
}
const arr = [1, 2, 3]
// forEach()语法: arr.forEach(callback[, thisArg])
arr.forEach(foo, obj)
```

从内部来说，`forEach()`会在每次迭代时调用你传入的回调函数，并且会将当前迭代的值传入回调函数。此外，
它还会将你传入的`thisArg`参数通过`call()`或`apply()`明确绑定到你的回调函数上以节省你得麻烦。

### `new`绑定(New Binding)

开始之间先回顾一下 JavaScript 中的`构造器`。在 JS 中，构造器仅仅是一个函数，它偶然的与前置的`new`操作符一起调用。它们不依附于类，
它们也不初始化一个类。它们甚至不是一种特殊的函数类型。它们本质上只是一般的函数，在被使用`new`来调用时改变了行为。

所以说任何函数，都可以在前边加上`new`来被调用，这使函数调用成为一个构造器调用（constructor call）。这是一个重要而微妙的区别：
实际上不存在“构造器函数”这样的东西，而只有函数的构造器调用

在一个函数前面被加上`new`调用时，也就是构造器调用时，下面这些事情会自动完成：（好像在那里已经抄过一遍了，再来一遍吧）

1. 一个全新的对象会凭空创建
2. 这个新创建的对象会被接入原型链（`空对象.[[Prototype]] = 构造函数.prototype`）
3. 新创建的对象会被设置为函数调用的 this 绑定
4. 除非函数返回一个他自己的其他对象，否则这个被`new`调用的函数会自动返回这个新创建的对象

```javascript
function foo(a) {
  this.a = a
}
const bar = new foo(2)
console.log(bar.a) // 2
```

通过`new`来调用`foo()`，构建一个新的对象并把这个新对象作为`foo()`调用的`this`。`new`是函数调用可以绑定`this`的最后一种方式。

## 优先级

- 首先，默认绑定的优先级肯定是最低的

- 显示绑定 VS 隐式绑定

```javascript
function foo() {
  console.log(this.a)
}
var obj1 = {
  a: 1,
  foo: foo,
}
var obj2 = {
  a: 2,
  foo: foo,
}
obj1.foo() // 1
obj1.foo.call(obj2) //2
```

所以，显式绑定的优先级高于隐式绑定。

- `new`绑定 VS 隐式绑定

```javascript
function foo(arg) {
  this.a = arg
}

var obj1 = {
  foo: foo,
}
var obj2 = {}

obj1.foo(2)
console.log(obj1.a) // 2

obj1.foo.call(obj2, 3)
console.log(obj2.a) // 3

var bar = new obj1.foo(4) // new绑定 和 隐式绑定同时存在
console.log(obj1.a) // 2
console.log(bar.a) // 4
```

- `new`绑定 VS 显式绑定

::: tip
`new`和`call`、`apply`不能同时使用，所以`new foo.call(obj1)`是不允许的，也就是不能直接对比测试 new 绑定和明确绑定。但是可以使用
`硬绑定`来测试这两个规则的优先级
:::

在开始之前，回忆一下`硬绑定`是如何工作的，也就是`Function.prototype.bind()`创建一个新的包装函数，这个函数被硬编码为忽略他自己的`this`
绑定，转而使用使用我们提供的。

因此，这里看起来很明显，`硬绑定`的优先级要比 new 绑定高，且不能被`new`覆盖。校验一下：

```javascript
function foo(arg) {
  this.a = arg
}
var obj1 = {}

var bar = foo.bind(obj1)
bar(2)
console.log(obj1.a) // 2

var baz = new bar(3) // 这里的bar已经是被硬绑定过的，bar函数内部的this已经被绑定到obj1上
console.log(obj1.a) // 2
console.log(baz.a) // 3 然而，结果是3，说明new绑定优先级高于硬绑定
```

然而真相是，`bar`是硬绑定到`obj1`的，但是`new bar(3)`并没有像期待的那样将`obj1.a`变为 3。反而，硬绑定的`bar`函数返回了一个新的对象，说明
`new`被实施了，而且`new`的优先级高于硬绑定。

回顾之前我们`山寨`过一个`bind`函数：

```javascript
function bind(fn, obj) {
  return function (...args) {
    return fn.apply(obj, args)
  }
}
```

我使用`山寨`的`bind()`函数也执行了同样的代码，发现`new`操作符无法将绑定到 `obj1` 的硬绑定覆盖

```javascript {16,18-23}
Function.prototype.myBind = function (fn, obj) {
  return function (...args) {
    return fn.apply(obj, args)
  }
}
function foo(args) {
  this.a = args
}

const obj1 = {}
const bar = foo.myBind(foo, obj1)
bar(2)
console.log(obj1.a) // 2

const baz = new bar(3)
// 上一行代码相当是foo.apply(obj1,[3])，所以这里obj1.a = 3
console.log(obj1.a) //3
/**
 * 同时，myBind()返回的匿名函数就是bar函数。bar函数也是通过new调用的，意思是bar()
 * 内部会创建一个空对象，如果bar()显式的返回了一个对象，那baz就等同于该返回对象，
 * 否则就是创建的空对象。那么baz的值就取决于 fn.apply(obj, args) 的返回值；
 * 而作为参数传入的foo函数没有返回值（undefined）。所以baz是一个空对象
 */
console.log(baz, baz.a) //{} undefined
```

这是因为 ES5 的内建`Function.prototype.bind()`更加精妙，实际上十分精妙。这个是 MDN 提供的（稍稍格式化）polyfill（低版本兼容填补工具）：

```javascript
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
    }
    const aArgs = Array.prototype.slice.call(arguments, 1)
    const fToBind = this
    const fNOP = function () {}
    const fBound = function () {
      return fToBind.apply(
        this instanceof fNOP && oThis ? this : oThis,
        aArgs.concat(Array.prototype.slice.call(arguments))
      )
    }
    fNOP.prototype = this.prototype
    fBound.prototype = new fNOP()
    return fBound
  }
}
```
