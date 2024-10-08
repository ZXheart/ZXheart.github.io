# :zzz:

[《你不知道的 JavaScript》](https://github.com/ZXheart/You-Dont-Know-JS/blob/1ed-zh-CN/this%20%26%20object%20prototypes/apA.md)

# `this`是什么？

JS 中最令人困惑的机制之一就是`this`关键字。它是一个在每个函数作用域中自动定义的特殊标识符关键字，但即便是一些老练的 JS
开发者也对它到底指向什么感到困扰。

> 任何足够*先进*的技术都跟魔法没有区别。 -- Arthur C. Clarke

JS 的`this`机制实际上没有*那么*先进，但是开发者们总是在大脑中插入“复杂”和“混乱”来解释这句话，毫无疑问，如果没有清晰的理
解，在*你的*困惑中`this`可能看起来就是彻头彻尾的魔法。

## 为什么要用 this

如果对于那些老练的 JS 开发者来说`this`机制都是如此的令人费解，那么有人会问为什么这种机制会有用？它带来的麻烦不是比好处多
吗？在讲解*如何*有用之前，我们应当先来看看*为什么*有用。

让我们试着展示一下`this`的动机何用途：

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

如果这个代码段*如何*工作让你困惑，不用担心！我们很快就会讲解它。只是简要地将这些问题放在旁边，以便于我们可以更清晰的探
究*为什么*。

这个代码片段`identity()`和`speak()`函数对多个*环境*对象(`me`和`you`)进行复用，而不是针对每个对象定义函数的分离版本。

与使用`this`的方式相比，可以明确的将环境对象传递给`identity()`和`speak()`。

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

然而，`this`机制提供了更加优雅的方式来隐含的“传递”一个对象引用，带来更加干净的 API 设计和更容易的复用。

你的设计模式越复杂，你就会越清晰地看到：将执行环境作为一个明确参数传递，通常比传递`this`执行环境要乱。当我们探索对象和原
型时，你将会看到一组可以自动引用恰当执行环境对象的函数是多么有用。

## 困惑

我们还快就要开始讲解`this`是如何*实际*工作的，但我们首先要摒弃一些误解 —— 它实际上*不是*如何工作的。

在开发者们用太过于字面的方式考虑“this”这个名字时就会产生困惑。这通常会产生两种臆想，但都是不对的。

### 它自己

第一种常见的倾向是认为`this`指向函数自己。至少，这是一种语法上的合理推测。

为什么你想要在函数内部引用它自己？最常见的理由是递归（在函数内部调用它自己）这样的情形，或者是一个在第一次被调用时会解除
自己绑定的事件处理器。

初次接触 JS 机制的开发者们通常认为，将函数作为一个对象（JS 中所有的函数都是对象！），可以让你在方法调用之间储存*状态*（
属性中的值）。这当然是可能的，而且有一些有限的用处，但这本书的其余部分将会阐述许多其他的模式，提供比函数对象*更好*的地方
来存储状态。

过一会我们将探索一个模式，来展示`this`是如何不让一个函数像我们可能假设的那样，得到它自身的引用的。

考虑下面的代码，我们试图追踪函数`foo`被调用了多少次：

```javascript
function foo(num) {
  console.log('foo: ' + num)
  this.count++
}
foo.count = 0
var i = 0
for (; i < 10; i++) {
  if (i > 5) {
    foo(i)
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9
console.log(foo.count) // 0 -- WTF?
console.log(count) // NaN -- 在window上，undefined + number = NaN
```

`foo.count`*依然*是`0`，即便四个`console.log`语句明明告诉我们`foo(..)`实际上被调用了四次。这种挫败来源于对于`this`（
在`this.count++`中）的函数进行了*过于字面化*的解释。

当代码执行`foo.count = 0`时，它确实向函数对象`foo`添加了一个`count`属性。但是对于函数内部的`this.count`引用，`this`其
实*根本就不*指向那个函数对象，即便属性名称一样，但根对象也不同，因而产生了混淆。

> [!NOTE]
> 一个负责任的开发者*应当*在这里提出一个问题：“如果我递增的`count`属性不是我以为的那个，那是哪个`count`被我递增了？”。实际
> 上，如果他再挖的深一点，他会发现自己不小心创建了一个全局变量`count`，而且它当前的值是`NaN`。当然，一旦他发现这个不寻常的
> 结果后，他会有一堆其他的问题：“它怎么是全局的？为什么它是`NaN`而不是某个正确的计数值？”

与停在这里深究为什么`this`引用看起来不是如我们*期待*的那样工作，并且回答那些尖锐且重要的问题相反，许多开发者简单地完全回
避这个问题，转向一些其他的另类解决办法，比如创建另一个对象来持有`count`属性：

```javascript
function foo(num) {
  console.log('foo: ' + num)
  data.count++
}
var data = {
  count: 0,
}
var i = 0
for (; i < 10; i++) {
  if (i > 5) {
    foo(i)
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9
console.log(data.count) // 4
```

虽然这种方式“解决”了问题是事实，但不幸的是它简单地忽略了真正的问题 —— 缺乏对于`this`的含义和其工作方式上的理解 —— 反而退回到
了一个他更加熟悉的机制的舒适区：词法作用域。

> [!NOTE]
> 词法作用域是一个完善且有用的机制；我不是在用任何方式贬低它的作用。但在如何使用`this`这个问题上总是靠*猜*，而且通常都
> 猜*错*，并不是一个退回到词法作用域，而且从不学习*为什么*`this`不跟你合作的好理由。

为了从函数对象内部引用它自己，一般来说通过`this`是不够的。你通常需要通过一个指向它的词法标识符（变量）得到函数对象的引用
。 考虑这两个函数：

```javascript
function foo() {
  foo.count = 4 // `foo` 引用它自己
}
setTimeout(function () {
  // 匿名（没有名字的）函数不能引用它自己
}, 10)
```

第一个函数，称为“命名函数”，`foo`是一个引用，可以用于在它内部引用自己。

但是在第二个例子中，传递给`setTimeout(..)`的回调函数没有名称标识符（所以被称为“匿名函数”），所以没有合适的办法引用函数对
象自己。

> [!NOTE]
> 在函数中有一个老牌儿但是现在被废弃的，而且令人皱眉头的`arguments.callee`引用*也*指向当前正在执行的函数的函数对象。这个引
> 用通常是匿名函数在自己内部访问函数对象的唯一方法。然而，最佳的办法是完全避免使用匿名函数，至少是对于那些需要自引用的函数
> ，而使用命名函数（表达式）。`arguments.callee`已经被废弃而且不应该再使用。

对于当前我们的例子来说，另一个*好用的*解决方案是在每一个地方都使用`foo`标识符作为函数对象的引用，而根本不用`this`：

```javascript
function foo() {
  console.log('foo: ' + foo.count)
  foo.count++
}
foo.count = 0
var i = 0
for (; i < 10; i++) {
  if (i > 5) {
    foo(i)
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9
console.log(foo.count) // 4
```

然而，这种方法也类似地回避了对`this`的*真正*理解，而且完全依靠变量`foo`的词法作用域。

另一种解决了这个问题的方法是强迫`this`指向`foo`函数对象。

```javascript
function foo() {
  console.log('foo: ' + this.count)
  this.count++
}
foo.count = 0
var i = 0
for (; i < 10; i++) {
  if (i > 5) {
    foo.call(foo, i)
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9
console.log(foo.count) // 4
```

**与回避`this`相反，我们接受它**。我们马上将会更完整地讲解这样的技术*如何*工作，所以如果你依然有点儿糊涂，不要担心！

### 它的作用域

对`this`的含义第二常见的误解，是它不知怎的指向了函数的作用域。这是一个刁钻的问题，因为在某一种意义上它有正确的部分，而在
另外一种意义上，它是严重的误导。

明确地说，`this`不会以任何方式指向函数的**词法作用域**。作用域好像是一个将所有可用标识符作为属性的对象，这从内部来说是对
的。但是 JS 代码不能访问作用域“对象”。它是*引擎*的内部实现。

考虑下面代码，它（失败的）企图跨越这个边界，用`this`来隐含地引用函数的词法作用域：

```javascript
function foo() {
  var a = 2
  this.bar()
}
function bar() {
  console.log(this.a)
}
foo() // undefined
```

这个代码段里不只有一个错误。虽然它看起来是在故意瞎搞，但你看到的这段代码，提取自在公共社区的帮助论坛中被交换的真实代码。
真是难以想象对`this`的臆想是那么的误导人。

首先，试图通过`this.bar()`来引用`bar()`函数。它几乎可以说是*碰巧*能够工作，我们过一会儿再解释它是*如何*工作的。调
用`bar()`最自然的方式是省略开头的`this`，而仅使用标识符进行词法引用。

然而，写下这段代码的开发者试图用`this`在`foo()`和`bar()`的词法作用域间建立一座桥，使得`bar()`可以访问`foo()`内部作用域的
变量`a`。**这样的桥是不可能的**。你不能使用`this`引用在词法作用域中查找到东西。这是不可能的。

每当你感觉自己正在试图使用`this`来进行词法作用域的查询时，提醒你自己：_这里没有桥_。

## 什么是`this`?

我们已经列举了各种不正确的臆想，现在让我们把注意力转移到`this`机制是如何真正工作的。

我们早先说过，`this`不是编写时绑定，而是运行时绑定。它依赖于函数调用的上下文条件。`this`绑定与函数声明的位置没有任何关系
，而与函数被调用的方式紧密相连。

当一个函被调用时，会建立一个称为执行环境的活动记录。这个记录包含函数是从何处（调用栈 —— call-stack）被调用的，函数是*如
何*被调用的，被传递了什么参数等信息。这个记录的属性之一，就是在函数执行期间将被使用的`this`引用。

下一章中，我们将会学习寻找函数的 **调用点（call-site）** 来判断它的执行如何绑定`this`。

## 复习

对于那些没有花时间学习`this`绑定机制如何工作的 JS 开发者来说，`this`绑定一直是困扰的根源。对于`this`这么重要的机制来说，
猜测、试错、或者盲目地从 Stack Overflow 的回答中复制粘贴，都不是有效或正确利用它的方法。

为了学习`this`，你必须首先学习`this`*不是*什么，不论是哪种把你误导至何处的臆测或误解。`this`既不是函数自身的引用，也不是
函数*词法*作用域的引用。

`this`实际上是在函数被调用时建立的一个绑定，它指向*什么*是完全由函数被调用的调用点来决定的。
