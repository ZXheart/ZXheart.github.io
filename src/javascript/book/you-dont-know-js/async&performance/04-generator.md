# :zzz:

[《你不知道的 JavaScript》](https://github.com/ZXheart/You-Dont-Know-JS/blob/1ed-zh-CN/async%20%26%20performance/ch4.md)

# generator

在第二章中，我们发现了在使用回调表达异步流程控制时的两个关键缺陷：

- 基于回调的异步不符合大脑对任务步骤的规划方式
- 由于*控制反转*，回调并不是可信任或可组合的

在第三章中，我们详细介绍了 Promise 如何把回调的*控制反转*再反转回来，恢复了可信任性/可组合性。

现在我们把注意力转移到一种顺序、看似同步的异步流程控制表达风格。使这种风格成为可能“魔法”就是 ES6 生成器（generator）。

## 打破完整运行

在第一章中，我们解释了 JS 开发者在代码中几乎普遍依赖的一个假定：一个函数一旦开始执行，就会运行到结束，期间不会有其他代码能够打断它并插入其间。

可能看起来似乎有点奇怪，不过 ES6 引入了一个新的函数类型，它并不符合这种运行到结束的特性。这类新的函数被称为生成器。

考虑如下这个例子来了解其含义：

```javascript
var x = 1

function foo() {
  x++
  bar() // 这一行是什么作用？

  console.log('x:', x)
}

function bar() {
  x++
}
foo() // x: 3
```

在这个例子中，我们确信`bar()`会在`x++`和`console.log(x)`之间运行。但是，如果`bar()`并不在那里会怎样呢？显然结果就会是 2，而不是 3。

现在动脑筋想一下。如果`bar()`并不在那儿，但出于某种原因它仍然可以在`x++`和`console.log(x)`语句之间运行，这又会怎样呢？这如何才会成为可能呢？

如果是在抢占式多线程语言中，从本质上说，这是可能发生的，`bar()`可以在两个语句之间打断并运行。但 JS 并不是抢占式的，（目前）也不是多线程的。然而，如果`foo()`自身可以通过
某种形式在代码的这个位置指示暂停的话，那就仍然可以以一种合作式的方式实现这样的中断（并发）。

> [!NOTE]
> 这里我之所以使用了“合作式的”一次，不只是因为这与经典并发术语之间的关联（参见第一章）；还因为你将会在下一段代码中看到的，ES6 代码中指示暂停点的语法是`yield`,
> 这也礼貌的表达了一种合作式的控制放弃。

下面是实现这样的合作式并发的 ES6 代码：

```javascript
var x = 1

function* foo() {
  x++
  yield
  console.log('x:', x)
}

function bar() {
  x++
}
```

> [!NOTE]
> 很可能你看到的其他多数 JS 文档和代码中的生成器声明格式都是`function* foo(){ .. }`，而不是我这里是用的`function *foo(){ .. }`：唯一区别是`*`位置的风格不同。这两种形式在
> 功能和语法上都是等同的，还有一种是`function*foo(){ .. }`（没有空格）也一样。两种风格，各有优缺，但总体上我比较喜欢`function *foo(){ .. }`的形式，因为这样在使用`*foo()`
> 来引用生成器的时候就会比较一致。如果只用`foo()`的形式，你就不会清楚知道我指的是生成器还是常规函数。这完全是一个风格偏好问题。

现在，我们要如何运行前面的代码片段，使得`bar()`在`*foo()`内部的`yield`处执行呢？

```javascript
// 构建一个迭代器it来控制这个生成器
var it = foo()

// 这里启动foo()!
it.next()
// x: 2
bar()
// x: 3
it.next() // x: 3
```

好吧，这两段代码中有很多新知识，可能会让人迷惑，所以这里有很多东西需要学习。在解释 ES6 生成器的不同机制和语法之前，我们先来看看运行过程。

1. `it = foo()`运算并没有执行生成器`*foo()`，而只是构造了一个*迭代器（iterator）*，这个迭代器会控制它的执行。后面会介绍迭代器。

2. 第一个`it.next()`启动了生成器`*foo()`，并运行了`*foo()`的第一行`x++`。

3. `*foo()`在`yield`语句处暂停，在这一点上第一个`it.next()`调用结束。此时`*foo()`仍然在运行并且是活跃的，但处于暂停状态。

4. 我们查看`x`的值，此时为 2。

5. 我们调用`bar()`，它通过`x++`再次递增 `x`。

6. 我们再次查看`x`的值，此时为 3。

7. 最后的`it.next()`调用从暂停处恢复了生成器`*foo()`的执行，并运行了`console.log(..)`语句，这条语句使用当前`x`的值 3。

显然，`foo()`启动了，但是没有完全运行，它在`yield`处暂停了。后面恢复了`foo()`并让它运行到结束，但这不是必须的。

因此，生成器就是一类特殊的函数，可以一次或多次启动和停止，并不一定非得要完成。尽管现在还不是特别清楚它的强大之处，但随着对本章后续内容的深入学习，我们会看到
它将成为用于构建以生成器作为异步流程控制的代码模式的基础构件之一。

### 输入和输出

生成器函数是一个特殊的函数，具有前面我们展示的新的执行模式。但是，它仍然是一个函数，这意味着它仍然有一些基本的特性没有改变。比如，它仍然可以接受参数（即输入），
也能够返回值（即输出）。

```javascript
function* foo(x, y) {
  return x * y
}

var it = foo(6, 7)
var res = it.next()
console.log(res.value) // 42
```

我们向`*foo()`传入实参 6 和 7 分别作为参数`x`和`y`。`*foo()`向调用代码返回 42。

现在我们可以看到生成器和普通函数在调用上的一个区别。显然`foo(6, 7)`看起来很熟悉。但难以理解的是，生成器`*foo(..)`并没有像普通函数一样实际运行。

事实上我们只是创建了一个迭代器对象，把它赋给了一个变量`it`，用于控制生成器`*foo(..)`。然后调用`it.next()`，只是生成器`*foo(..)`从当前位置开始继续运行，停在下一个`yield`处
或者直到生成器结束。

这个`next(..)`调用的结果是一个对象，它有一个`value`属性，持有从`*foo(..)`返回的值（如果有的话）。换句话说，`yield`会导致生成器在执行过程中发送出一个值，这有点类似于中间的`return`。

目前还不清楚为什么需要这一整个间接迭代器对象来控制生成器。会清楚的，我保证。

#### 迭代消息传递

除了能够接受参数并提供返回值之外，生成器甚至提供了更强大更引人注目的内建消息输入输出能力，通过`yield`和`next(..)`实现。

考虑：

```javascript
function* foo(x) {
  var y = x * (yield)

  return y
}

var it = foo(6)

// 启动foo(..)
it.next()

var res = it.next(7)

res.value // 42
```

首先，传入 6 作为参数`x`。然后调用`it.next()`，这会启动`*foo()`。

在`*foo()`内部，开始执行语句`var y = x ..`，但随后就遇到了一个`yield`表达式。它就会在这一点上暂停`*foo(..)`（在赋值语句中间！），并在本质上要求调用代码为`yield`表达式提供一个
结果值。接下来，调用`it.next(7)`，这一句把值`7`传回作为被暂停的`yield`表达式的结果。

所以，这时赋值语句实际上就是`var y = 6 * 7`。现在，`return y`返回值 42 作为调用`it.next(7)`的结果。

注意，这里有一点非常重要，但即使对于有经验的 JS 开发者也很有迷惑性：根据你的视角不同，`yield`和`next(..)`调用有一个不匹配。一般来说，需要的`next(..)`调用要比`yield`语句
多一个，前面的代码片段有一个`yield`和两个`next(..)`调用。

为什么会有这个不匹配？

因为第一个`next(..)`总是启动一个生成器，并运行到第一个`yield`处。不过，是第二个`next(..)`调用完成第一个被暂停的`yield`表达式，第三个`next(..)`调用完成第二个`yield`，以此类推。

#### 两个问题的故事

实际上，主要考虑哪部分代码将影响是否存在感知不匹配。

只考虑生成器代码:

```javascript
// prettier-ignore
var y = x * (yield)
return y
```

第一个`yield`基本上是提出了一个问题：“这里我应该插入什么值？”

谁来回答这个问题呢？第一个`next()`已经运行，使得生成器启动并运行到此处，所以显然它无法回答这个问题。因此必须由第二个`next(..)`调用回答第一个`yield`提出的这个问题。

看到不匹配了吗 —— 第二个对第一个？

把视角转化一下：不从生成器的视角看这个问题，而是从迭代器的角度。

为了恰当阐述这个视角，我们还需要解释一下：消息是双向传递的 —— `yield..`作为一个表达式可以发出消息响应`next(..)`调用，`next(..)`也可以向暂停的`yield`表达式发送值。

考虑下面这段稍稍调整过的代码：

```javascript
function* foo(x) {
  var y = x * (yield 'hello') // <-- yield a value!

  return y
}

var it = foo(6)

var res = it.next() // 第一个next()，并不传入任何东西
console.log(res.value) // hello

res = it.next(7) // 向等待的yield传入7
console.log(res.value) // 42
```

`yield..`和`next(..)`这一对组合起来，*在生成器的执行过程中*构成了一个双向消息传递系统。

那么只看下面一段*迭代器*代码：

```javascript
var res = it.next() // 第一个next()，不传入任何东西
console.log(res.value) // hello

res = it.next(7) // 向等待的yield传入7
console.log(res.value) // 42
```

> [!NOTE]
> 我们并没有向第一个`next()`调用发送值，这是有意为之。只有暂停的`yield`才能接受这样一个通过`next(..)`传递的值，而在生成器的起始处我们调用第一个`next()`时，
> 还没有暂停的`yield`来接受这样一个值。规范和所有兼容浏览器都会默默丢弃传递给第一个`next()`的任何东西。传值过去仍然不是一个好思路，因为你创建了沉默的无效代码，
> 这会让人迷惑。因此，启动生成器时一定要用不带参数的`next()`。

第一个`next()`调用（没有参数的）基本上就是在提出一个问题：“生成器`*foo(..)`要给我的下一个值是什么”。谁来回答这个问题呢？第一个`yield 'hello'`表达式。

看见了吗？这里没有不匹配。

根据你认为提出问题的是谁，`yield`和`next(..)`调用之间要么有不匹配，要么没有。

但是，稍等！与`yield`语句的数量相比，还是多出了一个额外的`next()`。所以，最后一个`it.next(7)`调用再次提出了这样的问题：生成器将要产生的下一个值是什么。但是，
再没有`yield`语句来回答这个问题了，是不是？那么谁来回答呢？

`return`语句回答这个问题！

如果你的生成器中没有`return`的话 —— 在生成器中和在普通函数中一样，`return`当然不是必须的 —— 总有一个假定的/隐式的`return`；（也就是 `return undefined`），它
会在默认情况下回答最后的`it.next(7)`调用提出的问题。

这样的提问和回答是非常强大的：通过`yield`和`next(..)`建立的双向消息传递。但目前还不清楚这些机制是如何与异步流程控制联系到一起的。会清楚的！

### 多个迭代器

从语法使用的方面来看，通过一个迭代器控制生成器的时候，似乎是在控制声明的生成器函数本身。但是有一个细微之处很容易忽略：每次构建一个*迭代器*，实际上就隐式构建了
生成器的一个实例，通过这个*迭代器*来控制的是这个生成器实例。

同一个生成器的多个实例可以同时运行，它们甚至可以彼此交互：

```javascript
function* foo() {
  var x = yield 2
  z++
  var y = yield x * z
  consol.log(x, y, z)
}

var z = 1

var it1 = foo()
var it2 = foo()

var val1 = it1.next().value // 2
var val2 = it2.next().value // 2

val1 = it1.next(val2 * 10).value // 40 x:20 z:2
val2 = it2.next(val1 * 5).value // 600 x:200 z:3

it1.next(val2 / 2) // y:300 x:20 z:3
it2.next(val1 / 4) // y:10 x:200 z:3
```

> [!WARNING]
> 同一个生成器的多个实例并发运行的最常用处并不是这样的交互，而是生成器在没有输入的情况下，可能从某个独立连接的资源产生自己的值。下一节中我们会详细介绍值产生。

我们简单梳理一下执行流程。

1. `*foo()`的两个实例同时启动，两个`next()`分别从`yield 2`语句得到值 2。

2. `val2 * 10`也就是`2 * 10`，发送到第一个生成器实例`it1`，因此 x 得到值 20。z 从 1 增加到 2，然后`20*2`通过`yield`发出，将`val1`设置为 40。

3. `val1 * 5`也就是`40 * 5`，发送到第二个生成器实例`it2`，因此 x 得到值 200。z 再次从 2 递增到 3，然后`200 * 3`通过`yield`发出，将`val2`设置为 600。

4. `val2 / 2`也就是`600 / 2`，发送到第一个生成器实例`it1`，因此 y 得到值 300，然后打印出 x y z 的值分别是 `20 300 3`。

5. `val1 / 4`也就是`40 / 4`，发送到第二个生成器实例`it2`，因此 y 得到值 10，然后打印出 x y z 的值分别是 `200 10 3`。

在脑海中运行一遍这个例子很有趣。理清楚了吗？

#### 交替执行

回想第一章中“运行至完成”一节的这个场景：

```javascript
var a = 1
var b = 2

function foo() {
  a++
  b = b * a
  a = b + 3
}

function bar() {
  b--
  a = 8 + b
  b = a * 2
}
```

如果是普通的 JS 函数的话，显然，要么是`foo()`首先运行完毕，要么是`bar()`首先运行完毕，但`foo()`和`bar()`的语句不能交替执行。所以，前面的程序只有两种可能的输出。

但是，使用生成器的话，交替执行（甚至在语句当中！）显然是可能的：

```javascript
var a = 1
var b = 2

function* foo() {
  a++
  yield
  b = b * a
  a = (yield b) + 3
}

function* bar() {
  b--
  yield
  a = (yield 8) + b
  b = a * (yield 2)
}
```

根据迭代器控制的`*foo()`和`*bar()`调用的相对顺序不同，前面的程序可能会产生多种不同的结果。换句话说，通过两个生成器在共享的相同变量上的迭代交替执行，我们实际上
可以（以某种模拟的方式）印证第 1 章讨论的理论上的多线程竟态条件环境。

首先，来构建一个名为`step(..)`的辅助函数，用于控制*迭代器*：

```javascript
function step(gen) {
  var it = gen()
  var last

  return function () {
    // 不管yield出来的是什么，下一次都把它原样传回去！
    last = it.next(last).value
  }
}
```

`step(..)`初始化了一个生成器来创建*迭代器*it，然后返回一个函数，这个函数被调用的时候会将*迭代器*向前迭代一步。另外，前面的`yield`发出的值会在下一步发送出去。
于是，`yield 8`就是`8`，而`yield b`就是`b`（yield 发出时的值）。

现在，只是为了好玩，我们来试验一下交替运行`*foo()`和`*bar()`代码块的效果。我们从乏味的基本情况开始，确保`*foo()`在`*bar()`之前完全结束（和第一章中做的一样）：

```javascript
// 确保重新设置a和b

a = 1
b = 2

var s1 = step(foo)
var s2 = step(bar)

// 首次运行*foo()
s1() // it.next(undefined) -> yield undefined -> last = undefined; a=1+1
s1() // it.next(undefined) -> yield 2*2 -> last = 4； b=2*2
s1() // it.next(4) -> (yield b) = 4 -> last = undefined； a=4+3=7

// 现在运行*bar()
s2() // it.next(undefined) -> yield undefined -> last = undefined； b=4-1
s2() // it.next(undefined) -> yield 8 -> last = 8；
s2() // it.next(8) -> yield 2 -> last = 2； a=8+3
s2() // it.next(2) -> (yield 2) = 2 -> last = undefined; b=11*2

console.log(a, b) // 11 22
```

最后的结果是 11 和 22，和第一章中的版本一样。现在交替执行顺序，看看 a 和 b 的值是如何改变的：

```javascript
// 确保重新设置a和b
a = 1
b = 2

var s1 = step(foo)
var s2 = step(bar)

s2() // b-- -> b=1
s2() // yield 8
s1() // a++ -> a=2
s2() // a = 8 + 1 = 9 ; yield 2
s1() // b = 1 * 9 = 9 ; yield 9
s1() // a = 9 + 3 = 12
s2() // b = 9 * 2 = 18
```

在告诉你结果之前，你能推断出前面的程序运行后 a 和 b 的值吗？不要作弊！

```javascript
console.log(a, b) // 12 18
```

> [!NOTE]
> 作为留给大家的练习，请试着重新安排`s1()`和`s2()`的调用顺序，看看还能够得到多少种结果组合。不要忘了，你总是需要 3 次`s1()`调用和 4 次`s2()`调用。
> 回忆一下前面关于`next()`和`yield`匹配的讨论，想想为什么。

当然，你基本不可能故意创建让人迷惑到这种程度的交替运行实际代码，因为这给理解代码带来了极大的难度。但这个练习很有趣，对于理解多个生成器如何在共享的作用域
上并行运行也有指导意义，因为这个功能有很多用武之地。

我们将在本章末尾更详细的讨论 generator 并发。

## 生成器产生值

在前面一节中，我们提到生成器的一种有趣用法是作为一种产生值的方式。这并不是本章的重点，但是如果不介绍一些基础的话，就会缺乏完整性了，特别是因为这正是“生成器”这个名字最初的使用场景。

下面要偏一下题，先介绍一下*迭代器*，不过我们还会回来介绍它们与生成器的关系以及如何使用生成器来*生成值*。

### 生产者与迭代器

假定你要产生一系列值，其中每个值都与前面一个有特定的关系。要实现这一点，需要一个有状态的生产者能够记住其生成的最后一个值。

可以实现一个直接使用函数闭包的版本（参见本系列的“作用域与闭包”部分），类似如下：

```javascript
var gimmeSomething = (function () {
  var nextVal

  return function () {
    if (nextVal === undefined) {
      nextVal = 1
    } else {
      nextVal = 3 * nextVal + 6
    }
    return nextVal
  }
})()

gimmeSomething() // 1
gimmeSomething() // 9
gimmeSomething() // 33
gimmeSomething() // 105
```

> [!NOTE]
> 这里 nextVal 的计算逻辑已经简化了，但是从概念上说，我们希望直到下一次 gimmeSomething()调用发生时才计算下一个值（即 nextVal）。否则，一般来说，对
> 更持久化或比起简单数字资源更受限的生产者来说，这可能就是资源泄漏的设计。

生成任意数字序列并不是一个很实际的例子。但如果是想要从数据源生成记录呢？可以采用基本相同的代码。

实际上，这个任务是一个非常通用的设计模式，通常通过迭代器来解决。*迭代器*是一个定义良好的接口，用于从一个生产者一步步得到一系列值。JS 迭代器的接口，
与多数语言类似，就是每次想要从生产者得到下一个值的时候调用`next()`。

可以为我们的数字序列生成器实现标准的*迭代器*接口：

```javascript
var something = (function () {
  var nextVal

  return {
    // for...of循环需要
    [Symbol.iterator]: function () {
      return this
    },

    // 用于迭代器接口方法
    next() {
      if (nextVal === undefined) {
        nextVal = 1
      } else {
        nextVal = 3 * nextVal + 6
      }
      return { done: false, value: nextVal }
    },
  }
})()

something.next().value // 1
something.next().value // 9
something.next().value // 33
something.next().value // 105
```

> [!NOTE]
> 我们将在“Iterable”一节中讲解为什么在这段代码中需要`[Symbol.iterator]:...`这一部分。从语法上说，这涉及了两个 ES6 特性。首先，`[..]`语法被称为*计算属性名*（参
> 见本系列的“this 和对象原型”部分）。这在对象术语定义中是指，指定一个表达式并用这个表达式的结果作为属性的名称。另外，`Symbol.iterator`是 ES6 预定义的特殊`Symbol`值
> 之一（参见本系列的“ES6 与未来”部分）。

`next()`调用返回一个对象。这个对象有两个属性：done 是一个 boolean 值，标识*迭代器*的完成状态；value 中放置迭代值。

ES6 还新增了一个`for..of`循环，这意味着可以通过原生循环语法自动迭代标准*迭代器*：

```javascript
for (var v of something) {
  console.log(v)

  // 不要死循环！
  if (v > 500) {
    break
  }
}
// 1 9 33 105 321 969
```

> [!NOTE]
> 因为我们的*迭代器*something 总是返回`done:false`，因此这个`for..of`循环将永远运行下去，这也就是为什么我们要在里面放一个`break`条件。迭代器
> 永不结束是完全没有问题的，但是也有一些情况下，*迭代器*会在有限的值集合上运行，并最终返回`done:true`。

`for..of`循环在每次迭代中自动调用`next()`，它不会向`next()`传入任何值，并且会在接收到`done:true`之后自动停止。这对于在一组数据上循环很方便。

当然，也可以手工在迭代器上循环，调用`next()`并检查`done:true`条件来确定何时停止循环：

```javascript
for (let ret; (ret = something.next()) && !ret.done; ) {
  console.log(ret.value)

  // 不要死循环！
  if (ret.value > 500) {
    break
  }
}

// 1 9 33 105 321 969
```

> [!NOTE]
> 这种手工 for 方法当然要比 ES6 的`for..of`循环语法丑陋，但其优点是，这样就可以在需要时向`next()`传递值。

除了构造自己的*迭代器*，许多 JS 的内建数据结构（从 ES6 开始），比如 array，也有默认的*迭代器*：

```javascript
var a = [1, 3, 5, 7, 9]

for (var v of a) {
  console.log(v)
}
// 1 3 5 7 9
```

`for..of`循环向 a 请求它的*迭代器*，并自动使用这个迭代器迭代遍历 a 的值。

> [!NOTE]
> 这里可能看起来像是 ES6 一个奇怪的缺失，不过一般的 object 是故意不像 array 一样有默认的迭代器。这里我们并不会深入探讨其中的缘由。如果你只是想要迭代一个对象
> 的所有属性的话（不需要保证特定的顺序），可以通过`Object.keys(..)`返回一个 array，类似于`for (var k of object.keys(obj)){ .. }`这样使用。这样在一个对象
> 的键值上使用`for..of`循环与`for..in`循环类似，除了`Object.keys(..)`并不包含来自于`[[Prototype]]`链上的属性，而`for..in`则包含（参见本系列的“this 和对象原型”部分）。

### iterable

前面例子中的 something 对象叫做*迭代器*，因为它的接口中有一个`next()`方法。而与其紧密相关的一个术语是 iterable（可迭代），即指包含有一个可以迭代它所有值的迭代器的对象。

从 ES6 开始，从一个 iterable 中提取迭代器的方法是：iterable 必须支持一个函数，其名称是专门的 ES6 符号值`Symbol.iterator`。调用这个函数时，它会返回一个迭代器。通常
每次调用会返回一个全新的迭代器，虽然这一点并不是必须的。

前面代码片段中的 a 就是一个 iterable。`for..of`循环自动调用它的`Symbol.iterator`函数来构建一个迭代器。我们当然也可以手工调用这个函数，然后使用它返回的迭代器：

```javascript
var a = [1, 3, 5, 7, 9]

var it = a[Symbol.iterator]()
it.next().value // 1
it.next().value // 3
it.next().value // 5
// ...
```

前面的代码中列出了定义的 something，你可能已经注意到了这一行：

```javascript
[Symbol.iterator]: function () { return this}
```

这段有点令人疑惑的代码是将 something 的值（迭代器 something 的接口）也构建成为一个 iterable。现在它既是 iterable，也是迭代器。然后我们把 something 传给`for..of`循环：

```javascript
for (var v of something) {
  // ..
}
```

`for..of`循环期望 something 是 iterable，于是他寻找并调用它的`Symbol.iterator`函数。我们将这个函数定义为就是简单的`return this`，也就是把它自身返回，而`for..of`循环并不知情。

### 生成器迭代器

了解了迭代器的背景，让我们把注意力转回生成器上。可以把生成器看作一个值的生产者，我们通过迭代器接口的`next()`调用一次提取出一个值。

所以，严格来说，生成器本身并不是 iterable，尽管非常类似 —— 当你执行一个生成器，就得到了一个迭代器：

```javascript
function* foo() {
  // ..
}

var it = foo()
```

可以通过生成器实现前面的这个 something 无限数字序列生产者，类似这样：

```javascript
function* something() {
  var nextVal

  while (true) {
    if (nextVal === undefined) {
      nextVal = 1
    } else {
      nextVal = 3 * nextVal + 6
    }

    yield nextVal
  }
}
```

> [!NOTE]
> 通常在实际的 JS 程序中使用`while..true`循环时非常糟糕的主意，至少如果其中没有`break`或`return`的话是这样，因为它有可能会同步的无限循环，并阻塞和锁住浏览器 UI。
> 但是，如果在生成器中有`yield`的话，使用这样的循环就完全没有问题。因为生成器会在每次迭代中暂停，通过 yield 返回到主程序或事件循环队列中。简单的说就是：“生成
> 器把`while..true`带回了 JS 编程的世界！”

这样就简单明确多了，是不是？因为生成器会在每个 yield 处暂停，函数`*something()`的状态（作用域）会被保持，即意味着不需要闭包在调用之间保持变量状态。

这段代码不仅更简洁，我们不需要构造自己的迭代器接口，实际上也更合理，因为它更清晰地表达了意图。比如，`while..true`循环告诉我们这个生成器就是永远运行：
只要我们一直索要，它就会一直生成。

现在，可以通过`for..of`循环使用我们雕琢过的新的`*something()`生成器。你可以看到，其工作方式基本是相同的：

```javascript
for (var v of something()) {
  console.log(v)

  // 不要死循环！
  if (v > 500) {
    break
  }
}
// 1 9 33 105 321 969
```

但是，不要忽略了这段`for(var v of something())..`！我们并不是像前面的例子那样把 something 当作一个值来引用，而是调用了`*something()`生成器以得到
它的迭代器供`for..of`循环使用。

如果认真考虑的话，你也许会从这段生成器与循环的交互中提出两个问题。

- 为什么不能用`for(var v of something)..`？因为这里的 something 是生成器，并不是 iterable。我们需要调用`something()`来构造一个生产者供`for..of`循环迭代。

- `something()`调用产生一个迭代器，但`for..of`循环需要的是一个`iterable`，对吧？是的。生成器的迭代器也有一个`Symbol.iterator`函数，基本上这个函数做的就是`return this`，
  和我们前面定义的`iterable something`一样。换句话说，生成器的迭代器也是一个 iterable！

#### 停止生成器

在前面的例子中，看起来似乎`*something()`生成器的迭代器实例在循环中的`break`调用之后就永远留在了挂起状态。

其实有一个隐藏的特性会帮助你管理此事。`for..of`循环的“异常结束”（也就是“提前终止”），通常由`break`、`return`或者未捕获异常引起，会向生成器的迭代器发送一个信号使其终止。

> [!NOTE]
> 严格地说，在循环正常结束之后在，`for..of`循环也会向迭代器发送这个信号。对于生成器来说，这本质上是没有意义的操作，因为生成器的迭代器需要先完成`for..of`循环才能结束。
> 但是，自定义的迭代器可能会需要从`for..of`循环的消费者那里接收这个额外的信号。

尽管`for..of`循环会自动发送这个信号，但你可能会希望向一个迭代器手工发送这个信号。可以通过调用`return(..)`实现这一点。

如果在生成器内有`try..finally`语句，它将总是运行，即使生成器已经外部结束。如果需要清理资源的话（数据库连接等），这一点非常有用：

```javascript
function* something() {
  try {
    var nextVal

    while (true) {
      if (nextVal === undefined) {
        nextVal = 1
      } else {
        nextVal = 3 * nextVal + 6
      }
      yield nextVal
    }
  } finally {
    // 清理子句
    console.log('cleaning up!')
  }
}
```

之前的例子中，`for..of`循环内的 break 会触发 finally 语句。但是，也可以在外部通过`return(..)`手工终止生成器的迭代器实例：

```javascript
var it = something()

for (var v of it) {
  console.log(v)

  // 不要死循环！
  if (v > 500) {
    // 1.
    // 完成生成器的迭代器
    const res = it.return('hello world') // 先执行cleaning up!，然后返回{ value: 'hello world', done: true }
    console.log(res) // { value: 'hello world', done: true }
    // 这里不需要 break

    // 2. ------------
    // 也可以next()最后一次传递值，然后break
    // const res = it.next('done early') // 先返回{ value: 'done early', done: false }，然后执行cleaning up!
    // console.log(res) // { value: 'done early', done: false }
    // break
  }
}

// 1 9 33 105 321 969
// cleaning up!
// hello world
```

调用`it.return(..)`之后，它会立即终止生成器，这当然会运行`finally`语句。另外，它还会把返回的`value`设置为传入`return(..)`的内容，这也就是`hello world`被传出
去的过程。现在我们也不需要包含`break`语句了，因为生成器的迭代器已经被设置为`done:true`，所以`for..of`循环会再下一个迭代终止。

生成器的命名大部分源自于这种*消费生产值（consuming produced values）* 的用例。但是，这里要再次申明，这只是生成器的用法之一，坦白地说，甚至不是这本书重点关注的用途。

既然对生成器的工作机制有了更完整的理解，那接下来就可以把关注转向如何把生成器应用于异步开发了。

## 异步迭代生成器

生成器与异步编码模式及解决回调问题等，有什么关系呢？让我们来回答这个重要的问题。

我们应该重新讨论第三章中的一个场景。回想一下回调方法：

```javascript
function foo(x, y, cb) {
  ajax('http://some.url.1/?x=' + x + '&y=' + y, cb)
}

foo(11, 31, function (err, text) {
  if (err) {
    console.error(err)
  } else {
    console.log(text)
  }
})
```

如果想要通过生成器来表达同样的任务流程控制，可以这样实现：

```javascript
function foo(x, y) {
  ajax('http://some.url.1/?x=' + x + '&y=' + y, function (err, data) {
    if (err) {
      // 向*main()抛出一个错误
      it.throw(err)
    } else {
      // 用收到的data恢复*main()
      it.next(data) // { value: undefined, done: true }
    }
  })
}

function* main() {
  try {
    var text = yield foo(11, 31)
    console.log(text)
  } catch (err) {
    console.error(err)
  }
}

var it = main()

// 这里启动！
it.next() // { value: undefined, done: false }
```

第一眼看上去，与之前的回调代码对比起来，这段代码更长一些，可能也更复杂一些。但是，不要被表面现象欺骗了！生成器代码实际上要好得多！不过解释这一点还是比较复杂的。

首先，让我们查看一下最重要的这段代码：

```javascript
// prettier-ignore
var text = yield foo(11, 31)
console.log(text)
```

请先花点时间思考一下这段代码是如何工作的。我们调用了一个普通函数`foo(..)`，而且显然能够从 Ajax 调用中得到 text，即使它是异步的。

这怎么可能呢？如果你回想一下第 1 章的开始部分的话，我们给出了几乎相同的代码：

```javascript
var data = ajax('..url 1..')
console.log(data)
```

但是，这段代码不能工作！你能指出其中的区别吗？区别就在于生成器中使用的`yield`。

这就是奥秘所在！正是这一点使得我们看似阻塞同步的代码，实际上并不会阻塞整个程序，它只是暂停或阻塞了生成器本身的代码。

在`yield foo(11, 31)`中，首先调用`foo(11, 31)`，它没有返回值（即返回 undefined），所以我们发出了一个调用来请求数据，但实际上之后做的是`yield undefined`。
这没问题，因为这段代码当前并不依赖`yield`出来的值来做任何事情。本章后面会再次讨论这一点。

这里并不是在消息传递的意义上使用`yield`，而是将其用于流程控制实现暂停/阻塞。实际上，它还是会有消息传递，但只是生成器恢复运行之后的单项消息传递。

所以，生成器在`yield`处暂停，本质上是在提出一个问题：“我应该返回什么值来赋给变量 text？”谁来回答这问题呢?

看一下`foo(..)`。如果这个 Ajax 请求成功，我们调用:

```javascript
it.next(data)
```

这会用响应数据恢复生成器，意味着我们暂停的`yield`表达式直接接收到了这个值。然后随着生成器代码继续运行，这个值被赋给局部变量 text。

很酷吧？

回头往前看一步，思考一下这意味着什么。我们在生成器内部有了看似完全同步的代码（除了 yield 关键字本身），但隐藏在背后的是，在`foo(..)`内的运行可以完全异步。

这是巨大的改进！对于我们前面陈述的回调无法以顺序同步的、符合我们大脑思考模式的方式表达异步这个问题，这是一个近乎完美地解决方案。

从本质上而言，我们把异步作为实现细节抽象了出去，使得我们可以以同步顺序的形式追踪流程控制：“发出一个 Ajax 请求，等它完成之后打印出响应结果。”并且，当然，我们
只在这个流程控制中表达了两个步骤，而这种表达能力是可以无限扩展的，以便我们无论需要多少步骤都可以表达。

> [!TIP]
> 这是一个很重要的领悟，回过头去把上面三段重读一遍，让它融入你的思想吧。

### 同步错误处理

前面的生成器代码甚至还给我们带来了更多其它的好处。让我们把注意力转移到生成器内部的`try..catch`：

```javascript
try {
  var text = yield foo(11, 31)
  console.log(text)
} catch (err) {
  console.error(err)
}
```

这是如何工作的呢？调用`foo(..)`是异步完成的，难道`try..catch`不是无法捕获异步错误，就像我们在第 3 章中看到的一样吗？

我们已经看到`yield`是如何让赋值语句暂停来等待`foo(..)`完成，使得响应完成后可以被赋给`text`。精彩的部分在于`yield`暂停也使得生成器能够捕获错误。通过这段前面列出的
代码把错误抛出到生成器中：

```javascript
if (err) {
  // 向*main()抛出一个错误
  it.throw(err)
}
```

生成器`yield`暂停的特性意味着我们不仅能够从异步函数调用得到看似同步的返回值，还可以同步捕获来自这些异步函数调用的错误！

所以我们已经知道，我们可以把错误抛入生成器中，不过如果是从生成器向外抛出错误呢？正如你所料：

```javascript
function* main() {
  var x = yield 'hello world'

  yield x.toLowerCase() // 引发一个异常！
}

var it = main()

it.next() // hello world

try {
  it.next(42)
} catch (err) {
  console.error(err) // TypeError: x.toLowerCase is not a function
}
```

当然，也可以通过`throw..`手工抛出一个错误，而不是通过触发异常。

甚至可以捕获通过`throw(..)`抛入生成器的同一个错误，基本上也就是给生成器一个处理它的机会；如果没有处理的话，迭代器代码就必须处理：

```javascript
function* main() {
  var x = yield 'hello world'

  // 永远不会到达这里
  console.log(x)
}

var it = main()

it.next()

try {
  // *main()会处理这个错误吗？看看吧？
  it.throw('Oops')
} catch (e) {
  // 不行，没有处理！
  console.error(e) // Oops
}
```

在异步代码中实现看似同步的错误处理（通过`try..catch`）在可读性和合理性方面都是一个巨大进步。

## 生成器+Promise

在前面的讨论中，我们展示了如何异步迭代生成器，这是一团乱麻似的回调在顺序性和合理性方面的巨大进步。但我们错失了很重要的两点：Promise 的可信任性和可组合性（参见第三章）！

别担心，我们还会重获这些。ES6 中最完美的世界就是生成器（看似同步的异步代码）和 Promise（可信任可组合）的结合。

但如何实现呢？

回想一下第三章里在运行 Ajax 例子中基于 Promise 的实现方法：

```javascript
function foo(x, y) {
  return request('http://some.url.1/?x=' + x + '&y=' + y)
}

foo(11, 31).then(
  function (text) {
    console.log(text)
  },
  function (err) {
    console.error(err)
  }
)
```

在前面的运行 Ajax 例子的生成器代码中，`foo(..)`没有返回值（undefined），并且我们的迭代器控制代码并不关心`yield`出来的值。

而这里支持 Promise 的`foo(..)`在发出 Ajax 调用之后返回了一个 promise。这暗示我们可以通过`foo(..)`构建一个 promise，然后通过生成器把它`yield`出来，然后迭代器控制代码
就可以接受到这个 promise 了。

但迭代器应该对这个 promise 做些什么呢？

他应该侦听这个 promise 的决议（完成或拒绝），然后要么使用完成消息恢复生成器运行，要么向生成器抛出一个带有拒绝原因的错误。

我再重复一遍，因为这一点非常重要。获得 Promise 和生成器最大效用的最自然的方法就是`yield`出来一个 Promise，然后通过这个 Promise 来控制生成器的迭代器。

让我们来试一下！首先，把支持 Promise 的`foo(..)`和生成器`*main()`放在一起：

```javascript
function foo(x, y) {
  return request('http://some.url.1/?x=' + x + '&y=' + y)
}

function* main() {
  try {
    var text = yield foo(11, 31)
  } catch (e) {
    console.error(e)
  }
}
```

这次重构代码中最有力的发现是，`*main()`之中的代码完全不需要改变！在生成器内部，不管什么值`yield`出来，都只是一个透明的实现细节，所以我们甚至没有意识到其发生，也不需要关心。

但现在如何运行`*main()`呢？还有一些实现细节需要补充，来实现接收和连接`yield`出来的 promise，使它能够在决议之后恢复生成器。先从手工实现开始：

```javascript
var it = main()

var p = it.next().value

// 等待promise p决议
p.then(
  function (text) {
    it.next(text)
  },
  function (err) {
    it.throw(err)
  }
)
```

实际上，这并没有那么令人痛苦，对吧？

这段代码看起来应该和我们前面手工组合通过`error-first`回调控制的生成器非常类似。除了没有`if(err){it.throw..}`，promise 已经为我们分离了完成（成功）和拒绝（失败），
否则的话，迭代器控制是完全一样的。

现在，我们已经隐藏了一些重要的细节。

最重要的是，我们利用了已知`*main()`中只有一个需要支持 Promise 的步骤这一事实。如果想要能够实现 Promise 驱动的生成器，不管其内部有多少个步骤呢？我们当然不希望每
个生成器手工编写不同的 Promise 链！如果有一种方法可以实现重复（即循环）迭代控制，每次会生成一个 Promise，等待决议后再继续，那该多好啊。

还有，如果在`it.next(..)`调用过程中生成器（有意或无意）抛出一个错误会怎样呢？是应该退出呢，还是应该捕获这个错误并发送回去呢？类似的，如果通过`it.throw(..)`
把一个 Promise 拒绝抛入生成器中，但它却没有受到处理就直接抛回了呢？

### 支持 Promise 的 Generator Runner

随着对这条道路的深入探索，你越来越意识到：“哇，如果有某个工具为我实现这些就好了。”关于这一点，你绝对没错。这是如此重要的一个模式，你绝对不希望搞错（或精疲力竭
的一次又一次重复实现），所以最好是使用专门设计用来以我们前面展示的方式运行`Promise-yielding`生成器的工具。

有几个 Promise 抽象库提供了这样的工具，包括我的 asynquence 库及其`runner(..)`，本部分的附录 A 中会介绍。

但是，为了学习和展示的目的，我们还是自己定义一个独立工具，叫做`run(..)`：

```javascript
// 在此感谢Benjamin Gruenbaum（@benjamingr on GitHub）的巨大改进！

function run(gen) {
  var args = [].slice.call(arguments, 1),
    it

  // 在当前上下文中初始化生成器
  it = gen.apply(this, args)

  // 返回一个promise用于生成器完成
  return Promise.resolve().then(function handleNext(value) {
    // 运行至下一个yield出的值
    var next = it.next(value)
    return (function handleResult(next) {
      // 生成器运行完毕了吗？
      if (next.done) {
        return next.value
      } else {
        // 否则继续运行
        return Promise.resolve(next.value).then(
          // 成功就恢复异步循环，把决议的值发回生成器
          handleNext,
          // 如果value是被拒绝的promise，
          // 就把错误传回生成器进行出错处理
          function handleErr(err) {
            return Promise.resolve(it.throw(err)).then(handleResult)
          }
        )
      }
    })(next)
  })
}
```

诚如所见，你可能并不愿意编写这个复杂的工具，并且也会特别不希望为每个使用的生成器都重复这段代码。所以，一个工具或库中的辅助函数绝对是必要的。尽管如此，我还是
建议你花费几分钟时间学习这段代码，以更好地理解生成器 + Promise 协同运作模式。

如果在运行 Ajax 的例子中使用`run(..)`和`*main()`呢？

```javascript
function *main(){
    / ..
}
run(main)
```

> [!NOTE]
> 我们定义的`run(..)`返回一个 promise，一旦生成器完成，这个 promise 就会决议，或收到一个生成器没有处理的未捕获异常。这里并没有展示这种功能，但我们会在本章后面部分再介绍这一点。

#### ES7:async 与 await？

前面的模式 —— 生成器 yield 出 Promise，然后这个 Promise 控制生成器的迭代器来执行它，直到结束 —— 是非常强大有用的一种方法。如果我们能够无需库工具辅助函数（即`run(..)`）
就能实现就好了。

关于这一点，可能有一些好消息。在编写本书的时候，对于后 ES6、ES7 的时间框架，在这一方面增加语法支持的提案已经有了一些初期但很强势的支持。显然，现在确定细节还太早，
但其形式很可能会类似如下：

```javascript
function foo(x, y) {
  return request('http://some.url.1/?x=' + x + '&y=' + y)
}
async function main() {
  try {
    var text = await foo(11, 31)
    console.log(text)
  } catch (e) {
    console.error(e)
  }
}

main()
```

可以看到，这里没有通过`run(..)`调用（意味着不需要库工具！）来触发和驱动`main()`，它只是被当作一个普通函数调用。另外，`main()`也不再声明为生成器函数了，它现在是
一类新的函数：async 函数。最后，我们不再 yield 出 Promise，而是用 await 等待它决议。

如果你 await 了一个 Promise，async 函数就会自动获知要做什么，它会暂停这个函数（就像生成器一样），直到 Promise 决议。我们并没有在这段代码中展示这一点，但是调用一个像`main()`
这样的 async 函数会自动返回一个 promise。在函数完全结束之后，这个 promise 会决议。

> [!TIP]
> 有 C#经验的人可能很熟悉 async/await 语法，因为它们基本上是相同的。

从本质上说，这个提案就是把前面我们已经推导出来的模式写进规范，使其进入语法机制：组合 Promise 和看似同步的流程控制代码。这是两个最好的世界的结合，有效的
实际解决了我们列出的回调方案的主要问题。

这样的 ES7 提案已经存在，并有了初期的支持和热情，仅仅是这个事实就极大增加了这个异步模式对其未来重要性的信心。

### 生成器中的 Promise 并发

到目前为止，我们已经展示的都是 Promise+生成器下的单步异步流程。但是，现实世界中的代码常常会有多个异步步骤。

如果不认真对待的话，生成器的这种看似同步的风格可能会让你陷入对自己异步并发组织方式的自满中，进而导致并不理想的性能模式。所以我们打算花点时间来研究一下各种方案。

想想这样一个场景：你需要从两个不同的来源获取数据，然后把响应组合在一起形成第三个请求，最终把最后一条响应打印出来。第三章已经用 Promise 研究过一个类似的场景，但是
让我们在生成器的环境下重新思考一下这个问题吧。

你的第一直觉可能类似如下：

```javascript
function* foo() {
  var r1 = yield request('http://some.url.1')
  var r2 = yield request('http://some.url.2')

  var r3 = yield request('http://some.url.3/?v=' + r1 + ',' + r2)

  console.log(r3)
}

// 使用前面定义的工具run(..)
run(foo)
```

这段代码可以工作，但是针对我们特定的场景而言，它并不是最优的。你能指出原因吗？

因为请求`r1`和`r2`能够 —— 出于性能考虑也应该 —— 并发执行，但是在这段代码中，它们是一次执行的。直到请求 URL"http://some.url.1"完成后才通过Ajax获取URL"http://some.url.2"。
这两个请求是相互独立的，所以性能更高的方案应该是让它们同时运行。

但是，到底如何通过生成器和 yield 实现这一点呢？我们知道 yield 只是代码中一个单独的暂停点，并不可能同时在两个点上暂停。

最自然有效的答案就是让异步流程基于 Promise，特别是基于它们时间无关的方式管理状态的能力（参见第三章“未来的值”）。

最简单的方法：

```javascript
function* foo() {
  // 让两个请求“并行”
  var p1 = request('http://some.url.1')
  var p2 = request('http://some.url.2')

  // 等待p1和p2都决议
  var r1 = yield p1
  var r2 = yield p2

  var r3 = yield request('http://some.url.3/?v=' + r1 + ',' + r2)
  console.log(r3)
}

// 使用前面定义的工具run(..)
run(foo)
```

为什么这和前面的代码片段不同呢？观察一下 yield 的位置。p1 和 p2 是并发执行（即“并行”）的用 Ajax 请求的 promise。哪一个先完成都无所谓，因为 promise
会按照需要在决议状态保持任意长时间。

然后我们使用接下来的 yield 语句等待并取得 promise 的决议（分别写入 r1 和 r2）。如果 p1 先决议，那么`yield p1`就会先恢复执行，然后等待`yield p2`恢复。如果 p2 先决议，它就会耐心
保持其决议值等待请求，但是`yield p1`将会先等待，直到 p1 决议。

不管哪种情况，p1 和 p2 都会并发执行，无论完成顺序如何，两者都要全部完成，然后才会发出`r3 = yield request(..)`Ajax 请求。

这种流程控制模型如果听起来有点熟悉的话，是因为这基本上和我们在第三章中通过`Promise.all([ .. ])`工具实现的 gate 模式相同。因此，也可以这样表达这种控制流程：

```javascript
function* foo() {
  // 让两个请求“并行”，并等待两个promise都决议
  var results = yield Promise.all([request('http://some.url.1'), request('http://some.url.2')])

  var r1 = results[0]
  var r2 = results[1]

  var r3 = yield request('http://some.url.3/?v=' + r1 + ',' + r2)
  console.log(r3)
}

// 使用前面定义的工具run(..)
run(foo)
```

> [!NOTE]
> 就像我们在第三章中讨论过的，我们甚至可以通过 ES6 解构赋值，把`var r1 = ..`和`var r2 = ..`赋值语句简化为`var [r1,r2] = results`。

换句话说，Promise 所有的并发能力在生成器+Promise 方法中都可以使用。所以无论在什么地方你的需求超过了顺序的`this-then-that`异步流程控制，Promise 很可能都是最好的选择。

#### 隐藏的 Promise

作为一个风格方面的提醒：要注意你的*生成器*内部包含了多少 Promise 逻辑。我们介绍的使用生成器实现异步的方法的全部要点在于创建简单、顺序、看似同步的代码，将异步的细节尽可能隐藏起来。

比如，这可能是一个更简洁的方案：

```javascript
// 注：普通函数，不是生成器
function bar(url1, url2) {
  return Promise.all([request(url1), request(url2)])
}

function* foo() {
  // 隐藏bar(..)内部基于Promise的并发细节
  var results = yield bar('http://some.url.1', 'http://some.url.2')

  var r1 = results[0]
  var r2 = results[1]

  var r3 = yield request('http://some.url.3/?v=' + r1 + ',' + r2)
  console.log(r3)
}
// 使用前面定义的工具run(..)
run(foo)
```

在`*foo()`内部，我们所做的一切就是要求`bar(..)`给我们一些 results，并通过 yield 来等待结果，这样更简洁也更清晰。我们不需要关心在底层是用`Promise.all([ .. ])`
Promise 组合来实现这一切。

我们把异步，实际上是 Promise，作为一个实现细节来看待。

如果想要实现一系列高级流程控制的话，那么非常有用的做法是：把你的 Promise 逻辑隐藏在一个只从生成器代码中调用的函数内部。比如：

```javascript
// prettier-ignore
function bar(){
    Promise.all([
        baz(..).then(..),
        Promise.race([ .. ])
    ]).then(..)
}
```

有时候会需要这种逻辑，而如果把它直接放在生成器内部的话，那你就失去了几乎所有一开始使用生成器的理由。应该有意将这样的细节从生成器代码中抽象出来，以避免
它把高层次的任务表达变得杂乱。

创建代码除了要实现功能和保持性能之外，你还应该尽可能使代码易于理解和维护。

> [!NOTE]
> 对编程来说，抽象并不总是好事，很多时候它会增加复杂度以换取简洁性。但是在这个例子里，我相信，对生成器+Promise 异步代码来说，相比于其他实现，
> 这种抽象更加健康。尽管如此，还是建议大家要注意具体情况具体分析，为你和你的团队做出正确的决定。

## 生成器委托

在前面一节中，我们展示了从生成器内部调用常规函数，以及这如何对于把实现细节（就像异步 Promise 流）抽象出去还是一种有用的技术。但是，用普通函数实现这个任务的主要缺点是
它必须遵守普通函数的规则，也就意味着它不能像生成器一样用 yield 暂停自己。

可能出现的情况是，你可能会从一个生成器调用另一个生成器，使用辅助函数`run(..)`，就像这样：

```javascript
function* foo() {
  var r2 = yield request('http://some.url.2')
  var r3 = yield request('http://some.url.3/?v=' + r2)
  return r3
}

function* bar() {
  var r1 = yield request('http://some.url.1')

  // 通过run(..)委托给foo()
  var r3 = yield run(foo)

  console.log(r1, r3)
}

run(bar)
```

我们再次通过`run(..)`工具从`*bar()`内部运行`*foo()`。这里我们利用了如下事实：我们前面定义的`run(..)`返回一个 promise，这个 promise 在生成器运行结束时（或出错退出时）
决议。因此，如果从一个`run(..)`调用中 yield 出来一个 promise 到另一个`run(..)`实例中，它会自动暂停`*bar()`，直到`*foo()`结束。

但其实还有一个更好的方法可以实现从`*bar()`调用`*foo()`，称为 yield 委托。yield 委托的具体语法是：`yield*` —— （注意多出来的`*`）。在我们弄清
它在前面的的例子中的使用之前，先来看一个简单点的场景：

```javascript
function* foo() {
  console.log('*foo() starting')
  yield 3
  yield 4
  console.log('*foo() finished')
}

function* bar() {
  yield 1
  yield 2
  yield* foo() // yield委托
  yield 5
}

var it = bar()
it.next().value // 1
it.next().value // 2
it.next().value // *foo() starting 3
it.next().value // 4
it.next().value // *foo() finished 5
```

> [!NOTE]
> 在本章前面的一条提示中，我解释了为什么更喜欢`function *foo()..`而不是`function* foo()..`。类似的，我也更喜欢 —— 与这个主题的多数其他文档不同 —— 使用`yield *foo()`
> 而不是`yield* foo()`。`*`的位置仅关乎风格，由你自己来决定使用哪种。不过我发现保持风格一致是很吸引人的。

这里的`yield *foo()`委托是如何工作的呢？

首先，和我们以前看到的完全一样，调用`foo()`创建一个迭代器。然后`yield *`把迭代器实例控制（当前`*bar()`生成器的）委托给/转移到了另一个`*foo()`迭代器。

所以，前面两个`it.next()`调用控制的是`*bar()`。但当我们发出第三个`it.next()`调用时，`*foo()`现在启动了，我们现在控制的是`*foo()`而不是`*bar()`。
这也是为什么这被称为委托：`*bar()`把自己的迭代控制委托给了`*foo()`。

一旦 it 迭代器控制消耗了整个`*foo()`迭代器，it 就会自动转回控制`*bar()`。

现在回到前面使用三个顺序 Ajax 请求的例子：

```javascript
function* foo() {
  var r2 = yield request('http://some.url.2')
  var r3 = yield request('http://some.url.3/?v=' + r2)
  return r3
}

function* bar() {
  var r1 = yield request('http://some.url.1')

  // 通过yield*委托给foo()
  var r3 = yield* foo()
  console.log(r1, r3)
}

run(bar)
```

这段代码和前面版本的唯一区别就在于使用了`yield *foo()`，而不是前面的`yield run(foo)`。

> [!NOTE]

> `yield *`暂停了迭代控制，而不是生成器控制。当你调用`*foo()`生成器时，现在 yield 委托到了它的迭代器。但实际上，你可以 yield 委托到任意 iterable，
> `yield *[1,2,3]`会消耗数组值[1,2,3]的默认迭代器。

### 为什么用委托

yield 委托的主要目的是代码组织，以达到与普通函数调用的对称。

想象一下有两个模块分别提供了方法`foo()`和`bar()`，其中`bar()`调用了`foo()`。一般来说，把两者分开实现的原因是该程序的适当的代码组织要求它们位于不同的函数中。
比如，可能有些情况下是单独调用`foo()`，另外一些地方则由`bar()`调用`foo()`。

同样是出于这些原因，保持生成器分离有助于程序的可读性、可维护性和可调试性。在这一方面，`yield *`是一个语法上的缩写，用于代替手工在`*foo()`的步骤上迭代，不过是在`*bar()`内部。

如果`*foo()`内的步骤是异步的话，这样的手工方法将会特别复杂，这也是你可能需要使用`run(..)`工具来做某些事情的原因。就像我们已经展示的，`yield *foo()`消除了
对`run(..)`工具的需要（就像`fun(foo)`）。

### 消息委托

你可能会疑惑，这个 yield 委托是如何不只用于迭代器控制工作，也用于双向消息传递工作的呢。认真跟踪下面的通过 yield 委托实现的消息流出入：

```javascript
function* foo() {
  console.log('inside *foo():', yield 'B')

  console.log('inside *foo():', yield 'C')

  return 'D'
}

function* bar() {
  console.log('inside *bar():', yield 'A')

  // yield委托！
  console.log('inside *bar():', yield* foo())

  console.log('inside *bar():', yield 'E')

  return 'F'
}

var it = bar()

console.log('outside:', it.next().value)
// outside: A

console.log('outside:', it.next(1).value)
// inside *bar(): 1
// outside: B

console.log('outside:', it.next(2).value)
// inside *foo(): 2
// outside: C

console.log('outside:', it.next(3).value)
// inside *foo(): 3
// inside *bar(): D
// outside: E

console.log('outside:', it.next(4).value)
// inside *bar(): 4
// outside: F
```

要特别注意`it.next(3)`调用之后的执行步骤。

1. 值 3（通过`*bar()`内部的 yield 委托）传入等待的`*foo()`内部的`yield 'C'`表达式。

2. 然后`*foo()`调用`return 'D'`，但是这个值并没有一直返回到外部的`it.next(3)`调用。

3. 取而代之的是，值`'D'`作为`*bar()`内部等待的`yield* foo()`表达式的结果发出 —— 这个 yield 委托本质上在所有的`*foo()`完成之前是暂停的。所以`'D'`
   成为`*bar()`内部的最后结果，并被打印出来。

4. `yield 'E'`在`*bar()`内部调用，值`'E'`作为`it.next(3)`调用的结果被 yield 发出。

从外层的迭代器（it）角度来说，是控制最开始的生成器还是控制委托的那个，没有任何区别。

实际上，yield 委托甚至并不要求必须转到另一个生成器，它可以转到一个非生成器的一般 iterable。比如：

```javascript
function* bar() {
  console.log('inside *bar():', yield 'A')

  // yield委托给非生成器！
  console.log('inside *bar():', yield ['B', 'C', 'D'])

  console.log('inside *bar():', yield 'E')

  return 'F'
}

var it = bar()

console.log('outside:', it.next().value)
// outside: A

console.log('outside:', it.next(1).value)
// inside *bar(): 1
// outside: B

console.log('outside:', it.next(2).value)
// outside: C

console.log('outside:', it.next(3).value)
// outside: D

console.log('outside:', it.next(4).value)
// inside *bar(): 4
// outside: E

console.log('outside:', it.next(5).value)
// inside *bar(): 5
// outside: F
```

注意这个例子和之前那个例子在消息接收位置和报告位置上的区别。

最显著的是，默认的数组迭代器并不关心通过`next(..)`调用发送的任何信息，所以值 2、3 和 4 根本就被忽略了。还有，因为迭代器没有显式的返回值（和前面使用的`*foo()`不同），
所以`yield *`表达式完成后得到的是一个`undefined`。

#### 异常也被委托！

和 yield 委托透明的双向传递消息一样，错误和异常也是双向传递的：

```javascript
function* foo() {
  try {
    yield 'B'
  } catch (e) {
    console.log('inside *foo() caught:', e)
  }

  yield 'C'

  throw 'D'
}

function* bar() {
  yield 'A'

  try {
    yield* foo()
  } catch (e) {
    console.log('error caught inside *bar() :', e)
  }

  yield 'E'

  yield* baz()

  // 不会到达这里
  yield 'G'
}

function* baz() {
  throw 'F'
}

var it = bar()

console.log('outside:', it.next().value)
// outside: A

console.log('outside:', it.next(1).value)
// outside: B

console.log('outside:', it.throw(2).value)
// inside *foo() caught: 2
// outside: C

console.log('outside:', it.throw(3).value)
// error caught inside *bar() : D
// outside: E

try {
  console.log('outside:', it.next(4).value)
} catch (e) {
  console.log('error caught outside:', e)
  // error caught outside: F
}
```

这段代码中需要注意以下几点。

1. 调用`it.throw(2)`时，它会发送错误消息 2 到`*bar()`，它又将其委托给`*foo()`，后者捕获并处理它。然后，`yield 'C'`把`'C'`发送回去作为`it.throw(2)`调用返回的 value。

2. 接下来从`*foo()`内 throw 出来的值`'D'`传播到`*bar()`，这个函数捕获并处理它。然后`yield 'E'`把`'E'`发送回去作为`it.next(3)`调用返回的 value。

3. 然后，从`*baz()`throw 出来的异常并没有在`*bar()`内被捕获 —— 所以`*baz()`和`*bar()`都被设置为完成状态。这段代码之后，就再也无法通过任何后续的`next(..)`
   调用得到`'G'`，`next(..)`调用只会给 value 返回 undefined。

### 异步委托

我们终于回到前面的多个顺序 Ajax 请求的 yield 委托例子：

```javascript
function* foo() {
  var r2 = yield request('http://some.url.2')
  var r3 = yield request('http://some.url.3/?v=' + r2)
  return r3
}

function* bar() {
  var r1 = yield request('http://some.url.1')

  var r3 = yield* foo()
  console.log(r1, r3)
}

run(bar)
```

这里我们在`*bar()`内部没有调用`yield fun(foo)`，而是调用`yield *foo()`。

在这个例子之前的版本中，使用 Promise 机制（通过`run(..)`控制）把值从`*foo()`内的`return r3`传递给`*bar()`中的局部变量 r3。现在，这个值通过`yield *`机制直接返回。

除此之外的行为非常相似。

### 递归委托

当然，yield 委托可以跟踪任意多委托步骤，只要你把它们连在一起。甚至可以使用 yield 委托实现异步的生成器*递归*，即一个 yield 委托到它自身的生成器：

```javascript
function* foo(val) {
  if (val > 1) {
    // 生成器递归
    val = yield* foo(val - 1)
  }

  return yield request('http://some.url/?v=' + val)
}

function* bar() {
  var r1 = yield* foo(3)
  console.log(r1)
}

run(bar)
```

> [!NOTE]
>
> `run(..)`工具可以通过`run(foo, 3)`调用，因为它支持额外的参数和生成器一起传入。但是，这里使用了没有参数的`*bar()`，以展示`yield *`的灵活性。

这段代码后面的处理步骤是怎样的呢？坚持一下，接下来的细节描述可能会非常复杂。

1. `run(bar)`启动生成器`*bar()`。

2. `foo(3)`创建了一个`*foo(..)`的迭代器，并传入 3 作为其参数 val。

3. 因为`3 > 1`，所以`foo(2)`创建了另一个迭代器，并传入 2 作为其参数 val。

4. 因为`2 > 1`，所以`foo(1)`创建了另一个新迭代器，并传入 1 作为其参数 val。

5. 因为`1 > 1`不成立，所以接下来以 1 调用`request(..)`，并从这第一个 Ajax 调用得到一个 promise。

6. 这个 promise 通过 yield 传出，回到`*foo(2)`生成器实例。

7. `yield *`把这个 promise 传出回到`*foo(3)`生成器实例。另一个`yield *`把这个 promise 传出回到`*bar()`生成器实例。再有一个`yield *`把这个 promise 传出回到`rim(..)`工具，
   这个工具会等待这个 promise（第一个 Ajax 请求的处理。）

8. 这个 promise 决议后，它的完成消息会发送出来恢复`*bar()`；后者通过`yield *`转入`*foo(3)`实例；后者接着通过`yield *`传入`*foo(2)`生成器实例；后者在接着
   通过`yield *`转入`*foo(3)`生成器实例内部的等待着的普通 yield。

9. 第一个调用的 Ajax 响应现在立即从`*foo(3)`生成器实例中返回。这个实例把值作为`*foo(2)`实例中`yield *`表达式的结果返回，赋给它的局部变量 val。

10. 在`*foo(2)`中，通过`request(..)`发送了第二个 Ajax 请求。它的 promise 通过 yield 发回给`*foo(1)`实例，然后通过`yield *`一路传递到`run(..)`（再次进行步骤 7）。这个 promise
    决议后，第二个 Ajax 响应一路传播回到`*foo(2)`生成器实例，赋给它的局部变量 val。

11. 最后，通过`request(..)`发出第三个 Ajax 请求，它的 promise 传出到`run(..)`，然后它的决议值一路返回，然后 return 返回到`*bar()`中等待的`yield *`表达式。

噫！这么多疯狂的脑力杂耍，是不是？这一部分你可能需要多读几次，然后吃点零食让大脑保持清醒！
