# :zzz:

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

这段代码中，`foo()`是直接使用不带任何修饰的函数引用进行调用的。没有其他的规则适用于这里，所以*默认绑定*在这里适用。

如果使用严格模式，`this`会绑定到`undefined`，而不是全局对象。

```javascript
function foo() {
  'use strict'
  console.log(this.a)
}
var a = 2
foo() // TypeError: `this` is `undefined`
```

一个微妙但是重要的细节：即便所有的`this`绑定规则都是完全基于调用点的，但如果`foo()`的内容没有在`strict mode`下执行，对于*默认绑定*来说
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

- *隐式绑定*会丢失绑定对象，从而应用*默认绑定*，根据`strict mode`的状态，其结果不是全局对象就是`undefined`。

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

bar()实际上是一个不带任何修饰的函数引用，因此只能使用*默认绑定*。

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

单独依靠*显式绑定*，还无法解决函数丢失原本`this`绑定，或被第三方框架覆盖等问题。

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

- 硬绑定(Hard Binding)：一个*显式绑定*的变种可以实现这个技巧。

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

- 可复用的*硬绑定*函数

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

*硬绑定*已作为 ES5 的内置方法`Function.prototype.bind`。

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
在 ES6 中，`bind()`生成的*硬绑定*函数有一个名为`.name`的属性，它源于原始的目标函数。
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

- 首先，默认绑定的优先级是最低的

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

所以，*显式绑定*的优先级高于*隐式绑定*。

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

所以，*`new`绑定*的优先级高于*隐式绑定*

- `new`绑定 VS 显式绑定

::: tip
`new`和`call`、`apply`不能同时使用，所以`new foo.call(obj1)`是不允许的，也就是不能直接对比测试 *new 绑定*和*显式绑定*。但是可以使用
*硬绑定*来测试这两个规则的优先级
:::

在开始之前，回忆一下*硬绑定*是如何工作的，也就是`Function.prototype.bind()`创建一个新的包装函数，这个函数被硬编码为忽略他自己的`this`
绑定，转而使用使用我们提供的。

因此，这里看起来很明显，*硬绑定*的优先级要比 *new 绑定*高，且不能被`new`覆盖。校验一下：

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

结果出乎预料。`bar`是*硬绑定*到`obj1`的，但是`new bar(3)`并没有像期待的那样将`obj1.a`变为 3。反而，*硬绑定*的`bar`函数返回了一个新的对象，
说明`new`被实施了，而且`new`的优先级高于*硬绑定*。

回顾之前我们*山寨*过一个`bind`函数：

```javascript
function bind(fn, obj) {
  return function (...args) {
    return fn.apply(obj, args)
  }
}
```

我使用*山寨*的`bind()`函数执行了同样的代码，结果`new`操作符无法将绑定到 `obj1` 的*硬绑定*覆盖

```javascript {17,19-24}
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
// new bar(3)等同于foo.apply(obj1,[3])，所以这里obj1.a = 3
console.log(obj1.a) //3
/**
 * 同时，myBind()返回的匿名函数赋值给bar。bar函数通过new调用，那么bar函数执行时
 * 内部会创建一个空对象。如若bar()显式的返回了一个对象，那baz就等同于该返回对象，
 * 否则就是创建的空对象。这样baz的值就取决于 fn.apply(obj, args) 的返回值；
 * 而作为参数传入的foo函数没有返回值（默认undefined）。所以baz是一个空对象
 */
console.log(baz, baz.a) //{} undefined
```

这是因为 ES5 的内建`Function.prototype.bind()`更加精妙，实际上十分精妙。这个是 MDN 提供的（稍稍格式化）polyfill：

```javascript
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    //oThis是第一个参数，也就是绑定的对象
    if (typeof this !== 'function') {
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
    }
    // arguments是包括oThis的类数组对象。这里将oThis去掉，并转为数组
    const aArgs = Array.prototype.slice.call(arguments, 1)

    // 保存一份被绑定函数（原函数）的引用；
    // 目的是为了保持原型链的完整性（就是返回的硬绑定函数如果是通过new调用，new出的实例.__proto__应该指向this）
    const fToBind = this

    // 工具函数，用于链接bound函数和原函数的原型链
    const fNOP = function () {}

    // 返回的硬绑定函数
    const fBound = function () {
      return fToBind.apply(
        // 第一个参数：这里的this是fBound的调用者，
        // 如果是通过new调用，this就是new出的实例。最终apply绑定的就是new出的实例；（前边表现和预期不同的原因就是因为这句代码）
        // 如果是默认调用，this就是window。最终apply绑定的就是oThis
        // 如果是对象调用，this就是对象。最终apply绑定的就是oThis
        // 如果是显示调用，this就是指定的对象。最终apply绑定的就是oThis

        // 我不懂这里为什么要 && oThis； fuck!!!
        this instanceof fNOP && oThis ? this : oThis,
        aArgs.concat(Array.prototype.slice.call(arguments))
      )
    }
    // 目的：fBound.prototype.__proto__ === fToBind.prototype
    fNOP.prototype = this.prototype
    fBound.prototype = new fNOP()
    return fBound
  }
}
```

