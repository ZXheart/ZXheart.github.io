# :zzz:

[《你不知道的 JavaScript》](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20%26%20object%20prototypes/ch2.md)

# `this`豁然开朗！

在第一章中，我们摒弃了种种对`this`的误解，并且知道了`this`是一个完全根据*调用点*（函数是如何被调用的）而为每次函数调用建
立的绑定。

## 调用点（call-site）

为了理解`this`绑定，我们不得不理解调用点：函数在代码中被调用的位置（_不是被声明的位置_）。我们必须考察调用点来回答这个问
题：这个`this`指向什么？

一般来说寻找调用点就是：“找到一个函数是在哪里被调用的”，但它不总是那么简单，比如某些特定的编码模式会使*真正的*调用点变得
不那么明确。

考虑**调用栈（call-stack）**（使我们到达当前执行位置而被调用的所有方法的堆栈）是十分重要的。我们关心的调用点就位于当前执
行中的函数*之前*调用。

我们来展示一下调用栈和调用点：

```javascript
function baz() {
  // 调用栈是 `baz`
  // 调用点是 global scope（全局作用域）
  console.log('baz')
  bar() // <-- `bar` 的调用点
}
function bar() {
  // 调用栈是 `baz` -> `bar`
  // 调用点是 `baz`
  console.log('bar')
  foo() // <-- `foo` 的调用点
}
function foo() {
  // 调用栈是 `baz` -> `bar` -> `foo`
  // 调用点是 `bar`
  console.log('foo')
}
baz() // <-- `baz` 的调用点
```

在分析代码来寻找（从调用栈中）真正的调用点时要小心，因为它是影响`this`的唯一因素。

> [!NOTE]
> 你可以通过顺序观察函数的调用链在你的大脑中建立调用栈的视图，就像我们在上面代码段中注释那样。但是这很痛苦而且易错。另一种观察调用栈的方式是使
> 用你的浏览器的调试工具。大多数现代的桌面浏览器都内建开发者工具，其中就包含 JS 调试器。在上面的代码段中，你可以在调试工具中为`foo()`函数的第
> 一行设置一个断点，或者简单的在这第一行上插入一个`debugger`语句。当你运行这个网页时，调试工具将会停止在这个位置，并且向你展示一个到达这一行
> 之前所有被调用过的函数的列表，这就是你的调用栈。所以，如果你想调查`this`绑定，可以使用开发者工具取得调用栈，之后从上向下找到第二个记录，那就是你真正的调用点。

## 仅仅是规则

现在我们将注意力转移到调用点*如何*决定在函数执行期间`this`指向哪里。

你必须考察调用点并判定 4 中规则中的哪一种适用。我们将首先独立地解释一下这 4 种规则中的每一种，之后我们来展示一下如果有多
种规则可以适用于调用点时，它们的优先顺序。

### 默认绑定(Default Binding)

我们要考察的第一种规则源于函数调用的最常见的情况：独立函数调用。可以认为这种`this`规则是在没有其他规则适用时的默认规则。

```javascript
function foo() {
  console.log(this.a)
}
var a = 2
foo() // 2
```

第一点要注意的，如果你还没有察觉到，是在全局作用域中的变量声明，也就是`var a = 2`，是全局对象的同名属性的同义词。它们不
是相互拷贝对方，它们*就是*彼此。正如一个硬币的两面。

第二，我们看到当`foo()`被调用时，`this.a`解析为我们的全局变量`a`。为什么？因为这种情况下，对此方法调用的`this`实施了*默
认绑定*，所以使`this`指向了全局对象。

我们怎么知道这里适用*默认绑定*？我们考察调用点来看看`foo()`是如何被调用的。在我们的代码中，`foo()`是被一个直白的，毫无修
饰的函数引用调用的。没有其他的我们将要展示的规则适用于这里，所以*默认绑定*在这里适用。

如果`strict mode`在这里生效，那么对于*默认绑定*来说全局对象是不合法的，所以`this`将被设置为`undefined`。

