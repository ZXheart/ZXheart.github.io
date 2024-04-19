# :zzz:

[《你不知道的 JavaScript》](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20%26%20object%20prototypes/ch3.md)

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

对象是大多数 JS 程序依赖的基本构建块。它们是 JS 八种主要类型（语言规范中成为“语言类型”）中的一种：

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

`function`是对象的一种子类型（技术上讲，叫做“可调用对象”）。函数在 JS 中被称为“头等（first class）”类型，是因为他们基本上就是普通的对象（
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

为了访问`myObj`在*位置*`a`的值，我们需要使用`.`或`[ ]`操作符。`.a`语法通常被称为“属性（property）访问”，`['a']`语法通常被称
为“键（key）访问”。在现实中，它们俩都会访问相同的*位置*，而且会拿出相同的值，所以这些术语可以互换使用。“属性访问”更加常见。

两种语法的主要区别在于`.`操作符后面需要一个`标识符（Identifier）`兼容的属性名，而`[' ']`语法基本可以接受任何兼容 UTF-8/Unicode 的字符串
作为属性名。举个例子，一个名为“Super-Fun!”的属性，你不得不使用`['Super-Fun!']`语法来访问，因为`Super-Fun!`不是一个合法的`Identifier`

而且，由于`[' ']`语法使用字符串的**值**来指定位置，这意味着程序可以动态的创建字符串的值：

```javascript
var myObj = { a: 2 }

var idx
if (true) {
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

*计算属性名*的最常见用法，可能用于 ES6 的`Symbol`，本书没有涵盖关于它的细节。简单说，它们是新的基本数据类型，拥有一个不透明不可知的值（技术
上讲是一个`string`值）。你将会被强烈地不鼓励使用一个`Symbol`的*实际值*（这个值理论上会因 JS 引擎的不同而不同），所以`Symbol`的名称，比如
`Symbol.Something`（瞎编的），才是你会使用的：

```javascript
const s = Symbol('description')
const obj = {}
obj[s] = 'bar'
console.log(obj[s]) // bar
```

### 属性（property）vs. 方法（method）

有些开发者喜欢在讨论对一个对象的属性访问时做一个区别，如果这个被访问的恰好是一个函数的话。这诱使人们认为函数*属于*这个对象，而且在其他语言中，
属于对象（也就是“类”）的函数被称为“方法”，所以相对于“属性访问”，我们常能听到“方法访问”。

有趣的是，**语言规范也做出了同样的区别**

从技术上讲，函数绝不会“属于”对象，所以，说一个偶然在对象的引用上被访问的函数就自动地成为了一个“方法”，看起来有些像是牵强附会。

有些函数内部确实拥有`this`引用，而且*有时*这些`this`引用指向调用点的对象引用。但这个用法确实没有使这个函数比其他函数更像“方法”，因为`this`
是在运行时在调用点动态绑定的，这使得它与这个对象的关系至多是间接的。

每次你访问一个对象的属性都是一个**属性访问**，无论你得到什么类型的值。如果你*恰好*从属性访问中得到一个函数，它也没有魔法般地在那时成为一个“
方法”。一个从属性访问得来的函数没有任何特殊性

```javascript
function foo() {
  console.log('foo')
}
var someFoo = foo // 对`foo`的变量引用

var myObj = {
  someFoo: foo,
}