我用 ES5 以后的语法重构了一下，原版对我来说太难懂了

```javascript
Function.prototype.myBind = function (...outArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
  }
  const aArgs = outArgs.slice(1)
  const fToBind = this
  const fBound = function (...inArgs) {
    return fToBind.apply(this instanceof fBound && outArgs[0] ? this : outArgs[0], aArgs.concat(inArgs))
  }
  fBound.prototype = Object.create(this.prototype)
  return fBound
}
```

::: details
为什么`new`可以覆盖*硬绑定*这件事很有用

这个行为的主要原因是，创建一个实质（基本？）上忽略`this`的*硬绑定*而预先设置一部分或所有的参数的函数（这个函数可以与`new`一起是用来构建对象）。
`bind()`的一个能力是，任何在第一个`this`绑定参数之后被传入的参数，默认的作为当前函数的标准参数
（技术上这成为“局部应用（partial application）”，是一种“柯里化（currying）”）

The primary reason for this behavior is to create a function (that can be used with `new` for constructing objects)
that essentially ignores the `this` _hard binding_ but which presets some or all of the function's arguments. One of
the capabilities of `bind(..)` is that any arguments passed after the first `this` binding argument are defaulted as
standard arguments to the underlying function (technically called "partial application", which is a subset of "currying").

**卧槽，TMD 一个字也看不懂**

```javascript
function foo(p1, p2) {
  this.val = p1 + p2
}
// 这里使用`null`是因为我们不关心硬绑定的`this`（反正会被`new`覆盖），只关心参数
const bar = foo.bind(null, 'p1')
const baz = new bar('p2')
console.log(baz.val) // p1p2
// 抄完了，完全不知道这个`Details`在表达什么
```

:::
:::details
而且，测试的时候，如果添加了`&& oThis`，`myBind`和`Function.prototype.bind`的行为就会不一样

正如代码所示，似乎去掉`&& oThis`才合理。**你妹的，真让人恼火！**

```javascript
function foo() {
  console.log(this.a)
}
var a = 'global'

const bar = foo.myBind(null, 3, 4, 5)
bar() // global
const barRes = new bar() // global

const baz = foo.bind(null, 3, 4, 5)
baz() // global
const res = new baz() // undefined
```

:::

## 判定 this

现在，可以按照优先顺序总结一下从函数调用的调用点来判断`this`的规则了。
按照这个顺序来提问，然后在第一个规则适合的地方停下：

1. 函数是通过`new`调用的吗？如果是，`this`就是新创建的对象。
2. 函数是通过`call`或`apply`被调用，甚至是隐藏在`bind`硬绑定中吗？如果是，`this`就是那个被明确指定的对象。
3. 函数是通过环境对象被调用的吗？如果是，`this`就是那个环境对象。
4. 否则，使用默认绑定。如果在`strict mode`下，就是`undefined`，否则就是`globalThis`对象。

## 绑定特例

总有一些“规则”之外的情况。

### 被忽略的 this

如果你传入`null`或`undefined`作为`call`、`apply`、`bind`的`this`绑定参数，那么这些值会被忽略掉，取而代之的是*默认绑定*规则。

```javascript
function foo() {
  console.log(this.a)
}
var a = 2
foo.call(null) // 2
```

什么情况你会向`this`绑定故意传递像`null`这样的值？

一个常见的做法是，使用`apply(..)`来“展开”一个数组，并当作参数传入一个函数。类似的，`bind(..)`可以对参数进行柯里化（curry）。

```javascript
function foo(a, b) {
  console.log(`a: ${a}, b: ${b}`)
}
// 1、 函数接收参数列表，但现在我们有一个数组
// 将数组展开，作为参数传入foo
foo.apply(null, [2, 3]) // a: 2, b: 3

// 2、使用`bind(..)`进行柯里化
const bar = foo.bind(null, 2)
bar(3) // a: 2, b: 3
```

