# :zzz:

[《你不知道的 JavaScript》](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/types%20%26%20grammar/ch3.md)

# 原生类型

在第一和第二章中，我们几次提到了各种内建类型，通常称为“原生类型”，比如`String`和`Number`。现在让我们来仔细检视它们。

这是最常用的原生类型的一览：

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Function`
- `RegExp`
- `Date`
- `Error`
- `Symbol` —— 在 ES6 中被加入的！

如你所见，这些原生类型实际上是内建函数。

如果你拥有像 Java 语言那样的背景，JS 中的`String()`看起来像是你曾经用来创建字符串值的`String(..)`构造器。所以，你很快就会观察到你可以做这样的事情：

```javascript
var s = new String('Hello World!')

console.log(s.toString()) // Hello World!
```

这些原生类型的每一种确实可以被用作一个原生类型的构造器。但是被构建的东西可能与你想象的不同：

```javascript
var a = new String('abc')

typeof a // 'object' ... 不是 "string"

a instanceof String // true

Object.prototype.toString.call(a) // "[object String]"
```

创建值的构造器形式（`new String('abc')`）的结果是一个基本类型值（`"abc"`）的包装器对象。

重要的是，`typeof`显示这些对象不是它们自己的特殊*类型*，而是`object`类型的子类型。

这个包装器对象可以被进一步观察，像这样：

```javascript
console.log(a) // String {0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"} Chrome 127
```

这个语句的输出会根据你使用的浏览器变化，因为对于开发者的查看，开发者控制台可以自由选择它认为合适的方式来序列化对象。

> [!NOTE]
> 在写作本书时，最新版的 Chrome 打印出来这样的东西：`String {0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"}`。但是老版本的 Chrome 曾经只打印出这
> 些：`String {0: "a", 1: "b", 2: "c"}`。当前最新版的 Firefox 打印`String["a", "b", "c"]`，但它曾经以斜体字打印`"abc"`，点击它可以打开对象查看器。当然，这些结果是总频繁变更的，而且你的体验也许不同。

重点是，`new String('abc')`为`abc`创建了一个字符串包装器对象，而不仅是基本类型值`"abc"`本身。

## 内部`[[Class]]`

`typeof`的结果为`"object"`的值（比如数组）被额外地打上了一个内部的标签属性`[[Class]]`（请把它考虑为一个内部的分类方法，而非与传统的面向对象编码的类有关）。这个属性
不能直接地被访问，但通常可以间接地通过在这个值上借用默认的`Object.prototype.toString(..)`方法调用来展示。举例来说：

```javascript
Object.prototype.toString.call([1, 2, 3]) // "[object Array]"

Object.prototype.toString.call(/regex-literal/i) // "[object RegExp]"
```

所以，对于这个例子中的数组来说，内部的`[[Class]]`值是`"Array"`，而对于正则表达式，它是`"RegExp"`。在大多数情况下，这个内部的`[[Class]]`值
对应于关联这个值的内建的原生类型构造器（见下面的讨论），但事实却不总是这样。

基本类型呢？首先，`null`和`undefined`：

```javascript
Object.prototype.toString.call(null) // "[object Null]"

Object.prototype.toString.call(undefined) // "[object Undefined]"
```

你会注意到，不存在`Null()`和`Undefined()`原生类型构造器，但不管怎样`"Null"`和`"Undefined"`是被暴露出来的内部`[[Class]]`值。

但是对于像`string`、`number`和`boolean`这样的简单基本类型，实际上会启动另一种行为，通常称为“封箱（boxing）”（见下一节“封箱包装器”）：

```javascript
Object.prototype.toString.call('abc') // "[object String]"
Object.prototype.toString.call(42) // "[object Number]"
Object.prototype.toString.call(true) // "[object Boolean]"
```

在这个代码段中，每一个简单基本类型都自动地被它们分别对应的对象包装器封箱，这就是为什么`"String"`、`"Number"`和`"Boolean"`分别被显示为内部`[[Class]]`值。

> [!NOTE]
> 从 ES5 发展到 ES6 的过程中，这里展示的`toString()`和`[[Class]]`的行为发生了一点儿变化，但我们会在本系列的*ES6 与未来*一书中讲解它们的细节。

## 封箱包装器

这些对象包装器服务于一个非常重要的目的。基本类型值没有属性或方法，所以为了访问`.length`或`.toString()`你需要这个值的对象包装器。值得庆幸的是，
JS 将会自动地*封箱*（也就是包装）基本类型值来满足这样的访问。

```javascript
var a = 'abc'

a.length // 3
a.toUpperCase() // "ABC"
```

那么，如果你想以通常的方式访问这些字符串值上的属性/方法，比如一个`for`循环的`i < a.length`条件，这么做看起来很有道理：一开始就
得到一个这个值的对象形式，于是 JS 引擎就不需要隐含地为你创建一个。

但事实证明这是一个坏主意。浏览器们长久以来就对`.length`这样的常见情况进行性能优化，这意味着如果你试着直接使用对象形式（它们没有被优化过）
进行“提前优化”，那么实际上你的程序将会*变慢*。

一般来说，基本上没有理由直接使用对象形式。让封箱在需要的地方隐含地发生会更好。换句话说，永远也不要做`new String("abc")`、`new Number(42)`
这样的事情 —— 应当总是偏向于使用基本类型字面量`"abc"`和`42`。

### 对象包装器的坑

如果你*确实*选择要直接使用对象包装器，那么有几个坑你应该注意。

举个例子，考虑`Boolean`包装的值：

```javascript
var a = new Boolean(false)

if (!a) {
  console.log('Oops') // 永远不会运行
}
```

这里的问题是，虽然你为值`false`创建了一个对象包装器，但是对象本身是“truthy”（见第四章），所以使用对象的效果是与使用底层的值`false`本身相反的，这与通常的期望十分不同。

如果你想手动封箱一个基本类型值，你可以使用`Object(..)`函数（没有`new`关键字）：

```javascript
var a = 'abc'
var b = new String(a)
var c = Object(a)

typeof a // 'string'
typeof b // 'object'
typeof c // 'object'

b instanceof String // true
c instanceof String // true

Object.prototype.toString.call(b) // "[object String]"
Object.prototype.toString.call(c) // "[object String]"
```

再说一遍，通常不鼓励直接使用封箱的包装器对象（比如上面的`b`和`c`），但你可能会遇到一些它们有用的罕见情况。

## 开箱

如果你有一个包装器对象，而你想要取出底层的基本类型值，你可以使用`valueOf()`方法：

```javascript
var a = new String('abc')
var b = new Number(42)
var c = new Boolean(true)

a.valueOf() // 'abc'
b.valueOf() // 42
c.valueOf() // true
```

当以一种查询基本类型值的方式使用对象包装器时，开箱也会隐含地发生。这个处理的过程（强制转换）将会在第四章中更详细地讲解，但简单地说：

```javascript
var a = new String('abc')
var b = a + '' // `b` 拥有开箱后的基本类型值 'abc'

typeof a // 'object'
typeof b // 'string'
```

## 原生类型作为构造器

对于`array`、`object`、`function`和正则表达式值来说，使用字面形式创建它们的值几乎总是更好的选择，而且字面形式和构造器形式所创建的值是同一种对象（也就是，没有未包装的值）。

正如我们刚刚在上面看到的其他原生类型，除非你真的知道你需要这些构造器形式，一般来说应当避免使用它们，这主要是因为它们会带来一些你可能不会想要对付的异常和陷阱。

### `Array(..)`

```javascript
var a = new Array(1, 2, 3)
a // [1, 2, 3]

var b = [1, 2, 3]
b // [1, 2, 3]
```

> [!NOTE]
>
> `Array(..)`构造器不要求在它前面使用`new`关键字。如果你省略它，它也会表现得好像你已经使用过它一样。所以`Array(1, 2, 3)`和`new Array(1, 2, 3)`的结果是一样的。

`Array`构造器有一种特殊形式，如果它仅仅被传入一个`number`参数，与将这个值作为数组的*内容*不同，它会被认为是用来“预定数组大小”（嗯，某种意义上）用的长度。

这是个可怕的主意。首先，你会意外地用错这种形式，因为它很容易忘记。

但更重要的是，其实没有预定数组大小这样东西。你所创建的是一个空数组，并将这个数组的`length`属性设置为那个指定的数字值。

一个数组在它的值槽上没有明确的值，但是有一个`length`属性意味着这些值槽是存在的，在 JS 中这是一个诡异的数据结构，它带有一些非常奇怪且令人困惑的行为。
可以创建这样的值的能力，完全源于老旧的、已经废弃的、仅具有历史意义的功能（比如`arguments`这样的“类数组对象”）。

> [!NOTE]
> 带有至少一个“空槽”的数组经常被称为“稀疏数组”。

这是另外一个例子，展示浏览器的开发者控制台在如何表示这样的对象上有所不同，它产生了更多的困惑。

举例来说：

```javascript
var a = new Array(3)

a.length // 3
a // [empty × 3] Chrome 127
```

在 Chrome 中`a`的序列化表达是（在本书写作时）：`[undefined × 3]`。**这真的很不幸**。它暗示着在这个数组的值槽中有三个`undefined`值，而事实上
这样的值槽是不存在的（所谓的“空槽（empty slots）” —— 也是一个烂名字！）。

要观察这种不同，实施这段代码：

```javascript
var a = new Array(3)
var b = [undefined, undefined, undefined]
var c = []
c.length = 3

a // Chrome127 [empty × 3]
b // Chrome127 [undefined, undefined, undefined]
c // Chrome127 [empty × 3]
```

> [!NOTE]
> 正如你在这个例子中看到的`c`，数组中的空槽值可以在数组的创建之后发生。将数组的`length`改变为超过它实际定义的槽值的数目，你就隐含地引入了空槽。
> 事实上，你甚至可以在上面的代码段中调用`delete b[1]`，而这么做将会在`b`的中间引入一个空槽。

对于`b`（在当前的 Chrome 中），你会发现它的序列化表现为`[undefined, undefined, undefined]`，与之相对的是`a`和`c`的`[undefined × 3]`。
糊涂了吧？是的，大家都糊涂了。

更糟糕的是，在写作本书时，Firefox 对`a`和`c`报告`[, , ,]`。你发现为什么这使人犯糊涂了吗？仔细看，三个逗号表示有四个值槽，不是我们期望的三个值槽。

**什么！？** Firefox 在它们的序列化表达的末尾放了一个额外的`,`，因为在 ES5 中，列表（数组值，属性列表等等）末尾的逗号是允许的（被砍掉并忽略）。所以如果你在你的程序或控制台中敲入`[, , ,]`
值，你实际上得到的是一个底层为`[, ,]`的值（也就是，一个带有三个空槽的数组）。这种选择，虽然在阅读开发者控制台时使人困惑，但是因为它使拷贝粘贴的时候准确，所以被留了下来。

如果你现在在摇头或翻白眼儿，你并不孤单！（耸肩）

不幸的是，事情越来越糟。比在控制台的输出产生的困惑更糟的是，上面代码段中的`a`和`b`实际上在有些情况下相同，**但在另一些情况下不同**：

```javascript
a.join('-') // "--"
b.join('-') // "--"

a.map(function (v, i) {
  return i
}) // [undefined × 3]   (Chrome 127 已经是 [empty × 3])
b.map(function (v, i) {
  return i
}) // [0, 1, 2]
```

**呃。**

`a.map(..)`调用会*失败*是因为值槽根本就不实际存在，所以`map(..)`没有东西可以迭代。`join(..)`的工作方式不同，基本上我们可以认为它是像这样被实现的：

```javascript
function fakeJoin(arr, connector) {
  var str = ''
  for (var i = 0; i < arr.length; i++) {
    if (i > 0) {
      str += connector
    }

    // 空槽无法通过`in`检查的，但是`undefined`可以。
    // 所以或许当年`fakeJoin(..)`能分别对`empty`和`undefined`打印出`--`。
    // 现在，三个`undefine`会打印出`undefined-undefined-undefined`。 （Chrome 127）
    if (i in arr) {
      str += arr[i]
    }
  }
  return str
}
```

如你所见，`join(..)`好用仅仅是因为它*认为*值槽存在，并循环至`length`值。不管`map(..)`内部是在做什么，它（显然）没有做出这样的假设，所以源自于奇怪的“空槽”数组的结果出人意料，而且好像是失败了。

那么，如果你想要*确实*创建一个实际的`undefined`值的数组（不只是“空槽”），你如何才能做得到呢（除了手动以外）？

```javascript
var a = Array.apply(null, { length: 3 })
a // [undefined, undefined, undefined]
```

糊涂了吧？是的。这里是它大概的工作方式。

`apply(..)`是一个对所有函数可用的工具方法，它以一种特殊方式调用这个使用它的函数。

第一个参数是一个`this`对象绑定（在本系列*this 与对象原型*中有详细讲解），在这里我们不关心它，所以我们将它设置为`null`。第二个参数应该是一个数
组（或*像*数组的东西 —— 也就是“类数组对象”）。这个“数组”的内容作为这个函数的参数“扩散”开来。

所以，`Array.apply(..)`在调用`Array(..)`函数，并将一个值（`{ length: 3 }`对象值）作为它的参数值展开。

在`apply(..)`内部，我们可以预见这里有另一个`for`循环（有些像上面的`join(..)`），它从`0`开始上升但不包含至`length`值（这个例子中是`3`）。

对于每一个索引，它从对象中取得相应的键。所以如果这个数组对象参数在`apply(..)`内部被命名为`arr`，那么这种属性访问实质上是`arr[0]`、`arr[1]`
和`arr[2]`。当然，没有一个属性是在`{length: 3}`对象值上存在的，所以这三个属性访问都将返回值`undefined`。

换句话说，调用`Array(..)`的结局基本上是这样：`Array(undefined, undefined, undefined)`，这就是我们如何得到一个填补`undefined`值的数组的，而非仅仅是一些（疯狂）的空槽。

虽然对于创建一个填满`undefined`值的数组来说，`Array.apply(null, { length: 3 })`是一个奇怪而且繁冗的方法，但是它要比使用砸自己脚似的`Array(3)`空槽要可靠和好的**太多了**。

总之：你**在任何情况下，永远不**也不应该有意地创建并使用诡异的空槽数组。就别这么干。它们是怪胎。

### `Object(..)`、`Function(..)` 和 `RegExp(..)`

`Object(..)`/`Function(..)`/`RegExp(..)`构造器一般来说也是可选的（因此除非是特别的目的，应当避免使用）：

```javascript
var c = new Object()
c.foo = 'bar'
c // { foo: 'bar' }

var d = { foo: 'bar' }
d // { foo: 'bar' }

var e = new Function('a', 'return a * 2')
var f = function (a) {
  return a * 2
}
function g(a) {
  return a * 2
}

var h = new RegExp('^a*b+', 'g')
var i = /^a*b+/g
```

几乎没有理由使用`new Object()`构造器形式，尤其因为它强迫你一个一个地添加属性，而不是像对象的字面形式那样一次添加许多。

`Function`构造器仅在最最罕见的情况下有用，也就是你需要动态地定义一个函数的参数/它的函数体。**不要将`Function(..)`仅仅作为另一种形式的`eval(..)`**。
你几乎永远不会需要用这种方式动态定义一个函数。

用字面量形式（`/^a*b+/g`）定义正则表达式是被大力采用的，不仅因为语法简单，而且还有性能原因 —— JS 引擎会在代码执行前预编译并缓存它们。和我们迄今看到的其他构造器形式不同，
`RegExp(..)`有一些合理的用途：用来动态定义一个正则表达式的范例。

```javascript
var name = 'Kyle'
var namePattern = new RegExp('\\b(?:' + name + ')+\\b', 'ig')

var matches = someText.match(namePattern)
```

这样的场景在 JS 程序中一次又一次地合法出现，所以你有需要使用`new RegExp('pattern', 'flags')`形式。

### `Date(..)` 和 `Error(..)`

`Date(..)`和`Error(..)`原生类型构造器要比其他种类的原生类型有用的多，因为它们没有字面量形式。

要创建一个日期对象值，你必须使用`new Date()`。`Date(..)`构造器接收可选参数值来指定要使用的日期/时间，但是如果省略的话，就会使用当前的日期/时间。

目前你构建一个日期对象的最常见的理由是要得到当前的时间戳（一个有符号整数，从 1970 年 1 月 1 日开始算起的毫秒数）。你可以在一个日期对象实例上调用`getTime()`得到它。

但是在 ES5 中，一个更简单的方法是调用定义为`Date.now()`的静态帮助函数。而且在 ES5 之前中填补它很容易：

```javascript
if (Date.now()) {
  Date.now = function () {
    return new Date().getTime()
  }
}
```

> [!NOTE]
> 如果你不带`new`调用`Date()`，你将会得到一个那个时刻的日期/时间的字符串表达式。在语言规范中没有规定这个表达的确切形式，虽然各个浏览器趋向于
> 赞同使用这样的东西：`"Tue Aug 18 2015 00:31:02 GMT-0500 (CDT)"`。

`Error(..)`构造器（很像上面的`Array()`）在有`new`与没有`new`时的行为是相同的。

你想要创建 error 对象的主要原因是，它会将当前的执行栈上下文捕捉进对象中（在大多数 JS 引擎中，在创建后使用只读的`.stack`属性表示）。
这个栈上下文包含函数调用栈和 error 对象被创建时的行号，这使调式这个错误更简单。

典型地，你将与`throw`操作符一起使用这样的 error 对象：

```javascript
function foo(x) {
  if (!x) {
    throw new Error("x wasn't provided")
  }
}
```

Error 对象实例一般拥有至少一个`message`属性，有时还有其他属性（你应当将它们作为只读的），比如`type`。然而，与其检视上面提到的`stack`属性，
最好是在 error 对象上调用`toString()`（明确地调用，或者是通过强制转换隐含地调用 —— 见第四章）来得到一个格式友好的错误消息。

> [!TIP]
> 技术上讲，除了一般的`Error(..)`原生类型以外，还有几种特定错误的原生类型：`EvalError(..)`、`RangeError(..)`、`ReferenceError(..)`、
> `SyntaxError(..)`、`TypeError(..)`和`URIError(..)`。但是手动使用这些特定错误原生类型十分少见。如果你的程序确实遭受了一个真实的异常，
> 它们是会自动地被使用的（比如引用一个未声明的变量而得到一个`ReferenceError`错误）。

### `Symbol(..)`

在 ES6 中，新增了一个基本值类型，称为“Symbol”。Symbol 是一种特殊的“独一无二”（不是严格保证的！）的值，可以作为对象上的属性使用而几乎不必担心任何冲突。
它们主要是为特殊的 ES6 的内建行为设计的，但你也可以定义你自己的 symbol。

Symbol 可以用作属性名，但是你不能从你的程序中看到或访问一个 symbol 的实际值，从开发者控制台也不行。例如，如果你在开发者控制台中对一个 Symbol 求值，
将会显示`Symbol(Symbol.create)`之类的东西。

在 ES6 中有几种预定义的 Symbol，作为`Symbol`函数对象的静态属性访问，比如`Symbol.iterator`，`Symbol.create`等等。要使用它们，可以这样做：

```javascript
obj[Symbol.iterator] = function () {
  // ..
}
```

要定义你自己的 Symbol，使用`Symbol(..)`原生类型。`Symbol(..)`原生类型“构造器”很独特，因为它不允许你将`new`与它一起使用，这么做会抛出一个错误。

```javascript
var mySym = Symbol('my own symbol')
mySym // Symbol(my own symbol)
mySym.toString() // 'Symbol(my own symbol)'
typeof mySym // 'symbol'

var obj = {}
obj[mySym] = 'foo'

Object.getOwnPropertySymbols(a) // [Symbol(my own symbol)]
```

虽然 Symbol 实际上不是私有的（在对象上使用`Object.getOwnPropertySymbols(..)`反射，揭示了 Symbol 其实是相当公开的），但是它们的主要用途可能是
私有属性，或者类似的特殊属性。对于大多数开发者，他们也许会在属性名上加入`_`下划线前缀，这经常在惯例上表示：“这是一个私有的/特殊的/内部的属性，别碰！”

> [!NOTE]
>
> `Symbol`_不是_`object`，它们是简单的基本标量。

### 原生类型原型

每一个内建的原生构造器都拥有它自己的`.prototype`对象 —— `Array.prototype`，`String.prototype`等等。

对于它们特定的对象子类型，这些对象含有独特的行为。

例如，所有的字符串对象，和`string`基本值的扩展（通过封箱），都可以访问在`String.prototype`对象上作为方法定义的默认行为。

> [!NOTE]
> 作为文档惯例，`String.prototype.XYZ`会被缩写为`String#XYZ`，对于其他所有`.prototype`的属性都是如此。

- `String#indexOf(..)`：在一个字符串中找出一个子串的位置
- `String#charAt(..)`：访问一个字符串中某个位置的字符
- `String#substr(..)`、`String#substring(..)`、`String#slice(..)`：将字符串的一部分抽取为一个新字符串
- `String#toUpperCase()`、`String#toLowerCase()`：创建一个转换为大写或小写的新字符串
- `String#trim()`：创建一个截去开头或结尾空格的新字符串

这些方法中没有一个是在*原地*修改字符串的。修改（比如大小写变换或去空格）会根据当前的值来创建一个新的值。

有赖于原型委托（见本系列的*this 与原型对象*），任何字符串值都可以访问这些方法：

```javascript
var a = ' abc '

a.indexOf('c') // 2
a.toUpperCase() // 'ABC'
a.trim() // 'abc'
```

其他构造器的原型包含适用于它们类型的行为，比如`Number#toFixed(..)`（将一个数字转换为一个固定小数位的字符串）和`Array#concat(..)`（混合数组）。
所有这些函数都可以访问`apply(..)`、`call(..)`和`bind(..)`，因为`Function.prototype`定义了它们。

但是，一些原生类型的原型不*仅仅*是单纯的对象：

```javascript
typeof Function.prototype // 'function'
Function.prototype() // 它是一个空函数

RegExp.prototype.toString() // '/(?:)/' —— 空的正则表达式
'abc'.match(RegExp.prototype) // [""] —— 这样写已经不行了，不知道什么时候改的。
// TypeError: Method RegExp.prototype.exec called on incompatible receiver [object Object] —— Chrome 127
```

一个特别差劲儿的主意是，你甚至可以修改这些原生类型的原型（不仅仅是你可能熟悉的添加属性）：

```javascript
Array.isArray(Array.prototype) // true
Array.prototype.push(1, 2, 3) // 3
Array.prototype // [1, 2, 3]

// 别这么留着它，要不就等着怪事发生吧！
// 将`Array.prototype`重置为空
Array.prototype.length = 0
```

如你所见，`Function.prototype`是一个函数，`RegExp.prototype`是一个正则表达式，而`Array.prototype`是一个是数组。有趣吧？酷吧？

#### 原型作为默认值

`Function.prototype`是一个空函数，`RegExp.prototype`是一个“空”正则表达式（也就是不匹配任何东西），而`Array.prototype`是一个空数组，
这使它们成了可以赋值给变量的，很好的“默认”值 —— 如果这些类型的变量还没有值。

例如：

```javascript
function isThisCool(arr, fn, rx) {
  arr = arr || Array.prototype
  fn = fn || Function.prototype
  rx = rx || RegExp.prototype // MD，难道当年这样真的能运行？
  // 这里这样是合理的： rx = rx || /(?:)/

  return rx.test(arr.map(fn).join(''))
}

isThisCool() //  TMD 这里会报错； RegExp.prototype确实有test方法，但它只能RegExp实例调用
// TypeError: Method RegExp.prototype.exec called on incompatible receiver

isThisCool(
  ['a', 'b', 'c'],
  function (v) {
    return v.toUpperCase()
  },
  /D/
) // false
```

> [!NOTE]
> 在 ES6 中，我们不再需要使用`arr = arr || ..`这样的默认值语法技巧了（见第四章），因为在函数声明中可以通过原生语法为参数设定默认值（见第五章）。

这个方式的一个微小的副作用是，`.prototype`已经被创建了，而且是内建的，因此它仅被创建*一次*。相比之下，使用`[]`、`function(){}`和`/(?:)/`这些值
本身作为默认值，将会（很可能，要看引擎如何实现）在每次调用`isThisCool(..)`时重新创建这些值（而且之后可能要回收它们）。这可能会消耗内存/CPU。

另外，要非常小心不要对**后续要被修改的值**使用`Array.prototype`作为默认值。在这个例子中，`arr`是只读的，但如果你要在原地对`arr`进行修改，那
你实际上修改的是`Array.prototype`本身，这将把你引到刚才提到的坑里！

> [!NOTE]
> 虽然我们指出了这些原生类型的原型和一些用处，但是依赖它们的时候要小心，更要小心以任何形式修改它们。更多的讨论见附录 A“原生原型”。

## 复习

JS 为基本类型提供了对象包装器，被称为原生类型（`String`、`Number`、`Boolean`等等）。这些对象包装器使这些值可以访问每种对象子类型的恰当行为（`String#trim()`和`Array#concat(..)`）。

如果你有一个像`"abc"`这样的简单基本类型标量，而且你想要访问它的`length`属性或某些`String.prototype`方法，JS 会自动地“封箱”这个值（用它
所对应种类的对象包装器把它包起来），以满足这样的属性/方法访问。