```javascript
function foo() {
  'use strict'
  console.log(this.a)
}
var a = 2
foo() // TypeError: `this` is `undefined`
```

一个微妙但是重要的细节：即便所有的`this`绑定规则都是完全基于调用点的，但如果`foo()`的内容没有在`strict mode`下执行，对
于*默认绑定*来说全局对象是唯一合法的；`foo()`的调用点的`strict mode`状态与此无关。

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

> [!NOTE]
> 在你的代码中故意混用`strict mode`和非`strict mode`通常是让人皱眉头的。你的程序整体可能应当不是`strict mode`就是
> 非`strict mode`。然而，有时你可能会引用与你的`strict mode`不同的第三方包，所以对这些微妙的兼容性细节要多加小心。

### 隐式绑定(Implicit Binding)

另一种要考虑的规则是：调用点是否有一个环境对象（context object）也称为拥有者（owning）或容器（containing）对象，虽然这些
名词可能有些误导人。

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

首先，注意`foo()`被声明然后作为引用属性添加到`obj`上的方式。无论`foo()`是否一开始就在`obj`上被声明，还是后来作为引用添加
（如上面代码所示），这个**函数**都不被`obj`所真正“拥有”或“包含”。

然而，调用点*使用*`obj`环境来**引用**函数，所以你*可以说*`obj`对象在函数被调用的时间点上“拥有”或“包含”这个**函数引用**。

不论你怎样称呼这个模式，在`foo()`被调用的位置上，它被冠以一个指向`obj`的对象引用。当一个方法引用存在一个环境对象时，*隐
式绑定*规则会说：是这个对象应当被用于这个函数调用的`this`绑定。

因为`obj`是`foo()`调用的`this`，所以`this.a`就是`obj.a`的同义词。

只有对象属性引用链的最后一层是影响调用点的。比如：

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

#### 隐式丢失(Implicitly Lost)

`this`绑定最常让人沮丧的事情之一，就是当一个*隐式绑定*丢失了它的绑定，这通常意味着它会退回到*默认绑定*，根
据`strict mode`的状态，其结果不是全局对象就是`undefined`。

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

尽管`bar`似乎是`obj.foo`的引用，但实际上它只是另一个`foo`本身的引用而已。另外，起作用的调用点是`bar()`，一个直白，毫无修
饰的调用，因此*默认绑定*适用于这里。

这种情况发生的更加微妙，更常见，而且更意外的方式，是当我们考虑传递一个回调函数时：

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

参数传递仅仅是一种隐含的赋值，而且因为我们在传递一个函数，它是一个隐含的引用赋值，所以最终结果和我们前一个代码段一样。

那么如果接受你所传递回调的函数不是你的，而是语言内建的呢？没有区别，同样的结果。

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

把这个粗糙的，理论上的`setTimeout()`假想实现当作 JS 环境内建的实现的话：

```javascript
function setTimeout(fn, delay) {
  // 等待 delay 毫秒
  fn() // <-- 调用点！
}
```

正如我们刚刚看到的，我们的回调函数丢掉它们的`this`绑定是十分常见的事情。但是`this`使我们吃惊的另一种方式是，接收我们回调
的函数故意改变调用的`this`。那些很流行的 JS 库中的事件处理器就十分喜欢强制你的回调的`this`指向触发事件的 DOM 元素。虽然
有时这很有用，但其他时候这简直能气死人。不幸的是，这些工具很少给你选择。

不管哪一种意外改变`this`的方式，你都不能真正地控制你的回调函数引用将如何被执行，所以你（还）没有办法控制调用点给你一个故
意的绑定。我们很快就会看到一个方法，通过*固定*`this`来解决这个问题。

### 显式绑定(Explicit Binding)

用我们刚看到的*隐式绑定*，我们不得不改变目标对象使它自身包含一个对函数的引用，而后使用这个函数引用属性来间接（隐含）地
将`this`绑定到这个对象上。