这两种用法都要求第一个参数是`this`绑定。如果目标函数不关心`this`，就需要一个占位值，`null`看起来是一个合理的选择。

:::tip
ES6 的扩展运算符（`...`）可以替代`apply(..)`的展开功能，而且更加简洁易懂。比如`foo(...[2, 3])`等同于`foo(2, 3)`。
如果`this`绑定没必要，可以在语法上回避它。但是柯里化在 ES6 中并没有好的替代品。

:::
::: warning

可是，在你不关心`this`绑定而一直使用`null`的时候，有些潜在“危险”。如果你这样调用一些函数（比如，第三方包），而且那些函数确实使用了`this`，
那么你可能会意外的将全局对象（`globalThis`）绑定到那个函数上。
:::

#### 更安全的 this

为了`this`传递一个特殊创建好的对象，这个对象保证不会对程序产生副作用。从网络学（或军事）上借用一个词，我们可以建立
一个“DMZ-demilitarized zone”（非军事区）对象——一个完全为空，没有委托的对象

如果我们为了忽略自己认为不用关心的`this`绑定，而总是传递一个 DMZ 对象，那么我们就可以确定任何对`this`的隐藏或意外地使用将会被限制在这个
空对象中，也就是说这个对象将`globalThis`对象和副作用隔离开。

本书推荐这个对象的名字是`ø`（空集合的数学符号的小写）。当然只是推荐

无论叫什么，创建**完全为空的对象**的最简单的方法就是使用`Object.create(null)`。`Object.create(null)`和`{}`很像，但是没有
指向`Object.prototype`的委托链接，所以他比`{}`“空的更彻底”

```javascript
function foo(a, b) {
  console.log(`a: ${a}, b: ${b}`)
}
const ø = Object.create(null)
// 展开数组
foo.apply(ø, [2, 3]) // a: 2, b: 3
// 使用bind进行柯里化
const bar = foo.bind(ø, 2)
bar(3) // a: 2, b: 3
```

### 间接引用

另一个要注意的是，你可以（有意或无意地！）创建对函数的“间接引用（indirect reference）”，在那样的情况下，当那个函数被调用时，
*默认绑定规则*也会适用。

一个最常见的间接引用产生方式是通过赋值：

```javascript
function foo() {
  console.log(this.a)
}
var a = 2
var o = { a: 3, foo: foo }
var p = { a: 4 }
o.foo() // 3
// 测试得：(p.foo = o.foo)的结果是foo函数本身的引用，为啥不知道，让子弹飞一会
;(p.foo = o.foo)() // 2
```

赋值表达式`p.foo=o.foo`的结果值是一个刚好指向底层函数对象的引用。因此，起作用的调用点是`foo()`，而非`p.foo()`或`o.foo()`。

:::tip
无论如何使用*默认绑定*规则进行函数调用。决定`this`值的只是`strict mode`而非函数调用位置。非严格模式下，`this`会被绑定到`globalThis`，严
格模式下，`this`会被绑定到`undefined`。
:::

### 软绑定（Softening Binding）

之前已经看到*硬绑定*是一种通过函数强制绑定到特定的`this`上，来防止函数在不经意间退回到*默认绑定*的策略（除非你用`new`去覆盖它！）。
问题是，*硬绑定*极大地降低了函数的灵活性，阻止我们手动使用*隐式绑定*或*显式绑定*来覆盖`this`。

书中期望描述：为*默认绑定*提供不同的默认值（非`globalThis`或`undefined`），同时保持函数可以通过*隐式绑定*或*显式绑定*手动绑定`this`。

```javascript
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function (obj) {
    var fn = this
    var curried = [].slice.call(arguments, 1)
    var bound = function bound() {
      return fn.apply(
        // 如果this是globalThis或undefined，使用默认值obj，否则使用this
        !this || (typeof globalThis !== 'undefined' && this === globalThis) ? obj : this,
        curried.concat.apply(curried, arguments)
      )
    }
    bound.prototype = Object.create(fn.prototype)
    return bound
  }
}
```

这个`softBind()`工作方式和 ES5 内建的`bind()`工具很相似，除了*软绑定*行为。它用一种逻辑将指定的函数包装起来，这个逻辑在函数调用时检查`this`,
如果它是`globalThis`或`undefined`，就使用指定的*默认值*(`obj`)，否则使用`this`。同时也提供了可选的柯里化行为。