console.log(foo) // function foo(){...}
console.log(someFoo) // function foo(){...}
console.log(myObj.someFoo) // function foo(){...}
```

`someFoo`和`myObj.someFoo`只不过是对用一个函数的两个分离的引用，它们中的任何一个都不意味着这个函数很特别或被其他对象所“拥有”。如果上边的
`foo()`定义里拥有一个`this`引用，那么`myObj.someFoo()`的*隐式绑定*将会是这两个引用间**唯一**可以观察到的不同。它们中的任何一个
都没有称为“方法”的道理。

**也许有人会争辩**，函数*变成了方法*，不是在定义期间，而是在调用的执行期间，根据它是如何在调用点被调用的（是否带有一个环境对象引用）。即便
是这种解读也有些牵强。

可能最安全的结论是，在 JS 中，“函数”和“方法”是可以互换使用的。

:::tip
ES6 加入了`super`引用，它通常和`class`一起使用。`super`的行为方式（静态绑定，而非像`this`一样延迟绑定），给了这种说法更多的权重：一个
被`super`绑定到某处的“函数”更像一个“方法”。但是同样地，这仅仅是微妙的语义上的（和机制上的）细微区别。

就算你声明一个函数表达式作为字面对象的一部分，那个函数都不会魔法般地*属于*这个对象——仍然仅仅是同一个函数对象的多个引用罢了。

```javascript
var myObj = {
  foo: function foo() {
    console.log('foo')
  },
}
var someFoo = myObj.foo
console.log(myObj.foo) // function foo(){...}
console.log(someFoo) // function foo(){...}
```

:::

### 数组

数组也是用`[ ]`访问方式，但正如上面提到的，在存储值的方式和位置上它们的组织更加结构化（虽然在存储值的*类型*上没有限制）。数组采用*数字索引*，
这意味着制备存储的位置，通常成为*下标*，是一个非负整数。

数组也是对象，所以虽然每个索引都是正整数，你还可以在数组上添加属性：

```javascript
var arr = [1, 2, 3]
arr.foo = 'foo'