但是，如果你想要强制一个函数调用使用某个特定对象作为`this`绑定，而不在这个对象上放置一个函数引用属性呢？

JS 语言中的“所有”函数都有一些工具（通过它们的`[[Prototype]]`）可以用于这个任务。具体地说，函数有拥
有`call(...)`和`apply(...)`方法。从技术上讲，JS 宿主环境有时会提供一些（说得好听点！）很特别的函数，它们没有这些功能。但
这很少见。绝大多数被提供的函数，当然还有你将创建的所有的函数，都可以访问`call(..)`和`apply(..)`。

这些工具如何工作？它们接收的第一个参数都是一个用于`this`的对象，之后使用这个指定的`this`来调用函数。因为你已经直接指明你
想让`this`是什么，所以我们称这种方式为*显式绑定*（explicit binding）。

```javascript
function foo() {
  console.log(this.a)
}
var obj = {
  a: 2,
}
foo.call(obj) // 2
```

通过`foo.call(..)`使用*明确绑定*来调用`foo`，允许我们强制函数的`this`指向`obj`.

如果你传递一个简单基础类型值（`string`，`boolean`，或`number`类型）作为`this`绑定，那么这个基本类型值会被包装在它的对象
类型中（分别是`new String(..)`，`new Boolean(..)`，或`new Number(..)`）。这通常称为“封箱（boxing）”。

> [!NOTE]
> 就`this`绑定的角度讲，`call(..)`和`apply(..)`是完全一样的。它们确实在处理其他参数上的方式不同，但那不是我们当前关心的。

不幸的是，单独依靠*显式绑定*仍然不能为我们先前提到的问题提供解决方案，也就是函数“丢失”自己原本的`this`绑定，或者被第三方
框架覆盖，等等问题。

#### 硬绑定（Hard Binding）

但是有一个*明确绑定*的变种确实可以实现这个技巧。考虑这段代码：

```javascript
function foo() {
  console.log(this.a)
}
var obj = {
  a: 2,
}
var bar = function () {
  foo.call(obj)
}
bar() // 2
setTimeout(bar, 100) // 2

// bar 将 foo 的 this 绑定到 obj 上
// 所以它不可以被覆盖
bar.call(window) // 2
```

我们来看看这个变种如何工作的。我们创建了一个函数`bar()`,在它的内部手动调用`foo.call(obj)`，由此强制`this`绑定到`obj`并调
用`foo`。无论你过后怎样调用函数`bar`，它总是手动使用`obj`调用`foo`。这种绑定明确又坚定，所以我们称之为*硬绑定（hard
binding）*。

用*硬绑定*将一个函数包装起来的最典型的方法，是为所有传入的参数和传出的返回值创建一个通道：

```javascript
function foo(args) {
  console.log(this.a, args)
  return this.a + args
}
var obj = {
  a: 2,
}
var bar = function () {
  return foo.apply(obj, arguments)
}
var b = bar(3) // 2 3
console.log(b) // 5
```

另一种表达这种模式的方法是创建一个可复用的帮助函数：

```javascript
function foo(args) {
  console.log(this.a, args)
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
var b = bar(3) // 2 3
console.log(bar(3)) // 5
```

由于*硬绑定*是一个如此常用的模式，它已作为 ES5 的内建工具提供：`Function.prototype.bind`，像这样使用:

```javascript
function foo(args) {
  console.log(this.a, args)
  return this.a + args
}
var obj = {
  a: 2,
}
var bar = foo.bind(obj)
var b = bar(3) // 2 3
console.log(res) // 5
```

`bind()`返回一个硬编码的新函数，它使用你指定的`this`环境来调用原本的函数。

> [!NOTE]
> 在 ES6 中，`bind()`生成的*硬绑定*函数有一个名为`.name`的属性，它源于原始的*目标函数（target function）*。举例来说：
> `var bar = foo.bind(obj)`应该会有一个`bar.name`属性，它的值为`“bound foo”`，这个值应当会显示在调用栈轨迹的函数调用名称中。