```javascript
function foo() {
  console.log(this.name)
}
var obj1 = { name: 'obj1' }
var obj2 = { name: 'obj2' }
var obj3 = { name: 'obj3' }

var fooObj = foo.softBind(obj1)
fooObj() // obj1

obj2.foo = foo.softBind(obj1)
obj2.foo() // obj2

fooObj.call(obj3) // obj3

setTimeout(obj2.foo, 10) // obj1
```

*软绑定*版本的`foo()`函数可以如下展示的那样被手动`this`绑定到`obj2`或`obj3`，如果*默认绑定*适用时会退回到`obj1`。

### 箭头函数

ES6 引入了一种不适用于四种绑定规则的函数：箭头函数（arrow-function）

箭头函数不是通过`function`关键字声明的，而是用过“大箭头”操作符：`=>`。与使用四种标准的`this`规则不同的是，箭头函数从封闭他的（函数或全局）
作用域采用`this`绑定

```javascript
function foo() {
  return a => {
    console.log(this.a)
  }
}
var obj1 = { a: 2 }
var obj2 = { a: 3 }

// bar箭头函数的封闭（外层）函数this绑定到obj1
var bar = foo.call(obj1)
// bar函数重新绑定到obj2，但是箭头函数的this绑定不会改变，顺延到外层函数的this绑定
bar.call(obj2) // 2
```

在`foo()`中创建的箭头函数在词法上捕获`foo()`被调用时的`this`，不管它是什么。因为`foo()`被`this`绑定到`obj1`，`bar`（被返回的箭头函数
的一个引用）也将被用`this`绑定到`obj1`。一个箭头函数的词法绑定是不能被覆盖的（就连`new`也不行！）。

常见用法是用于回调，比如时间处理器或计时器：

```javascript
function foo() {
  setTimeout(() => {
    // 这里的 this 是此法上从 foo()继承的
    console.log(this.a)
  }, 100)
}
var obj = { a: 2 }
foo.call(obj) // 2
```

虽然箭头函数提供了除使用`bind()`外，另一种在函数上确保`this`的方式，但重要的是要注意它们本质是使用广为人知的词法作用域来禁止了传统的`this`
机制。在 ES6 之前，为此我们有了相当常用的模式，这些模式几乎和 ES6 的箭头函数的精神没有区别：

```javascript
function foo() {
  var self = this
  setTimeout(function () {
    console.log(self.a)
  }, 100)
}
var obj = { a: 3 }
foo.call(obj) // 3
```

虽然对不想用`bind()`的人来说`self = this`和箭头函数看起来都是不错的“解决方案”，但他们实质上逃避了`this`而非理解和接受它。

如果你发现你在写`this`风格的代码，但是大多或全部时候，你都用词法上的`self = this`或箭头函数“技巧”抵御`this`机制，那么也许你应该：

1. 仅使用词法作用域并忘掉虚伪的`this`风格代码
2. 完全接收`this`风格机制，包括在必要的时候使用`bind()`，并尝试避开`self = this`和箭头函数的“此法 this”技巧。

一个程序可以有效的同时利用两种风格的代码（此法和`this`），单在同一个函数内部，特别是对同种类型的查找，混合这两种机制通常是自找很难维护的代码，
而且可能聪明过了头。

使用`bind()`风格实现上边代码：

```javascript
// 1、 第一次知道可以在函数体后边直接调用bind
function foo() {
  setTimeout(
    function () {
      console.log(this.a)
    }.bind(this),
    100
  )
}
// 2、
function foo1() {
  function bar() {
    console.log(this.a)
  }
  var bar = bar.bind(this)
  setTimeout(bar, 100)
}

var obj = { a: 3 }
foo.call(obj) // 3
foo1.call(obj) // 3
```

明显箭头函数更香

## 总结

为执行中的函数判定`this`绑定需要找到这个函数的直接调用点。找到后，四种规则将会以以下顺序被应用：

1. 通过`new`调用？使用新创建的对象。
2. 通过`call`或`apply`（或`bind`）调用？使用指定的对象。
3. 通过上下文对象调用？使用那个上下文对象。
4. 默认：在`strict mode`下是`undefined`，否则是`globalThis`。

小心偶然或不经意地*默认绑定*规则调用。如果你想“安全”的忽略`this`绑定，一个像`ø=Object.create(null)`这样的“DMZ”对象是一个很好的占位置。
以保护`globalThis`对象不受以外的副作用影响。

与四种绑定规则不同，ES6 的箭头函数使用词法作用域来决定`this`绑定，这意味着它们**采用封闭他们的函数作为`this`绑定**。它们实质上是 ES6 之前的
`self = this`代码的语法替代品。