console.log(arr.foo) // 'foo'
console.log(arr.length) // 3
```

添加命名属性（不论是使用`.`还是`[ ]`操作符语法）不会改变数组的`length`所报告的值。

你*可以*把一个数组当作普通的键/值对象使用，并且从不添加任何数字下标，但这不是一个好主意，因为数组对它本来的用途有着特定的行为和优化方式，普通
对象也一样。使用对象来存储键/值对，而是用数组在数字下标上存储值。

:::tip
如果你试图在一个数组上添加属性，但属性名*看起来*像一个数字，那么最终它会成为一个数字索引（也就是改变了数组的内容）：

```javascript
var arr = ['foo', 'bar']
arr['2'] = 'baz'
console.log(arr.length) // 3
arr[2] // 'baz'
```

:::

### 复制对象

```javascript
function fn() {}
var obj = {}
var arr = []
var anotherObj = {
  a: 2,
  b: obj, // 引用 不是拷贝
  c: arr, // 又一个引用
  d: fn, // 又一个引用
}
arr.push(obj, anotherObj)
```

一个`anotherObj`的*拷贝*究竟应该怎么表现？

首先，我们应该明确它是一个`浅（shallow）`还是一个`深（deep）`拷贝？

- 一个*浅拷贝*会得到一个新对象，它的`a`是值`2`的拷贝，但`b`、`c`、`d`属性仅仅是引用，它们指向被拷贝对象中引用的相同位置。
- 一个*深拷贝*将不仅复制`anotherObj`，还会复制`obj`和`arr`。但之后我们让`arr`拥有`obj`和`anotherObj`的引用，所以*那些*也应当被复制
  而不是仅保留引用。现在由于循环引用，我们得到了一个无限循环复制的问题。

我们应当检测循环引用并打破循环遍历吗（不管位于深处的，没有完全复制的元素）？我们应当报错退出码？或者介于两者之间？

另外，“复制”一个函数意味着什么，也不是很清楚。有一些技巧，比如提取一个函数源代码的`toString()`序列化表达（这个源代码会因为实现不同而不同，
而且根据被考察的函数的类型，其结果甚至在所有引擎上都不可靠）。

那么我们如何解决所有这些刁钻的问题？不同的 JS 框架都各自挑选自己的解释并且做出自己的选择。但是哪一种（如果有的话）才是 JS 应当作为标准采用呢？
长久以来，没有明确答案。

一个解决方案是，**JSON 安全的**对象（也就是，可以被序列化为一个 JSON 字符串，之后还可以被重新解析为拥有相同结构和值的对象）可以简单地这样*复制*：

```javascript
var newObj = JSON.parse(JSON.stringify(someObj))
```

当然，这要求你保证你的对象是 **JSON 安全的**。对于某些情况，这没什么大不了的。而对另一些情况这还不够。
:::tip
Github Copilot 告诉我：如果一个对象包含`函数`、`undefined`、`Symbol`或者`循环引用`，那么它就不是**JSON 安全的**。
就不能使用`JSON.stringify()`和`JSON.parse()`来复制这个对象。
:::

*浅拷贝*相当易懂，而且没有那么多问题，所以 ES6 为此任务定义了`Object.assign()`。接受*目标*对象作为第一个参数，然后是一个或多个*源*对象
作为后续参数。它会在*源*对象上迭代所有*可枚举（enumerable）*，_owned keys（直接拥有的键）_，并把它们拷贝到*目标*对象上（仅通过`=`复制）。
他还会很方便地放回*目标*对象：

```javascript
var newObj = Object.assign({}, anotherObj)
newObj.a // 2
newObj.b === obj // true
newObj.c === arr // true
newObj.d === fn // true
```

:::tip
`Object.assign()`中发生的复制是单纯的`=`式赋值，所以任何在元对象属性的特殊性质（比如`writeable`）在目标对象上**都不会保留**。
:::

### 属性描述符（property descriptors）

在 ES5 之前，JS 语言没有给出直接的方法，让你的代码可以考察或描述属性性质间的区别，比如属性是否为只读。

在 ES5 中，所有的属性都用**属性描述符（property descriptors）**来描述。

```javascript
var myObj = { a: 2 }
Object.getOwnPropertyDescriptor(myObj, 'a')
// {
//   configurable: true,
//   enumerable: true,
//   value: 2,
//   writable: true,
// }
```

普通对象属性`a`的属性描述符（称为“数据描述符”，因为它仅持有一个数据值）的内容要比`value`为`2`多得多。它还包含另外三个性质：`writable`、
`configurable`和`enumerable`。

当我们创建一个普通属性时，可以看到属性描述符的各种性质的默认值，同时我们可以用`Object.defineProperty(..)`来添加新属性，或使用期望的
性质来修改既存的属性（如果它是`configurable`的！）。

```javascript
var myObj = {}
Object.defineProperty(myObj, 'a', {
  value: 2,
  writable: true,
  configurable: true,
  enumerable: true,
})
console.log(myObj.a) // 2
```

使用`defineProperty()`，我们手动、明确的在`myObj`上添加了一个直白的，普通的`a`属性。然而，通常不会使用这种手动方法，除非你想把描述符
的某个性质修改为不同的值。

#### 可写性（writable）

`writable`控制这你改变属性值的能力：

```javascript
var myObj = {}
Object.defineProperty(myObj, 'a', {
  value: 2,
  writable: false,
  configurable: true,
  enumerable: true,
})
myObj.a = 3
console.log(myObj.a) // 2
```

如你所见，我们对`value`的修改悄无声息的失败了。如果我们在`strict mode`下场时，会得到一个错误：

```javascript
'use strict'
var myObj = {}
Object.defineProperty(myObj, 'a', {
  value: 2,
  writable: false,
  configurable: true,
  enumerable: true,
})
myObj.a = 3 // TypeError
```

这个`TypeError`告诉我们，我们不能改变一个不可写属性。
:::tip
`writeable: false`意味着之不可改变，和你定义一个空的 setter 是有些等价的。实际上，你得空 setter 在被调用时需要扔出一个`TypeError`，来和
`writeable: false`的行为保持一致。
:::

#### 可配置性（configurable）

只要属性当前是可配置的，我就可以使用相同的`defineProperty()`工具，修改他的描述符定义：

```javascript
var myObj = { a: 2 }
myObj.a = 3
console.log(myObj.a) // 3