#### API 调用的“环境”

确实，许多库中的函数，和许多在 JS 语言以及宿主环境中的内建函数，都提供一个可选参数，通常称为“环境（context）”，这种设计
作为一种替代方案来确保你的回调函数使用特定的`this`而不必非得使用`bind(..)`。

举例来说：

```javascript
function foo(item) {
  console.log(item, this.id)
}
const obj = {
  id: 'awesome',
}
const arr = [1, 2, 3]
// forEach()语法: arr.forEach(callback[, thisArg])
arr.forEach(foo, obj) // 1 awesome 2 awesome 3 awesome
```

从内部来说，几乎可以确定这种类型的函数是通过 `call(..)`或`apply(..)`来使用*明确绑定*以节省你的麻烦。

### `new`绑定(`New` Binding)

第四种也是最后一种`this`绑定规则，要求我们重新思考 JS 中关于函数和对象的常见误解。

在传统的面向类语言中，“构造器”是附着在类上的一种特殊方法，当使用`new`操作符来初始化一个类时，这个类的构造器就会被调用。
通常看起来像这样：

```javascript
something = new MyClass(..)
```

JS 拥有`new`操作符，而且使用它的代码模式看起来和我们在面向类语言中看到的基本一样；大多数开发者猜测 JS 机制在做某种相似的
事情。但是，实际上 JS 的机制和`new`在 JS 中的用法所暗示的面向类的功能*没有任何联系*。

首先，让我们重新定义 JS 的“构造器”是什么。在 JS 中，构造器**仅仅是一个函数**，它们偶然的与前置的`new`操作符一起调用。它
们不依附于类，它们也不初始化一个类。它们甚至不是一种特殊的函数类型。它们本质上只是一般的函数，在被使用`new`来调用时改变
了行为。

例如，引用 ES5.1 的语言规范，`Number(..)`函数作为一个构造器来说：

> 15.7.2 Number 构造器

> 当`Number`作为 new 表达式的一部分被调用时，它是一个构造器：它初始化这个新创建的对象。

所以，可以说任何函数，包括像`Number(..)`这样的内建对象函数都可以在前边加上`new`来被调用，这使函数调用成为一个*构造器调用
（constructor call）*。这是一个重要而微妙的区别：实际上不存在“构造器函数”这样的东西，而只有函数的构造器调用。

当在函数前面被加入`new`调用时，也就是构造器调用时，下面这些事情会自动完成：

1. 一个全新的对象会凭空创建。

2. 这个新创建的对象会被接入原型链（`{}.[[Prototype]] = constructor.prototype`）。

3. 新创建的对象会被设置为函数调用的 this 绑定。

4. 除非函数返回一个它自己的其他**对象**，否则这个被`new`调用的函数将*自动*返回这个新创建的对象。

步骤 1、3 和 4 是我们当下要讨论的。我们现在跳过第 2 步，在第五章回过头来讨论。

```javascript
function foo(a) {
  this.a = a
}
const bar = new foo(2)
console.log(bar.a) // 2
```

通过在前面使用`new`来调用`foo(..)`，我们构建一个新的对象并把这个新对象作为`foo(..)`调用的`this`。`new`**是函数调用可以绑
定`this`的最后一种方式**，我们称之为*new 绑定（new binding）*

## 一切皆有顺序

如此，我们已经揭示了函数调用中的四种`this`绑定规则。你需要做的*一切*就是找到调用点然后考察哪一种规则适用于它。但是，如果
调用点上有多种规则都适用呢？这些规则一定有一个优先顺序，，我们下面就展示这些规则以什么样的优先顺序实施。

很显然，*默认绑定*在四种规则中优先权最低。所以我们先把它放在一边。

*隐式绑定*和*显式绑定*哪一个更优先呢？我们来测试一下：

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
obj2.foo() // 2

