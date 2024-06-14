# :zzz:

[《你不知道的 JavaScript》](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20%26%20object%20prototypes/ch1.md)

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

::: warning

一个负责任的开发者*应当*在这里提出一个问题：“如果我递增的`count`属性不是我以为的那个，那是哪个`count`被我递增了？”。实际
上，如果他再挖的深一点，他会发现自己不小心创建了一个全局变量`count`，而且它当前的值是`NaN`。当然，一旦他发现这个不寻常的
结果后，他会有一堆其他的问题：“它怎么是全局的？为什么它是`NaN`而不是某个正确的计数值？”

:::

与停在这里深究为什么`this`引用看起来不是如我们*期待*的那样工作，并且回答那些尖锐且重要的问题相反，许多开发者简单地完全回
避这个问题，转向一些其他的另类解决办法，比如创建另一个对象来持有`count`属性：

```javascript

```