Object.defineProperty(myObj, 'a', {
  value: 4,
  writable: true,
  configurable: false, // 单向操作，不可逆
  enumerable: true,
})
console.log(myObj.a) // 4
myObj.a = 5
console.log(myObj.a) // 5

Object.defineProperty(myObj, 'a', {
  value: 6,
  writable: true,
  configurable: true,
  enumerable: true,
}) // TypeError
```

最后的`defineProperty()`调用会抛出一个`TypeError`，这与`strict mode`无关，如果你试图改变一个不可配置的描述符定义，就会发生 TypeError。
:::warning
如你所见，将`configurable`设置为`false`是 **一个单向操作，不可撤销！**

但有一个小例外：即便属性已经是`configurable:false`，`writable`总是可以没有错误地从`true`改变为`false`，但如果已经是`false`的话不能
变回`true`。
:::

`configurable:false`组织的另外一个事情是使用`delete`操作符移除既存属性的能力。

```javascript
var myObj = { a: 2 }
console.log(myObj.a) // 2
delete myObj.a
console.log(myObj.a) // undefined

Object.defineProperty(myObj, 'a', {
  value: 2,
  writable: true,
  configurable: false,
  enumerable: true,
})
console.log(myObj.a) // 2
delete myObj.a
console.log(myObj.a) // 2
```

如你所见，最后的`delete`调用无声的失败了，因为我们将`a`属性设置成了不可配置。

`delete`仅用于直接从目标对象移除该对象的（可以被移除）属性。如果一个对象的属性是某个其他对象/函数的最后一个现存引用，而你`delete`了它，
那么这就移除了这个引用，于是现在那个没有被任何地方所引用的对象/函数就可以被作为垃圾回收。但是，将`delete`当作一个像其他语言（如 C/C++）中
那样的释放内存工具是**不**恰当的。`delete`仅仅是一个对象属性移除操作符——没有更多别的含义。

#### 可枚举性（enumerable）

它的名称可能已经使它的功能很明显了，这个性质控制着一个属性是否能在特定的对象-属性枚举操作中出现，比如`for..in`循环。设置为`false`将会
阻止它出现在这样的枚举中，即使它依然完全是可以访问的。

### 不可变性（immutability）

有时我们希望将属性或对象（有意或无意）设置为不可改变的。ES5 用几种不同的微妙方式，加入了对此功能的支持。

一个重要的注意点是：**所有**这些方法创建的都是浅不可变性。也就是，它们仅影响对象和它的直属属性的性质。如果对象拥有对其他对象（数组、对象、
函数等）的引用，那个对象的*内容*不会受影响，仍然保持可变。

```javascript
myImmutableObj.foo // [1,2,3]
myImmutableObj.foo.push(4)
myImmutableObj.foo // [1,2,3,4]
```

这段代码，假设`myImmutableObj`已被创建，且被保护为不可变。但是，为了保护`myImmutableObj.foo`的内容（也是一个对象-数组），你将需要使用
下面的一个或多个方法将`foo`设置为不可变。

:::warning
在 JS 程序中创建完全不可动摇的对象是不那么常见的。有些特殊情况当然需要，但作为一个普通的设计模式，如果你发现自己想要*封印（seal）*或
*冻结（freeze）*你所有的对象，那么你可能需要退一步重新考虑你的程序设计，让它对对象值的潜在变化更加健壮。
:::

#### 对象常量（object constant）

通过`writable: false`和`configurable: false`组合，你可以实质上创建了一个作为对象属性的*常量*（不能被改编，重定义或删除），比如：

```javascript
var myObj = {}
Object.defineProperty(myObj, 'FAVORITE_NUMBER', {
  value: 42,
  writable: false,
  configurable: false,
})
```

#### 防止扩展（prevent extensions）

如果你想防止一个对象被添加新的属性，但另一方面保留其它既存的对象属性，可以调用`Object.preventExtensions()`：

```javascript
var myObj = { a: 2 }
Object.preventExtensions(myObj)
myObj.b = 3
myObj.b // undefined
```

在非`strict mode`下，`b`的创建会无声的失败。在`strict mode`下，它会抛出`TypeError`。

#### 封印（seal）

`Object.seal()`创建一个“封印”的对象，这意味着它实质上在当前对象调用`Object.preventExtensions()`，同时也将他所有的既存属性标记为
`configurable: false`。

所以，你既不能添加更多的属性，也不能重新配置或删除既存属性（虽然你依然*可以*修改它们的值）

```javascript