obj1.foo.call(obj2) //2
obj2.foo.call(obj1) //1
```

所以，*显式绑定*的优先权要高于*隐式绑定*，这意味着你应当在考察*隐式绑定*之前**首先**考察*显式绑定*是否适用。

现在，我们只需要搞清楚*new 绑定*的优先级位于何处。

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

var bar = new obj1.foo(4) // new绑定 和 隐式绑定 同时存在
console.log(obj1.a) // 2
console.log(bar.a) // 4
```

好了，*new 绑定*的优先级要高于*隐式绑定*。那么你觉得*new 绑定*的优先级之于*显式绑定*是高还是低呢？

> [!NOTE] > `new`和`call`/`apply`不能同时使用，所以`new foo.call(obj1)`是不允许的，也就是不能直接对比测试 *new 绑定*和*显式绑定*。但
> 是我们依然可以使用 *硬绑定*来测试这两个规则的优先级。

在我们进入代码探索之前，回想一下*硬绑定*物理上是如何工作的，也就是`Function.prototype.bind(..)`创建一个新的包装函数，这
个函数被硬编码为忽略他自己的`this` 绑定（不管它是什么），转而手动使用我们提供的。

因此，这里看起来很明显，_硬绑定_（显式绑定的一种）的优先级要比 *new 绑定*高，而且不能被`new`覆盖。

我们检验一下：

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

哇！`bar`是*硬绑定*到`obj1`的，但是`new bar(3)`并**没有**像我们期待的那样将`obj1.a`变为`3`。反而，_硬绑定_（到`obj1`）
的`bar(..)`调用**_可以_**被`new`所覆盖。因为`new`被实施，我们得到一个名为`baz`的新创建的对象，而且我们确实看到`baz.a`的
值为`3`。

如果你回头看看我们的*山寨*绑定帮助函数，这很令人吃惊：

```javascript
function bind(fn, obj) {
  return function (...args) {
    return fn.apply(obj, args)
  }
}
```

我使用*山寨*的`bind()`函数执行了同样的代码，`new`操作符无法将绑定到 `obj1` 的*硬绑定*覆盖（书上无此步骤）

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
 * myBind()返回的匿名函数赋值给bar。bar函数通过new调用，那么bar函数执行时
 * 内部会创建一个空对象。如若bar()显式的返回了一个对象，那baz就等同于该返回对象，
 * 否则就是创建的空对象。这样baz的值就取决于 fn.apply(obj, args) 的返回值；
 * 而作为参数传入的foo函数没有返回值（默认undefined）。所以baz是一个空对象
 */
