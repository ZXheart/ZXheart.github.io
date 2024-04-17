# :zzz:

## 语法

对象创建两种形式：声明（字面）形式，构造形式

字面形式：

```javascript
var obj = {
  key: 'value',
}
```

构造形式：

```javascript
var obj = new Object()
obj.key = 'value'
```

构造形式和字面形式的结果是完全相同的对象。唯一真正的区别在于你可以向字面声明一次性添加一个或多个键/值对，而构造形式，必须一个一个的添加属性。

使用构造形式创建对象是极其少见的。

## 类型

对象是大多数 JS 程序以来的基本构建块。它们是 JS 八种主要类型（语言规范中成为“语言类型”）中的一种：

- string
- number
- boolean
- null
- undefined
- object

以及 ES6 中新增的两种类型：

- symbol
- bigint

:::tip
_简单基本类型_（`string`、`number`、`boolean`、`null`和`undefined`）自身不是`object`。`null`有时会被当成一个对象类型，但是这种误解
源于一个语言中的 Bug，它使得`typeof null`错误的返回字符串`object`。实际上，`null`是他自己的基本类型

**一个常见的错误论断是“JavaScript 中的一切都是对象”。这明显是不对的。**
:::

对比来看，存在几种特殊的对象子类型，可以称之为*复杂基本类型*（说的是包装类？）

`function`是对象的一种子类型（技术上讲，叫做“可调用对象”）。函数在 JS 中被称为“头灯（first class）”类型，是因为他们基本上就是普通的对象（
附带有可调用的行为语义），而且它们可以像其它普通的对象那样被处理。

`array`也是对象的一种子类型，带有特别的行为。数组在内容的组织上要稍稍比一般的对象更加结构化。

### 内建对象

有几种其他的对象子类型，通常称为内建对象。对于其中的一些来说，它们的名字看起来暗示着它们和它们对应的基本类型有着直接的联系，但事实上，它们
的关系更复杂一些。

- String
- Number
- Boolean
- Object
- Function
- Array
- Date
- RegExp
- Error
- ...

在 JS 中，这些内建对象仅仅是内建的函数。这些内建函数的每一个都可以作为用作构造器（使用`new`来调用的函数），其结果是一个新*构建*的相对应子类型
的对象。例如：

```javascript
var strPrimitive = 'I am a string'
typeof strPrimitive // 'string'
strPrimitive instanceof String // false

var strObject = new String('I am a string')
typeof strObject // 'object'
strObject instanceof String // true

Object.prototype.toString.call(strObject) // [object String]
```

通过`toString()`方法来考察内部子类型，`strObject`实际上是一个由`String`构造器创建的对象。

基本类型值`I am a string`不是一个对象，他是一个不可变的基本字面值。为了对它进行操作，比如检查长度、访问各个独立字符串内容等等，都需要一个`
String`对象。

幸运的是，在必要的时候语言会自动地将`string`基本类型强制转换为`String`对象类型，这意味着你几乎从不需要明确的创建对象。JS 社区的绝大部分人
都**强烈推荐**尽可能地使用字面形式的值，而非使用构造的对象形式。

```javascript
var strPrimitive = 'I am a string'

console.log(strPrimitive.length) // 13

console.log(strPrimitive.charAt(3)) // 'm'
```

这两个例子中，在字符串的基本类型上调用属性和方法，引擎会自动地将它强制转换为`String`对象，所以这些属性/方法的访问可以工作。

当使用如`42.358.toFixed(2)`这样的方法时，同样的强制转换也会发生在数字基本字面量`42`和包装对象`new Number(42)`之间。同样的还有`Boolean`
对象和`boolean`基本类型之间。

`null`和`undefined`没有对象包装的形式，仅有它们的基本类型值。相比之下，`Date`的值*仅可以*由它们的*构造形式*创建，因为它们没有对应的
字面形式。

无论使用字面还是构造形式，`Object`、`Array`、`Function`和`RegExp`都是对象。在某些情况下，构造形式确实会比对应的字面形式提供更多的创建选项。
因为对象可以被任意一种方式创建，更简单的字面形式几乎是所有人的首选。**仅仅在你需要使用额外的选项时使用构造形式（我 TM 的，不知道额外的选项）**

`Error`对象很少在代码中明示地被创建，它们通常在抛出异常时自动地被创建。他们可以由`new Error()`构造形式创建，但通常是不必要的

## 内容

对象的内容由存储在特定命名的*位置*上的值组成，我们称这些值为属性。

注意： 当我们说“内容”时，似乎暗示着这些值*实际上*存储在对象内部，但那只不过是表象对面。引擎会根据自己的实现来存储这些值，而且通常不是把它们
存储在容器对象*内部*。在容器内存储的是这些属性的名称，它们像指针（技术上讲，叫*引用（reference）*）一样指向值存储的地方。

```javascript
var myObj = { a: 2 }

myObj.a // 2
myObj['a'] // 2
```

为了访问`myObj`在*位置`a`*的值，我们需要使用`.`或`[ ]`操作符。`.`语法通常被称为*属性（property）访问*，`['..']`语法通常被称
为*键（key）访问*。在现实中，它们俩都会访问相同的*位置*，而且会拿出相同的值，所以这些属于可以互相使用。*属性访问*更加常见。

两种语法的主要区别在于`.`操作符后面需要一个`标识符（Identifier）`兼容的属性名，而`[' ']`语法基本可以接受任何兼容 UTF-8/Unicode 的字符串
作为属性名。举个例子，一个名为“SUper-Fun!”的属性，你不得不使用`['Super-Fun!']`语法来访问，因为`Super-Fun!`不是一个合法的`Identifier`

而且，由于`[' ']`语法使用字符串的**值**来指定位置，这意味着程序可以动态的创建字符串的值：

```javascript
var wantA = true
var myObj = { a: 2 }

var idx
if (wantA) {
  idx = 'a'
}

console.log(myObj[idx]) // 2
```

在对象中，属性名**总是**字符串。如果你使用了`string`以外的（基本）类型值，它会首先被转换为字符串。这甚至包括数组中常用于索引的数字，所以要
小心不要将对象和数组使用的数字搞混了。

```javascript
var myObj = {}

myObj[true] = 'foo'
myObj[3] = 'bar'
myObj[myObj] = 'baz'

console.log(myObj['true']) // 'foo'
console.log(myObj['3']) // 'bar'
console.log(myObj['[object Object]']) // 'baz'
```

### 计算型属性名

如果你需要将一个计算表达式*作为*一个键名，那么*键访问*语法非常有用，比如`myObj[prefix + name]`。

ES6 加入了*计算属性名*，在一个字面对象声明的键名称位置，你可以指定一个表达式，用`[ ]`括起来：

```javascript
var prefix = 'foo'
var myObj = {
  [prefix + '_bar']: 'hello',
  [prefix + '_baz']: 'world',
}
console.log(myObj['foo_bar']) // hello
console.log(myObj['foo_baz']) // world
```