```

#### 冻结（freeze）

Object.freeze()创建一个冻结的对象，这意味着它实质上在当前对象上调用`Object.seal()`，同时也将他所有的“数据访问”属性值设置为`writable: false`，
所以它们的值不可改变

这种方法是你可以从对象自身获得的最高级别的不可变行，因为它阻止任何对对象或对象直属属性的改变（虽然，就像上边提到的，任何被引用的对象的内容不受影响）

你可以“深度冻结”一个对象：在这个对象上调用`Object.freeze()`，然后递归的迭代所有他引用的对象，然后也在它们上面调用`Object.freeze()`。但是
要小心，这可能会影响其他你并不打算影响的（共享的）对象。

### `[[Get]]`

关于属性访问如何工作有一个重要细节。

```javascript
var myObj = { a: 2 }
myObj.a // 2
```

`myObj.a`是一个属性访问，但是它并不是看起来那样，仅仅在`myObj`中寻找一个名为`a`的属性。

根据语言规范，上面的代码实际上在`myObj`上执行了一个`[[Get]]`操作（有些像`[[Get]]()`函数调用）。对一个对象进行默认的内建`[[Get]]`操作，会
*首先*检查对象，寻找一个拥有被请求的名称的属性，如果找到，就返回相应的值。

然而，如果按照被请求的名称*没能*找到属性，`[[Get]]`的算法定义了另一个重要的行为。第五章会解释（遍历`[[Prototype]]`链，如果有的话）。

但`[[Get]]`操作的一个重要结果是，如果他通过任何方法都不能找到被请求的属性的值，那么它就会返回`undefined`。

```javascript
var myObj = { a: 2 }
myObj.b // undefined
```

这个行为和你通过标识符名称来引用*变量*不同。如果你引用了一个在可用的词法作用域内无法解析的变量，其结果不是想对象属性那样返回`undefined`，
而是抛出一个`ReferenceError`。

```javascript
var myObj = { a: undefined }
myObj.a // undefined
myObj.b // undefined
```

从*值*的角度来说，这两个引用没有区别——它们的结果都是`undefined`。然而，在`[[Get]]`操作的底层，虽然不明显，但是比起处理引用`myObj.a`，
处理`myObj.b`的操作要做更多一些潜在的“工作”。

如果仅仅考察结果的值，你无法分辨一个属性是存在并持有一个`undefined`值，还是根本*不*存在所以`[[Get]]`无法返回某个具体值而返回默认的`undefined`。
但是，你很快就能看到你其实*可以*分辨这两种场景。

### `[[Put]]`

既然为了从一个属性中取得值而存在一个内部定义的`[[Get]]`操作，那么明显应该也存在一个默认的`[[Put]]`操作。

这很容易让人认为，给一个对象的属性赋值，将会在这个对象上调用`[[Put]]`来设置或创建这个属性。但是实际情况有一些微妙的不同。

调用`[[Put]]`时，它根据几个因素表现不同的行为，包括（影响最大的）属性是否已经在对象中存在了。

**如果属性存在**，``[[Put]]`算法将会大致检查：

1. 这个属性是访问器描述符吗（getters 和 setters）？**如果是，且是 setter，就调用 setter。**
2. 这个属性时`writable`为`false`属性描述符吗？**如果是，在非`strict mode`下无声地失败，或者在`strict mode`下会抛出`TypeError`**
3. 否则，像平常一样设置既存属性的值。

**如果属性在当前的对象中还不存在**，`[[Put]]`操作会变得更微妙和复杂。稍后在第五章`[[Prototype]]`更清楚地解释它。