console.log(baz, baz.a) //{} undefined
```

如果你推导这段帮助代码如何工作，会发现对于`new`操作符调用来说没有办法去像我们观察到的那样，将绑定到`obj`的硬绑定覆盖。

但是 ES5 的内建`Function.prototype.bind(..)`更加精妙，实际上十分精妙。这个是 MDN 网页上为`bind(..)`提供的（稍稍格式化后
的）polyfill（低版本兼容填补工具）：

```javascript
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    //oThis是第一个参数，也就是绑定的对象
    if (typeof this !== 'function') {
      throw new TypeError('what is trying to be bound is not callable')
    }
    // arguments是包括oThis的类数组对象。这里将oThis去掉，并转为数组
    const aArgs = Array.prototype.slice.call(arguments, 1)

    // 保存一份被绑定函数（原函数）的引用；
    // 目的是为了保持原型链的完整性（就是返回的硬绑定函数如果是通过new调用，
    // new出的实例.__proto__应该指向this）
    const fToBind = this

    // 工具函数，用于链接bound函数和原函数的原型链
    const fNOP = function () {}

    // 返回的硬绑定函数
    const fBound = function () {
      return fToBind.apply(
        // 第一个参数：这里的this是fBound的调用者，

        // 如果是通过new调用，this就是new出的实例。最终apply绑定的就是new出的实例；
        //（-前边表现和预期不同的原因就是因为这句代码）

        // 如果是默认调用，this就是window。最终apply绑定的就是oThis
        // 如果是对象调用，this就是对象。最终apply绑定的就是oThis
        // 如果是显式调用，this就是指定的对象。最终apply绑定的就是oThis

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

我用 ES5 以后的语法重构了一下，原版对我来说太难懂了（书上无此步骤）

```javascript
Function.prototype.myBind = function (...outerArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('what is trying to be bound is not callable')
  }
  const aArgs = outArgs.slice(1)
  const fToBind = this
  const fBound = function (...innerArgs) {
    return fToBind.apply(this instanceof fBound && outArgs[0] ? this : outArgs[0], aArgs.concat(inArgs))
  }
  fBound.prototype = Object.create(this.prototype)
  return fBound
}
```

> [!NOTE]
> 就将与`new`一起使用的硬绑定函数（参照下面来看为什么这有用）而言，上面的`bind(..)`polyfill 与 ES5 中内建的`bind(..)`是不
> 同的。因为 polyfill 不能像内建工具那样，没有`.prototype`就能创建函数，这里使用了一些微妙而间接的方法来近似模拟相同的行为
> 。如果你打算将硬绑定函数和`new`一起使用而且依赖于这个 polyfill，应当多加小心。

允许`new`进行覆盖的部分是这里：

```javascript
this instanceof FNOP && oThis ? this : oThis
// ... 和：
fNOP.prototype = this.prototype
fBound.prototype = new fNOP()
```

我们不会实际深入解释这个花招儿是如何工作的（这很复杂而且超出了我们当前讨论的范围），但实质上这个工具判断硬绑定函数是否通
过`new`被调用（导致一个新构建的对象作为它的`this`），如果是，它就用那个新构建的`this`而非先前为`this`指定的*硬绑定*。

为什么`new`可以覆盖*硬绑定*这件事很有用

这个行为的主要原因是，创建一个实质（基本？）上忽略`this`的*硬绑定*而预先设置一部分或所有的参数的函数（这个函数可以
与`new`一起是用来构建对象）。 `bind(..)`的一个能力是，任何在第一个`this`绑定参数之后被传入的参数，默认地作为当前函数的标
准参数（技术上这成为“局部应用（partial application）”，是一种“柯里化（currying）”）。 —— **TMD 一个字也看不懂，原文在下**

::: details

The primary reason for this behavior is to create a function (that can be used with `new` for constructing objects) that
essentially ignores the `this` _hard binding_ but which presets some or all of the function's arguments. One of the
capabilities of `bind(..)` is that any arguments passed after the first `this` binding argument are defaulted as
standard arguments to the underlying function (technically called "partial application", which is a subset of
"currying").

:::

例如：

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

现在，我买可以按照优先顺序总结一下从函数调用的调用点来判断`this`的规则了。按照这个顺序来问问题，然后在第一个规则适合的地
方停下。

1. 函数是通过`new`调用的吗？如果是，`this`就是新创建的对象。
2. 函数是通过`call`或`apply`被调用，甚至是隐藏在`bind`硬绑定中吗？如果是，`this`就是那个被明确指定的对象。
3. 函数是通过环境对象被调用的吗？如果是，`this`就是那个环境对象。
4. 否则，使用默认绑定。如果在`strict mode`下，就是`undefined`，否则就是`globalThis`对象。

以上，就是理解对于普通的函数调用来说的`this`绑定规则*所需的全部*。是的...几乎是全部。

## 绑定特例

正如通常的那样，对于“规则”总有一些*例外*。

在某些场景下`this`绑定会让人很吃惊，比如在你试图实施一种绑定，然而最终得到的却是*默认绑定*规则的绑定行为。

### 被忽略的 this

如果你传入`null`或`undefined`作为`call`、`apply`或`bind`的`this`绑定参数，那么这些值会被忽略掉，取而代之的是*默认绑定*规
则将适用于这个调用。

```javascript
function foo() {
  console.log(this.a)
}
var a = 2
foo.call(null) // 2
```

为什么你会向`this`绑定故意传递像`null`这样的值？

一个常见的做法是，使用`apply(..)`来将一个数组散开，从而作为函数调用的参数。相似地，`bind(..)`可以柯里化参数（预设值），
也可能非常有用。

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

这两种工具都要求第一个参数是`this`绑定。如果目标函数不关心`this`，你就需要一个占位值，而且正如这个代码中展示的，`null`看
起来是一个合理的选择。

> [!NOTE]
> 虽然我们在这本书中没有涵盖，但是 ES6 中有一个展开运算符`...`，它让你无需使用`apply(..)`而在语法上将一个数组“展开”作为参
> 数，比如`foo(...[2, 3])`表示`foo(2, 3)` —— 如果`this`绑定没必要，可以在语法上回避它。不幸的是，柯里化在 ES6 中没有语法上的
> 替代品，所以`bind(..)`调用的`this`参数依然需要注意。

可是，在你不关心`this`绑定而一直使用`null`的时候，有些潜在“危险”。如果你这样处理一些函数调用（比如，不归你管控的第三方包），
而且那些函数确实使用了`this`引用，那么*默认绑定*规则意味着它可能会不经意间引用（或者改变，更糟糕！）`globalThis`对象。

#### 更安全的 this

也许某些“更安全”的做法是：为了`this`传递一个特殊创建好的对象，这个对象保证不会对程序产生副作用。从网络学（或军事）上借用
一个词，我们可以建立一个 “DMZ-demilitarized zone”（非军事区）对象 —— 一个完全为空，没有委托的对象。

如果我们为了忽略自己认为不用关心的`this`绑定，而总是传递一个 DMZ 对象，那么我们就可以确定任何对`this`的隐藏或意外地使用
将会被限制在这个空对象中，也就是说这个对象将`globalThis`对象和副作用隔离开。

因为这个对象是完全为空的，我个人喜欢给它一个变量名为`ø`（空集合的数学符号的小写）。在许多键盘上（比如 Mac 的美式键盘），
这个符号可以很容易的使用`⌥`+`o`（options+`o`）打出来。一些系统还允许你为某个特殊符号设置快捷键。如果你不喜欢`ø`符号，或
者你的键盘没那么好打，你当然可以叫它任意你希望的名字。

无论你叫它什么，创建**完全为空的对象**的最简单的方法就是使用`Object.create(null)`。`Object.create(null)`和`{}`很像，但是
没有指向`Object.prototype`的委托链接，所以它比`{}`“空的更彻底”。

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

### 间接

另一个要注意的是，你可以（有意或无意地！）创建对函数的“间接引用（indirect reference）”，在那样的情况下，当那个函数被调用
时， *默认绑定规则*也会适用。

一个最常见的*间接引用*产生方式是通过赋值：

```javascript
function foo() {
  console.log(this.a)
}
var a = 2
var o = { a: 3, foo: foo }
var p = { a: 4 }
o.foo() // 3
;(p.foo = o.foo)() // 2

// 测试得：(p.foo = o.foo)的结果是foo函数本身的引用，为啥不知道，让子弹飞一会
console.log((p.foo = o.foo) === foo) // true
```

赋值表达式`p.foo = o.foo`的*结果值*是一个刚好指向底层函数对象的引用。因此，起作用的调用点是`foo()`，而
非`p.foo()`或`o.foo()`。

> [!NOTE]
> 无论你如何得到适用*默认绑定*的函数调用，被调用函数的**内容**的`strict mode`状态 —— 而非函数的调用点 —— 决定了`this`引用的值：
> 不是`globalThis`对象（在非`strict mode`下），就是`undefined`（在`strict mode`下）。

### 软绑定（Softening Binding）

我们之前看到*硬绑定*是一种通过函数强制绑定到特定的`this`上，来防止函数在不经意间退回到*默认绑定*的策略（除非你用`new`去
覆盖它！）。问题是，*硬绑定*极大地降低了函数的灵活性，阻止我们手动使用*隐式绑定*或*显式绑定*来覆盖`this`。

如果有这样的办法就好了：为*默认绑定*提供不同的默认值（不是`globalThis`或`undefined`），同时保持函数可以通过*隐式绑
定*或*显式绑定*技术来手动绑定`this`。

我们可以构建一个所谓的*软绑定*工具来模拟我们期望的行为。

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

这个`softBind(..)`工具工作方式和 ES5 内建的`bind(..)`工具很相似，除了*软绑定*行为。它用一种逻辑将指定的函数包装起来，这
个逻辑在函数调用时检查`this`, 如果它是`globalThis`或`undefined`，就使用指定的*默认值*(`obj`)，否则使用`this`不变。它也提
供了可选的柯里化行为。

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

### 词法`this`

我们刚刚涵盖了一般函数遵守的四种规则。但 ES6 引入了一种不适用于这些规则特殊的函数：箭头函数（arrow-function）。

箭头函数不是通过`function`关键字声明的，而是通过所谓的“大箭头”操作符：`=>`。与使用四种标准的`this`规则不同的是，箭头函数
从封闭它的（函数或全局）作用域采用`this`绑定。

我们展示一下箭头函数的词法作用域：

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

在`foo()`中创建的箭头函数在词法上捕获`foo()`被调用时的`this`，不管它是什么。因为`foo()`被`this`绑定到`obj1`，`bar`（被返
回的箭头函数的一个引用）也将被用`this`绑定到`obj1`。一个箭头函数的词法绑定是不能被覆盖的（就连`new`也不行！）。

常见用法是用于回调，比如时间处理器或计时器：

```javascript
function foo() {
  setTimeout(() => {
    // 这里的 this 是词法上从 foo()继承的
    console.log(this.a)
  }, 100)
}
var obj = { a: 2 }
foo.call(obj) // 2
```

虽然箭头函数提供了除使用`bind(..)`外，另一种在函数上确保`this`的方式，但重要的是要注意它们本质是使用广为人知的词法作用域
来禁止了传统的`this` 机制。在 ES6 之前，为此我们有了相当常用的模式，这些模式几乎和 ES6 的箭头函数的精神没有区别：

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

虽然对不想用`bind(..)`的人来说`self = this`和箭头函数看起来都是不错的“解决方案”，但他们实质上逃避了`this`而非理解和接受
它。

如果你发现你在写`this`风格的代码，但是大多或全部时候，你都用词法上的`self = this`或箭头函数“技巧”抵御`this`机制，那么也
许你应该：

1. 仅使用词法作用域并忘掉虚伪的`this`风格代码。
2. 完全接收`this`风格机制，包括在必要的时候使用`bind()`，并尝试避开`self = this`和箭头函数的“词法 this”技巧。

一个程序可以有效的同时利用两种风格的代码（词法和`this`），但在同一个函数内部，特别是对同种类型的查找，混合这两种机制通常
是自找很难维护的代码，而且可能聪明过了头。

使用`bind()`风格实现上边代码：（书上无此步骤）

```javascript
// 1、 头一次知道可以在函数体后边直接调用bind（作为参数的回调函数）
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

## 复习

为执行中的函数判定`this`绑定需要找到这个函数的直接调用点。找到之后，四种规则将会以这种优先顺序施用于调用点：

1. 通过`new`调用？使用新创建的对象。
2. 通过`call`或`apply`（或`bind`）调用？使用指定的对象。
3. 通过上下文对象调用？使用那个上下文对象。
4. 默认：在`strict mode`下是`undefined`，否则是`globalThis`。

小心偶然或不经意地*默认绑定*规则调用。如果你想“安全”的忽略`this`绑定，一个像`ø = Object.create(null)`这样的“DMZ”对象是一个
很好的占位置。以保护`globalThis`对象不受意外的副作用影响。

与四种绑定规则不同，ES6 的箭头函数使用词法作用域来决定`this`绑定，这意味着它们采用封闭它们的函数作为`this`绑定（无论它是
什么）。它们实质上是 ES6 之前的 `self = this`代码的语法替代品。