### getters 与 setters

对象默认的`[[Put]]`和`[[Get]]`操作分别完全控制着如何设置既存或新属性的值，和如何取得既存属性。

ES5 引入了一个方法来覆盖这些默认操作的一部分，但不是在对象级别而是针对每个属性，就是通过 getters 和 setters。Getter 是实际上调用一个隐藏函数
来取得值的属性。Setter 是实际上调用一个隐藏函数来设置值的属性。

当你将一个属性定义为拥有 getter 和 setter 或两者兼备，那么它的定义就成为了“访问器描述符”（与“属性描述符”相对）。对于访问器描述符，它的`value`
和`writable`性值因没有意义而被忽略，取而代之的是 JS 将会考虑属性的`set`和`get`性质（还有`configurable`和`enumerable`）

```javascript
var myObj = {
  // 为 `a` 定义一个 getter
  get a() {
    return 2
  },
}
Object.defineProperty(myObj, 'b', {
  // 为 `b` 定义一个 getter
  get: function () {
    return this.a * 2
  },
  // 确保 `b` 作为对象属性出现
  enumerable: true,
})
console.log(myObj.a) // 2
console.log(myObj.b) // 4
```

不管是通过在字面对象语法中使用`get a() {}`，还是通过`Object.defineProperty(..)`明确定义，我们都在对象上创建了一个没有实际持有值得属性，
访问他们将会自动地对 getter 函数进行隐藏的函数调用，其返回的人何止就是属性访问的结果。

```javascript
var myOjb = {
  get a() {
    return 2
  },
}
myObj.a = 3 // 2
console.log(myObj.a) // 2
```

因为我们仅为`a`定义了一个 getter ，如果之后我们试着设置`a`的值，赋值操作并不会抛出错误而是无声的将赋值废弃。就算这里有一个合法的 setter，
我们得自定义 getter 将返回值硬编码为仅返回`2`，所以赋值操作是没有意义的。

为了使这个场景更合理，正如你可能期望的那样，每个属性还应当被定义一个覆盖默认`[[Put]]`操作（也就是赋值）的 setter。几乎可确定，你将总是想要
同时声明 getter 和 sett（仅有它们中的一个经常会导致意外的行为）：

```javascript
var myObj = {
  get a() {
    return this._a_
  },
  set a(val) {
    this._a_ = val * 2
  },
}
myObj.a = 2
console.log(myObj.a) // 4
```

这个例子中，我们实际上将赋值操作（`[[Put]]`操作）指定的值`2`存储到了另一个变量`_a_`中。`_a_`这个名称只是用在这个例子中的单纯惯例，并不
意味着它的行为有什么特别之处——它和其他普通属性没有区别。

### 存在性（existence）

[先前](./02-object#get)看到，像`myObj.a`这样的属性访问可能会得到一个`undefined`值，无论它是明确存储着`undefined`还是属性`a`根本
就不存在。那么，如果这两种情况的值相同，我们还区分它们呢？

我们可以查询一个对俩是否拥有特定的属性。而*不必*取得哪个属性的值：

```javascript
var myObj = { a: 2 }
console.log('a' in myObj) // true
console.log('b' in myObj) // false

myObj.hasOwnProperty('a') // true
myObj.hasOwnProperty('b') // false
```

`in`操作符会检查属性是否存在与对象中，或者是否存在与`[[Prototype]]`链对象遍历的更高层中。相比之下，`hasOwnProperty()`仅会检查`myObj`
是否拥有属性，但*不会*查询`[[Property]]`链。

通过委托到`Object.prototype`所有的普通对象都可以访问`hasOwnProperty()`。但是创建一个不链接到`Object.prototype`的对象也是可能的（
`Object.create(null)`）。这种情况下，你将无法使用`hasOwnProperty()`。

在这种情况下，一个进行这种检查的更健壮的方式是`Object.prototype.hasOwnProperty.call(myObj,'a')`，它借用基本的`hasOwnProperty()`
方法而且使用*明确的`this`绑定*来对`myObj`实施这个方法。

:::warning
`in`操作符看起来像是要检查*一个值*在容器中的存在性，但是实际上检查的是*属性名*的存在性。在使用数组时注意这个区别十分重要，因为我们会有很强的
冲动来进行`4 in [2, 4, 5]`这样的检查，但是这总是不像我们想象的那样工作。

```javascript
const arr = [2, 4, 5]
console.log(4 in arr) // false
console.log(0 in arr) // true
console.log('1' in arr) // true
```

:::

#### 枚举（enumeration）

[先前](02-object#可枚举性-enumerable)，在学习`enumerable`属性描述符性质时，简单地解释了“可枚举型（enumerability）”的含义。

```javascript
var myObj = {}
Object.defineProperty(myObj, 'a', {
  enumerable: true,
  value: 2,
})
Object.defineProperty(myObj, 'b', {
  enumerable: false,
  value: 3,
})
console.log(myObj.b) // 3
console.log('b' in myObj) // true
console.log(myObj.hasOwnProperty('b')) // true

for (let k in myObj) {
  console.log(k, myObj[k])
} // 'a' 2
```

`myObj.b`实际上**存在**，而且拥用可以访问的值，但是它不会出现在`for..in`循环中，（令人诧异的是，它的`in`操作符的存在性检查通过了）。
这是因为“enumerable”基本上就意味着“如果对象的属性被迭代时会被包含在内”。

:::warning
将`for..in`循环实施在数组上可能会给出意外的结果，因为枚举一个数组将不仅包含所有的数字下标，还包含所有可枚举属性。所以一个好主意是：将`for..in`
循环*仅*用于对象，而为存储在数组中的值使用传统的`for`循环并用数字索引迭代。
:::

另一个可以区分可枚举和不可枚举属性的方法是：

```javascript
var myObj = {}
Object.defineProperty(myObj, 'a', {
  enumerable: true,
  value: 2,
})
Object.defineProperty(myObj, 'b', {
  enumerable: false,
  value: 3,
})
myObj.propertyIsEnumerable('a') // true
myObj.propertyIsEnumerable('b') // false

Object.keys(myObj) // ['a']
Object.getOwnPropertyNames(myObj) // ['a', 'b']
```

`propertyIsEnumerable()`测试一个给定属性名是否*直接存在*于对象上，并且`enumerable: true`。

`Object.keys()`返回一个所有可枚举属性的数组，而`Object.getOwnPropertyNames()`返回一个*所有*属性的数组，不论能不能枚举。

`in`和`hasOwnProperty()`区别在于它们是否查询`[[Prototype]]`链，而`Object.keys()`和`Object.getOwnPropertyNames()`都*只*考察直接
给定的对象。

（当下）没有与`in`操作符的查询方式（在整个`[[Prototype]]`链上遍历所有的属性）等价的、内建的方法可以得到一个**所有属性**的列表。你可以
近似地模拟一个这样的工具：递归地遍历一个对象的`[[Prototype]]`链，在每一层都从`Object.keys()`中取得一个列表——仅包含可枚举属性。

## 迭代（iteration）

`for..in`循环迭代一个对象上（包括它的`[[Prototype]]`链）所有的可迭代属性。但如果你想要迭代值呢？

在数字索引的数组中，典型的迭代所有值得办法时使用标准的`for`循环：

```javascript
var arr = [1, 2, 3]
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i])
} // 1 2 3
```

但是这并没有迭代所有的值，而是迭代了所有的下标，然后由你使用索引来引用值，比如`arr[i]`。

:::warning
与以有序数字的方式（`for`循环或其他迭代器）迭代数组的下标比较起来，迭代对象属性的顺序是**不确定**的，而且可能会因 JS 引擎的不同而不同。对于跨
平台环境保持一致的问题，**不要依赖**观察到的顺序，因为这个顺序是不可靠的。

:::
