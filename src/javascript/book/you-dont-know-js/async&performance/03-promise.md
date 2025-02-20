# :zzz:

[《你不知道的 JavaScript》](https://github.com/ZXheart/You-Dont-Know-JS/blob/1ed-zh-CN/async%20%26%20performance/ch3.md)

# promises

在第二章中，我们定位了在使用回调表达程序异步性能和管理并发的两个主要类别的不足：缺乏顺序性和缺乏可靠性。既然我们对问题有了更深入的理解，那么是时候将我们的注意力转向能够解决这些问题的模式了。

我们首先想要解决的是*控制反转*问题，信任是如此脆弱而且是如此的容易丢失。

回想一下，我们将我们的程序的延续包装进一个回调函数中，将这个回调交给另一个团体（甚至可能是外部代码），并双手合十祈祷它会做正确的事情并调用这个回调。

我们这么做是因为我们想说，“这是*将来*要发生的事，在当前的步骤完成之后。”

但是如果我们能够反向倒转这种*控制反转*呢？如果不是将我们程序的延续交给另一个团体，而是希望它返回给我们一个可以知道它何时完成的能力，然后我们的代码可以决定下一步做什么呢？

这个规范被称为**Promise**。

Promise 正在像风暴一样席卷 JS 世界，因为开发者和语言规范作者之流拼命的想要在他们的代码/设计中结束回调地狱的疯狂。事实上，大多数新被加入 JS/DOM 平台的异步 API 都是建立在 Promise 之上的。
所以深入学习它们可能是个好主意，你不这么认为吗？

> [!NOTE]
> “立即”这个词将在本章频繁使用，一般来说它指代一些 Promise 解析行为。然而，本质上在所有情况下，“立即”意味着就工作（Job）队列行为（参见第一章）而言，不是严格同步的*现在*的感觉。

## 什么是 Promise？

当开发者们决定要学习一种新技术或模式的时候，他们的第一步总是“给我看代码！”。摸着石头过河对我们来讲是十分自然的。

但事实上仅仅考察 API 就会丢失很多抽象细节。Promise 是这样一种工具：从人们使用它的方式来看，很容易分辨他们是否理解它的用途和作用，还是仅仅学习和使用 API 而已。

所以在我展示 Promise 的代码之前，我想在概念上完整的解释一下 Promise 到底是什么。我希望这能更好的指引你探索如何将 Promise 理论整合到你自己的异步流程中。

带着这样的想法，让我们来看两种类比，来解释 Promise 是什么。

### 未来的值

想像这样的场景：我走到快餐店的柜台前，点了一个芝士汉堡。递给收银员 1.47 美元。通过点餐和付款，我为得到一个*值*（芝士汉堡）制造了一个请求。我发起了一个交易。

但是通常来说，芝士汉堡不会立即到我手中。收银员交给我一些东西代替我的芝士汉堡：一个带有点餐排队号的收据。这个点餐号是一个“我欠你”的承诺（Promise），它保证我最终会得到我的芝士汉堡。

于是我就拿着我的收据和点餐号。我知道它代表我的*未来的芝士汉堡*，所以我无需再担心它 —— 除了现在我还在挨饿！

在我等待的时候，我可以做其他的事情，比如我给我的朋友发短信说，“嘿，一块儿吃午餐吗？我正要吃芝士汉堡”。

我已经在用我的*未来的芝士汉堡*进行推理了，即便它还没有到我手中，我的大脑可以这么做是因为它将点餐号作为芝士汉堡的占位符号。从本质上讲，这个占位符号使这个值*与时间无关*。它是一个**未来的值**。

最终，我听到，“113 号！”。于是我愉快的拿着收据走到柜台前。我把收据给收银员，拿回我的芝士汉堡。

换句话说，一旦我的*未来的值*准备好，我就用我的承诺值换回值本身。

但还有另外一种可能的输出。他们叫我的号，但当我去取芝士汉堡时，收银员遗憾地告诉我，“对不起，看起来我们的芝士汉堡卖光了。”把这种场景下顾客有多沮丧放到一边，
我们可以看到*未来的值*的一个重要性质：它们既可以表示成功也可以表示失败。

每次我点芝士汉堡时，我都知道我要么最终得到一个芝士汉堡，要么得到芝士汉堡卖光的坏消息，并且不得不考虑中午吃点儿别的东西。

> [!NOTE]
> 在代码中，事情没有这么简单，因为还隐含着一种点餐号永远也不会被叫到的情况，这时我们就被搁置在了一种无限等待的未决议状态。我们待会儿再回头处理这种情况。

#### 现在和将来的值

这一切也许听起来在思维上太过抽象而不能实施在你的代码中。那么，让我们更具体一些。

然而，在我们能介绍 Promise 是如何以这种方式工作之前，我们先看看我们已经明白的代码 —— 回调！ —— 是如何处理这些*未来值*的。

在你写代码来得到某个值时，比如在一个`number`上进行数学操作，不论你是否意识到，对于这个值你已经做了某些基本的假设 —— 这个值已经是一个具体的的*现在*值：

<!-- prettier-ignore -->
```javascript
var x, y = 2

console.log(x + y) // NaN  <-- 因为`x`还没有被赋值
```

运算`x + y`操作假定`x`和`y`都已经被设定好了。用我们一会将要阐述的术语来讲，我们假定`x`和`y`的值已经被*决议（resolve）* 了。

期盼`+`操作符本身能够魔法般的检测并等待`x`和`y`的值被决议（也就是准备好），然后才进行操作是没有意义的。如果有些语句*现在*完成而其他的*将来*完成，这就会在程序中造成混乱，对吧？

如果两个语句中的一个（或两者同时）可能还没有完成，你如何才能推断它们的关系呢？如果语句 2 要依赖语句 1 的完成，那么这里仅有两种输出：不是语句 1 *现在*立即完成而且一切处理正常进行，
就是语句 1 还没有完成，所以语句 2 将会失败。

如果这些东西听起来很像第一章的内容，很好！

回到我们的`x + y`的数学操作。想象有一种方法可以说，“将`x`和`y`相加，但如果它们中任意一个还没有被设置，就等到它们都被设置。尽快将它们相加。”

你的大脑也许想到了回调。好吧，那么...

```javascript
function add(getX, getY, cb) {
  var x, y
  getX(function (xVal) {
    x = xVal
    // 两者都准备好了？
    if (y != undefined) {
      cb(x + y) // 发送加法的结果
    }
  })

  getY(function (yVal) {
    y = yVal
    // 两者都准备好了？
    if (x != undefined) {
      cb(x + y) // 发送加法的结果
    }
  })
}

// `fetchX()` 和 `fetchY()` 是同步或异步的函数
add(fetchX, fetchY, function (sum) {
  console.log(sum) // 很简单吧？
})
```

花点儿时间来感受下一段代码的美妙（或者丑陋），我耐心地等你。

虽然丑陋是无法否认的，但是关于这种异步模式体现出了一些非常重要的事情。

在这段代码中，我们将`x`和`y`作为未来的值对待，我们将`add(..)`操作表达为：（从外部看来）它并不关心`x`或`y`或它们两者现在是否可用。换句话说，它泛化了*现在*和*将来*，
如此我们可以信赖`add(..)`操作是一个可预测的结果。

通过使用一个时间上一致的`add(..)` —— 它跨越*现在*和*将来*，期间的行为是一致的 —— 异步代码的推理变得容易得多了。

更直白的说：为了统一的处理*现在*和*将来*，我们将它们都作为*将来*：所有的操作都变成异步的。

当然，这种粗略的基于回调的方法留下了许多提升的空间。要体会追踪*未来值*的益处而不需要考虑其在时间方面是否可用，这仅仅是迈出的一小步。

#### Promise 值

我们绝对会在本章的后面深入更多关于 Promise 的细节 —— 所以如果这让你犯糊涂，不要担心 —— 但让我们先简单看一下我们如何通过`Promise`来表达`x + y`的例子：

```javascript
function add(xPromise, yPromise) {
  // `Promise.all([ .. ])`接收一个Promise的数组，并返回一个等待它们全部完成的新Promise
  return (
    Promise.all([xPromise, yPromise])

      // 当这个Promise决议后，我们拿起收到的`X`和`Y`的值，并把它们相加
      .then(function (values) {
        // `values`是一个从先前被解析的Promise那里收到的消息数组
        return values[0] + values[1]
      })
  )
}

// `fetchX()` 和 `fetchY()` 返回相应值的Promise，这些值可能在 现在 或 将来 准备好
add(fetchX(), fetchY())
  // 我们得到一个这两个数组的和的Promise。
  // 现在我们链式的调用`then(..)`来等待返回的Promise被决议
  .then(function (sum) {
    console.log(sum) // 这容易多了！
  })
```

在这个代码段中有两层 Promise。

`fetchX()`和`fetchY()`被直接调用，它们的返回值（promise！）被传入`add(..)`。这些 promise 表示的底层值的可用时间可能是*现在*或*将来*，不管怎样每个 promise 都将行为泛化为与时间无关。
我们以一种时间无关的方式来推理`X`和`Y`的值。它们是*未来值*。

第二层是由`add(..)`创建（通过`Promise.all([ .. ])`）并返回的 promise，我们通过调用`then(..)`来等待它。当`add(..)`操作完成后，我们的`sum`*未来值*就准备好并可以打印了。我们
将等待`X`和`Y`的*未来值*的逻辑隐藏在`add(..)`内部。

> [!NOTE]
> 在`add(..)`内部。`Promise.all([ .. ])`调用创建了一个 promise（它在等待`xPromise`和`yPromise`被决议）。链式调用`.then(..)`创建了另一个 promise，
> 它的`return values[0] + values[1]`这一行会被立即决议（得到加法运算的结果）。这样，我们链接在`add(..)`调用末尾的`then(..)`调用 —— 在代码段最后 —— 实际上是在第二个被返回
> 的 promise 上进行操作，而非被`Promise.all([ .. ])`创建的第一个 promise。另外，虽然我们没有在这第二个`then(..)`的末尾链接任何操作，它也已经创建了另一个 promise，
> 我们可以选择监听/使用它。这类 Promise 链的细节将会在本章后面进行讲解。

就像点一个芝士汉堡，Promise 的解析可能是一个拒绝（rejection）而非完成（fulfillment）。不同的是，被完成的 Promise 的值总是程序给出的，而一个拒绝值 —— 通常被称为“拒绝理由” —— 既可以
被程序逻辑设置，也可能是从运行时异常隐式得出的值。

使用 Promise，`then(..)`调用实际上可以接受两个函数，第一个用作完成（正如刚才所示），而第二个用作拒绝：

```javascript
add(fetchX(), fetchY()).then(
  // 完成处理器
  function (sum) {
    console.log(sum)
  },
  // 拒绝处理器
  function (err) {
    console.error(err) // 倒霉！
  }
)
```

如果在取得`X`或`Y`时出现了错误，或在加法操作时某些事情不知怎得失败了，`add(..)`返回的 promise 就被拒绝了，传入`then(..)`的第二个错误处理函数会从 promise 那里收到拒绝的值。

因为 Promise 包装了时间相关的状态 —— 等待底层值的完成或拒绝 —— 从外部看来，Promise 本身是时间无关的，如此 Promise 就可以用可预测的方式组合，而不用关心时间或底层的结果。

另外，一旦 Promise 决议，它就永远保持那个状态 —— 它的那个时刻变成了一个*不可变的值*（immutable value） —— 而且可以根据需要*被监听*任意多次。

> [!NOTE]
> 因为 Promise 一旦决议就是外部不可变的，所以现在将这个值传递给任何其他团体都是安全的，而且我们知道它不会被意外或恶意的被修改。这在许多团体监听同一个 Promise 的解析时特别有用。一个团体
> 去影响另一个团体对 Promise 决议的监听能力是不可能的。不可变性听起来是一个学院派话题，但它实际上是 Promise 设计中最基础且最重要的方面之一，因此不能将它随意的忽略。

这是关于 Promise 需要理解的最强大且最重要的概念之一。通过大量的工作，你可以仅仅使用丑陋的回调组合来创建相同的效果，但这真的不是一个高效的策略，特别是你不得不一遍一遍的重复它。

Promise 是一种用来包装与组合*未来值*，并且可以很容易复用的机制。

### 完成事件

正如我们刚才看到的，一个独立的 Promise 展示了*未来值*的特性。但还有另一种方式考虑 Promise 的决议：在一个异步任务的两个或以上步骤中，作为一种流程控制机制 —— 俗称“先这个然后那个”。

让我们想象调用`foo(..)`来执行某个任务。我们对它的细节一无所知，我们也不关心。它可能会立即完成任务，也可能会花一段时间完成。

我们仅仅想简单的知道`foo(..)`什么时候完成，以便于我们可以移动到下一个任务。换句话说，我们想要一种方法在`foo(..)`完成时得到通知，以便我们可以*继续*。

在典型的 JS 风格中，如果你需要监听一个通知，你很可能会想到事件（event）。那么我们可以将我们的通知需求重新表述为，监听由`foo(..)`发出的*完成*（或*继续*）事件。

> [!NOTE]
> 将它称为一个“完成事件”还是一个“继续事件”取决于你的角度。你是更关心`foo(..)`发生的事情，还是更关心`foo(..)`完成*之后*发生的事情？两种角度都对且都有用。事件通知告诉我们`foo(..)`
> 已经*完成*，也告诉我们可以*继续*进行下一个步骤。的确，你为了事件通知调用而传入的回调函数本身，在前面我们称它为一个*延续*（continuation）。因为*完成事件*更聚焦于`foo(..)`，
> 也就是我们当前注意的东西，所以在这篇文章的其余部分我们稍稍偏向于使用*完成事件*。

使用回调，“通知”就是被任务（`foo(..)`）调用的我们的回调函数。但是使用 Promise，我们将关系扭转过来，我们希望能在监听一个来自于`foo(..)`的事件，当我们被通知时，做相应的处理。

首先，考虑一些假想代码：

<!-- prettier ignore -->

```javascript
foo(x){
  // 开始做一些可能会花一段时间的事情
}

foo(42)

on(foo "completion") {
  // 现在我们可以做下一步了！
}

on(foo "error") {
  // 哦，不！`foo(..)`中某些事情搞错了
}
```

我们调用`foo(..)`然后我们设置两个事件监听器，一个给`"completion"`，一个给`"error"`。 —— `foo(..)`调用的两种可能的最终结果。实质上，`foo(..)`甚至不知道调用它的代码监听了这些事件，
这构成了一个非常美妙的*关注分离（separation of concerns）*。

不幸的是，这样的代码将需要 JS 环境不具备的一些“魔法”（而且显得有些不切实际）。这里是一种用 JS 表达它的更自然的方式：

<!-- prettier-ignore -->
```javascript
function foo(x) {
  // 开始做一些可能会花一段时间的事情


  // 制造一个`listener`事件通知能力并返回

  return listener
}

var evt = foo(42)

evt.on('completion', function () {
  // 现在我们可以做下一步了！
})

evt.on('error', function () {
  // 哦，不！`foo(..)`中某些事情搞错了
})
```

`foo(..)`明确的创建并返回了一个事件监听能力，调用方代码接受并在它上面注册了两个事件监听器。

很明显这反转了一般的面向回调代码，而且是有意为之。与将回调传入`foo(..)`相反，它返回一个我们称之为`evt`的事件能力，它接收回调。

但如果你回想第二章，回调本身代表着一种*控制反转*。所以反转回调模式实际上是*反转的反转*，或者说是一个*反转控制反转* —— 将控制权归还给调用代码，这也是我们最开始想要的效果。

一个重要的好处是，代码的多个分离部分都可以被赋予事件监听能力，而且它们都可在`foo(..)`完成时被独立的通知，来执行后续的步骤：

```javascript
var evt = foo(42)

// 让`bar(..)`监听`foo(..)`的完成
bar(evt)

// 同时，让`baz(..)`监听`foo(..)`的完成
baz(evt)
```

对控制反转的恢复实现了更好的*关注分离*，也就是`bar(..)`和`baz(..)`不必卷入`foo(..)`是如何被调用的问题。相似的，`foo(..)`也不必直到或关心`bar(..)`和`baz(..)`的存在或
它们是否在等待`foo(..)`完成的通知。

实质上，这个`evt`对象是一个中立的第三方协商机制，在分离的关注点之间进行交涉。

#### Promise “事件”

正如你可能已经猜到的，`evt`事件监听能力是一个 Promise 的类比。

在一个基于`Promise`的方式中，前面的代码将会使`foo(..)`创建并返回一个`Promise`实例，而且这个 promise 将会被传入`bar(..)`和`baz(..)`。

> [!NOTE]
> 我们监听的 Promise 解析“事件”并不是严格的事件（虽然它们为了某些目的表现得像事件），而且它们也不经常称为`"completion"`或`"error"`。相反，我们用`then(..)`来注册一个`then`事件。
> 或者也许更准确地讲，`then(..)`注册了`fulfillment(完成)`或`rejection(拒绝)`事件，虽然我们在代码中不会看到这些名词被明确的使用。

考虑：

```javascript
function foo(x) {
  // 开始写一些可能会花一段时间的事情

  // 构建并返回一个promise
  return new Promise(function (resolve, reject) {
    // 最终需要调用`resolve(..)`或`reject(..)`
    // 它们是这个promise的解析回调
  })
}

var p = foo(42)

bar(p)

baz(p)
```

> [!NOTE]
> 在`new Promise(function(..){ .. })`中展示的模式通常被称为“显示构造器[^the-revealing-constructor-pattern]”。被传入的函数立即执行（不会被异步推迟，像`then(..)`的回调那样），
> 而且它被提供了两个参数，我们叫它们`resolve`和`reject`。这些是 Promise 的解析函数。`resolve(..)`一般表示完成，而`reject(..)`表示拒绝。

你可能猜到了`bar(..)`和`baz(..)`内部看起来是什么样子：

```javascript
function bar(fooPromise) {
  // 监听`foo(..)`的完成
  fooPromise.then(
    function () {
      // `foo(..)`现在完成了，那么做`bar(..)`的任务
    },
    function () {
      // 噢，在`foo(..)`中有某些事情搞错了
    }
  )
}

// `baz(..)`同上
```

Promise 解析没有必要一定发送消息，就像我们将 Promise 作为*将来值*考察时那样。它可以仅仅作为一种流程控制信号，就像前面的代码中那样使用。

另一种表达方式是：

```javascript
function bar() {
  // `foo(..)`绝对已经完成了，那么做`bar(..)`的任务
}

function oopsBar() {
  // 噢，在`foo(..)`中有些事情搞错了，那么`bar(..)`不会运行
}

// `baz()`和`oopsBaz()`同上

var p = foo(42)

p.then(bar, oopsBar)

p.then(baz, oopsBaz)
```

> [!NOTE]
> 如果你以前见过基于 Promise 的代码，你可能会相信这段代码的最后两行应当写作`p.then(..).then(..)`，使用链式，而不是`p.then(..); p.then(..)`。这将会是两种完全不同的行为，所以要小心！
> 这种区别现在看起来可能不明显，但是它们实际上是我们目前还没有见过的异步模式：分割(splitting)/分叉(forking)。不必担心！本章后面我们会回到这个话题。

与将 promise 实例`p`传入`bar(..)`和`baz(..)`相反，我们使用 promise 来控制`bar(..)`和`baz(..)`何时该运行（如果执行的话）。主要区别在于错误处理。

在第一个代码段的方式中，无论`foo(..)`是否成功`bar(..)`都会调用，如果被通知`foo(..)`失败了的话它提供自己的后备逻辑。显然，`baz(..)`也是这样做的。

两种方式本身都*对*。但会有一些情况使一种优于另一种。

在这两种方式中，从`foo(..)`返回的 promise`p`都被用于控制下一步发生什么。

另外，两个代码段都以对同一个 promise`p`调用两次`then(..)`结束，这展示了先前的观点，也就是 Promise（一旦被解析）会永远保持相同的解析结果（完成或拒绝），而且可以按需要后续的被监听任意多次。

无论何时`p`被解析，下一步都将总是相同的，包括*现在*和*将来*。

## Thenable 鸭子类型（Duck Typing）

在 Promise 的世界中，一个重要的细节是如何确定一个值是否是纯粹的 Promise。或者更直接地说，一个值会不会像 Promise 一样表现？

我们知道 Promise 是由`new Promise(..)`语法构建的，你可能会想`p instanceof Promise`将是一个可以接受的检查。但不幸的是，有几个理由表明它不是完全够用。

主要原因是，你可以从其他浏览器窗口中收到 Promise 值（iframe 等），其他的浏览器窗口会拥有自己的不同于当前窗口/iframe 的 Promise，这种检查将会在定位 Promise 实例时失效。

另外，一个库或框架可能会选择实现自己的 Promise 而不是用 ES6 原生的`Promise`实现。事实上，你很可能在根本没有 Promise 的老版本浏览器中通过一个库来使用 Promise。

当我们在本章稍后讨论 Promise 的解析过程时，为什么识别并同化一个非纯种但相似 Promise 的值仍然很重要会愈发明显。但目前只需要相信我，它是拼图中很重要的一块。

因此，人们决定识别一个 Promise（或像 Promise 一样表现的某些东西）的方法是定义一种称为“thenable”的东西，也就是任何拥有`then(..)`方法的对象或函数。这种方法假定任何这样的值都是一个符合
Promise 的 thenable。

根据值的形状（存在什么属性）来推测他的“类型”的“类型检查”有一个一般的名称，称为“鸭子类型检查” —— “如果它看起来像一只鸭子，并且叫起来像一只鸭子，那么它一定是一只鸭子”（参见本丛书的*类型与文法*）。
所以对 thenable 的鸭子类型检查可能大致是这样：

```javascript
if (p !== null && (typeof p === 'object' || typeof p === 'function') && typeof p.then === 'function') {
  // 认为它是一个thenable
} else {
  // 不是一个thenable
}
```

晕！先把将这种逻辑在各种地方实现有点丑陋的事实放在一边不谈，这里还有更多更深层的麻烦。

如果你试着用一个偶然拥有`then(..)`函数的任意对象/函数来完成一个 Promise，但你又没想把它当作一个 Promise/thenable 来对待，你的运气就用光了，因为它会被自动的识别为一个 thenable 并以特
殊的规则来对待（见本章后面的部分）。

如果你不知道一个值上面拥有`then(..)`就更是这样。比如：

```javascript
var o = { then: function () {} }

// 使`v`用`[[Prototype]]`链接到`o`
var v = Object.create(o)

v.someStuff = 'cool'
v.otherStuff = 'not so cool'

v.hasOwnProperty('then') // false
```

`v`看起来根本不像是一个 Promise 或 thenable。它只是一个拥有一些属性的普通对象。你可能只是想把这个值像其他对象那样传递而已。

但你不知道的是，`v`还`[[Prototype]]`链接着（见本丛书的*this 与对象原型*）另一个对象`o`，在它上面偶然拥有一个`then(..)`。所以 thenable 鸭子类型检查将会认为并假定`v`是一个 thenable。噢！

它甚至不需要直接故意这么做：

```javascript
Object.prototype.then = function () {}
Array.prototype.then = function () {}

var v1 = { hello: 'world' }
var v2 = ['Hello', 'World']
```

`v1`和`v2`都将被假定为是 thenable 的。你不能控制或预测是否有其他代码偶然或恶意的将`then(..)`加到`Object.prototype`，`Array.prototype`，或其他任何原生原型上。而且如果这个指定的
函数并不将它的任何参数作为回调调用，那么任何用这样的值被解析的 Promise 都将无声的永远挂起！疯狂。

听起来难以置信或不太可能？也许。

要知道，在 ES6 之前就有几种广为人知的非 Promise 库在社区中存在了，而且它们已经偶然拥有了称为`then(..)`的方法。这些库中的一些选择了重命名它们自己的方法来回避冲突（这很烂！）。另一些则因为
它们无法改变来回避冲突，简单的降级为“不兼容基于 Promise 的代码”的不幸状态。

标准化的决策“劫持”了原本非保留的、完全是通用的`then`属性名，这意味着任何值（或其委托对象），无论是过去，现在，还是将来，只要带有一个`then(..)`函数，不管是有意的还是偶然的，
都会被 Promise 系统误认为为一个 thenable（可以被处理为 Promise 的对象）。这种误判可能会导致一些非常难以追踪的 Bug。

> [!WARNING]
> 我并不喜欢我们最终采用了通过 thenable 的鸭子类型来识别 Promise 的方式。还有其他的选项，比如“标记化”`branding`或者“反标记化”`anti-branding`；但我们得到的方案似乎是一个最差的折中方案。
> 不过，这也不全是坏消息。正如我们稍后会看到的，“thenable”鸭子类型在某些情况下还是很有用的。但需要注意的是，如果它错误地将某些并非 Promise 的东西识别为 Promise，那就会变的非常危险。

## Promise 的信任

前面已经给出了两个很强的类比，用于解释 Promise 在不同方面能为我们的异步代码做些什么。但如果止步于此的话，我们就错过了 Promise 模式构建的可能最重要的特性：信任。

*将来值*和*完成事件*这两个类比在我们之前探讨的代码模式中很明显。但是，我们还不能一眼就看出 Promise 为什么以及如何用于解决 2.3 节列出的所有控制反转信任问题。稍微深入探究一下的话，我们
就不难发现它提供了一些重要的保护，重新建立了第 2 章中已经毁掉的异步编码可信任性。

先回顾一下只用回调编码的信任问题。把一个回调传入工具`foo(..)`时可能出现如下问题：

- 调用回调过早
- 调用回调过晚（或不被调用）
- 调用回调次数过少或过多
- 未能传递所需的环境和参数
- 吞掉可能出现的错误和异常

Promise 的特性就是专门用来为这些问题提供一个有效的可复用的答案。

### 调用过早

这个问题主要就是担心代码是否会引入类似 Zalgo 这样的副作用（参见第 2 章）。在这类问题中，一个任务有时同步完成，有时异步完成，这可能会导致“竞态条件[^race-condition]”。

根据定义，Promise 就不必担心这种问题，因为即使是立即完成的 Promise（类似于`new Promise(function(resolve){ resolve(42) })`）也无法被同步观察到。

也就是说，对一个 Promise 调用`then(..)`的时候，即使这个 Promise 已经决议，提供给`then(..)`的回调也总是异步调用（对此的更多讨论，请参见第一章的“Jobs”）。

不再需要插入你自己的`setTimeout(.., 0)`hack，Promise 会自动防止 Zalgo 出现。

### 调用过晚

和前面一点类似，Promise 创建对象调用`resolve(..)`或`reject(..)`时，这个 Promise 的`then(..)`注册的观察回调回被自动调度。可以确信，这些被调度的回调在下一个异步事件
点上一定会被触发（参见第一章的“Jobs”）。

同步查看是不可能的，所以一个同步任务链无法以这种方式运行来实现按照预期有效延迟另一个回调的发生。也就是说，一个 Promise 决议后，这个 Promise 上所有的通过`then(..)`注册的回调
都会在下一个异步时机点上依次被立即调用（再次提醒，请参见第一章“Jobs”）。这些回调中的任意一个都无法影响或延误对其他回调的调用。

```javascript
p.then(function () {
  p.then(function () {
    console.log('C')
  })
  console.log('A')
})

p.then(function () {
  console.log('B')
})

// A B C
```

这里，“C”无法打断或抢占“B”，这是因为 Promise 的运作方式。

#### Promise 调度技巧

但是，还有很重要的一点需要指出，有很多调度的细微差别。在这种情况下，两个独立 Promise 上链接的回调的相对顺序无法可靠预测。

如果两个 promise `p1`和`p2`都已经决议，那么`p1.then(..)`和`p2.then(..)`应该最终会先调用`p1`的回调，然后是`p2`的那些。但还有一些微妙的场景可能不是这样的，比如以下代码：

```javascript
var p3 = new Promise(function (resolve, reject) {
  resolve('B')
})

var p1 = new Promise(function (resolve, reject) {
  resolve(p3)
})

var p2 = new Promise(function (resolve, reject) {
  resolve('A')
})

p1.then(function (v) {
  console.log(v)
})

p2.then(function (v) {
  console.log(v)
})
// A B <-- 而不是你可能认为的 B A
```

后面我们还会深入介绍，但目前你可以看到，`p1`不是立即值而是用另一个 promise`p3`决议，后者本身决议为值“B”。规定的行为是把`p3`展开到`p1`，但是是异步的展开。
所以，在异步任务队列中，`p1`的回调排在`p2`的回调之后（参见第一章的“Jobs”）。

要避免这样的细微区别带来的噩梦，你永远不应该依赖于不同 Promise 间回调的顺序和调度。实际上，好的编码实践方案根本不会让多个回调的顺序有丝毫影响，可能的话就要避免。

### 回调未调用

这个问题很常见，Promise 可以通过几种途径解决。

首先，没有任何东西（甚至 JavaScript 错误）能阻止 Promise 向你通知它的决议（如果它决议了的话）。如果你对一个 Promise 注册了一个完成回调和一个拒绝回调，
那么 Promise 在决议时总是会调用其中的一个。

当然，如果你的回调函数本身包含 JavaScript 错误，那可能就会看不到你期望的结果，但实际上回调还是被调用了。后面我们会介绍如何在回调出错时得到通知，
因为就连这些错误也不会被吞掉。

但是，如果 Promise 本身永远不被决议呢？即使这样，Promise 也提供了解决方案，其使用了一种称为*竞态*的高级抽象机制：

```javascript
// 用于超时一个Promise的工具
function timeoutPromise(delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject('timeout!')
    }, delay)
  })
}

// 设置foo()超时
Promise.race([foo(), timeoutPromise(3000)]).then(
  function () {
    // foo()及时完成！
  },
  function (err) {
    // 或者foo()被拒绝，或者只是没能按时完成
    // 查看err来了解是哪种情况
  }
)
```

关于这个 Promise 超时模式还有更多细节需要考量，后面我们会深入讨论。

很重要的一点是，我们可以保证一个`foo()`有一个输出信号，防止其永久挂住程序。

### 调用次数过少或过多

根据定义，回调被调用的正确次数应该是 1。“过少”的情况就是调用 0 次，和前面解释过的“未被”调用是同一种情况。

“过多”的情况很容易解释。Promise 的定义方式使得它只能被决议一次。如果出于某种原因，Promise 创建代码试图调用`resolve(..)`或`reject(..)`多次，或者试图两者都调用，
那么这个 Promise 将只会接受第一个决议，并默默地忽略任何后续调用。

由于 Promise 只能被决议一次，所以任何通过`then(..)`注册的（每个）回调就只能被调用一次。

当然，如果你把同一个回调注册了不止一次（比如`p.then(f); p.then(f)`），那它被调用的次数就会和注册次数相同。响应函数只会被调用一次，但这个保证并不能预防你搬起石头砸自己的脚。

### 未能传递参数/环境值

Promise 至多只能有一个决议值（完成或拒绝）。

如果你没有用任何值显式决议，那么这个值就是`undefined`，这是 JavaScript 常见的处理方式。但不管这个值是什么，无论当前或将来，它都会被传给所有注册的（且适当的完成或拒绝）回调。

还有一点需要清楚：如果使用多个参数调用`resolve(..)`或者`reject(..)`，第一个参数之后的所有参数都会被默默忽略。这看起来似乎违背了我们前面介绍的保证，但实际上并没有，因为
这是对 Promise 机制的无效使用。对于这组 API 的其他无效使用（比如重复的调用`resolve(..)`），也是类似的保护处理，所以这里的 Promise 行为是一致的（如果不是有点令人沮丧的话）。

如果要传递多个值，你就必须把它们封装在单个值中传递，比如通过传递一个数组或对象。

对环境来说，JavaScript 中的函数总是保持其定义所在的作用域的闭包（参见本系列的*作用域与闭包*），所以它们当然可以继续访问你提供的环境状态。当然，对于只用回调的设计也是这样，因此
这并不是 Promise 特有的优点 —— 但不管怎样，这仍是我们可以依靠的一个保证。

### 吞掉错误或异常

基本上，这部分是上个要点的再次说明。如果拒绝一个 Promise 并给出一个理由（也就是一个出错消息），这个值就会被传给拒绝回调。

不过在这里还有更多的细节需要研究。如果在 Promise 的创建过程中或在查看其决议结果过程中的任何时间点上出现了一个 JavaScript 异常错误，比如一个 TypeError 或 ReferenceError，
那这个异常就会被捕捉，并且会使这个 Promise 被拒绝。

举例来说：

```javascript
var p = new Promise(function (resolve, reject) {
  foo.bar() // foo未定义，所以会出错！
  resolve(42) // 永远不会到达这里 :(
})

p.then(
  function fulfilled() {
    // 永远不会到达这里 :(
  },
  function rejection(err) {
    // err 将会是一个TypeError异常对象 来自foo.bar()这一行
  }
)
```

`foo.bar()`中发生的 JavaScript 异常导致了 Promise 拒绝，你可以捕捉并对其作出响应。

这是一个重要的细节，因为其有效解决了另一个潜在的 Zalgo 风险，即出错可能会引起同步响应，而不出错则会是异步的。Promise 甚至把 JavaScript 异常也变成了异步行为，进而极大降低了
竟态条件出现的可能。

但是，如果 Promise 完成后在查看结果时（`then(..)注册的回调中`）出现了 JavaScript 异常错误会怎样呢？即使这些异常不会被丢弃，但你会发现，对它们的处理方式还是有点出乎意料，
需要进行一些深入研究才能理解：

```javascript
var p = new Promise(function (resolve, reject) {
  resolve(42)
})

p.then(
  function fulfilled(msg) {
    foo.bar()
    console.log(msg) // 永远不会到达这里 :(
  },
  function rejected(err) {
    // 永远不也会到达这里 :(
  }
)
```

等一下，这看起来像是`foo.bar()`产生的异常真的被吞掉了。别担心，实际上并不是这样。但是这里有一个深藏的问题，就是我们没有侦听到它。`p.then(..)`调用本身返回了另一个 promise，
正是这个 promise 将会因 TypeError 异常而被拒绝。

为什么它不是简单的调用我们定义的错误处理函数呢？表面上的逻辑应该是这样啊。如果这样的话就违背了 Promise 的一条基本原则，即 Promise 一旦决议就不可再变。`p`已经完成为值`42`，
所以之后查看`p`的决议时，并不能因为出错就把`p`再变为一个拒绝。

除了违背原则之外，这样的行为也会造成严重的损害。因为假如这个 promise `p`有多个`then(..)`注册的回调的话，有些回调会被调用，而有些则不会，情况会非常不透明，难以解释。

### 是可信任的 Promise 吗

基于 Promise 模式建立信任还有最后一个细节需要讨论

你肯定已经注意到 Promise 并没有完全摆脱回调。它们只是改变了传递回调的位置。我们并不是把回调传递给`foo(..)`，而是从`foo(..)`得到某个东西（外观上看是一个真正的 Promise），
然后把回调传给这个东西。

但是，为什么这就比单纯使用回调更值得信任呢？如何能够确定返回的这个东西实际上就是一个可信任的 Promise 呢？这难道不是一个（脆弱的）纸牌屋，在里面只能信任我们已经信任的？

关于 Promise 的很重要但是常常被忽略的一个细节是，Promise 对这个问题已经有一个解决方案。包含在原生 ES6 Promise 实现中的解决方案就是`Promise.resolve(..)`。

如果向`Promise.resolve(..)`传递一个非 Promise，非 thenable 的立即值，就会得到一个用这个值填充的 promise。下面这种情况下，promise`p1`和`p2`的行为是完全一样的：

```javascript
var p1 = new Promise(function (resolve, reject) {
  resolve(42)
})

var p2 = Promise.resolve(42)
```

而如果向`Promise.resolve(..)`传递一个真正的 Promise，就只会返回同一个 promise：

```javascript
var p1 = Promise.resolve(42)

var p2 = Promise.resolve(p1)

p1 === p2 // true
```

更重要的是，如果向`Promise.resolve(..)`传递一个非 Promise 的 thenable 值，前者就会试图展开这个值，而且展开过程会持续到提取出一个具体的非类 Promise 的最终值。

考虑：

```javascript
var p = {
  then: function (cb) {
    cb(42)
  },
}

// 这可以工作，但只是因为幸运而已
p.then(
  function fulfilled(val) {
    console.log(val) // 42
  },
  function rejected(err) {
    // 永远不会到达这里
  }
)
```

这个`p`是一个 thenable，但并不是一个真正的 Promise。幸运的是，和绝大多数值一样，它是可追踪的。但是，如果得到的是如下这样的值又会怎样呢：

```javascript
var p = {
  then: function (cb, errCb) {
    cb(42)
    errCb('evil laugh')
  },
}

p.then(
  function fulfilled(val) {
    console.log(val) // 42
  },
  function rejected(err) {
    // 啊，不应该运行！
    console.log(err) // evil laugh
  }
)
```

这个`p`是一个 thenable，但是其行为和 promise 并不完全一致。这是恶意的吗？还只是因为它不知道 Promise 应该如何运作？说实话，这并不重要。不管是哪种情况，
它都是不可信任的。

尽管如此，我们还是都可以把这些版本的`p`传给`Promise.resolve(..)`，然后就会得到期望中的规范化后的安全结果：

```javascript
Promise.resolve(p).then(
  function fulfilled(val) {
    console.log(val) // 42
  },
  function rejected(err) {
    //  永远不会到达这里
  }
)
```

`Promise.resolve(..)`可以接受任何 thenable，将其解封为它的非 thenable 值。从`Promise.resolve(..)`得到的是一个真正的 Promise，是一个可以信任的值。
如果你传入的已经是真正的 Promise，那么你得到的就是它本身，所以通过`Promise.resolve(..)`过滤来获得可信任性完全没有坏处。

假设我们要调用一个工具`foo(..)`，且并不确定得到的返回值是否是一个可信任的行为良好的 Promise，但我们可以知道它至少是一个 thenable。`Promise.resolve(..)`
提供了可信任的 Promise 封装工具，可以链式使用：

```javascript
// 不要只是这么做：
foo(42).then(function (v) {
  console.log(v)
})

// 而是这么做：
Promise.resolve(foo(42)).then(function (v) {
  console.log(v)
})
```

> [!NOTE]
> 对于用`Promise.resolve(..)`为所有函数的返回值（不管是不是 thenable）都封装一层。另一个好处是，这样很容易把函数调用规范为定义良好的异步任务。如果`foo(42)`
> 有时会返回一个立即值，又会返回 Promise，那么`Promise.resolve(foo(42))`就能够保证总会返回一个 Promise 结果，而且避免 Zalgo 就能得到更好的代码。

### 建立信任

很可能前面的讨论现在已经完全“解决”（resolve，英语中也表示“决议”的意思）了你的疑惑：Promise 为什么是可靠的，以及更重要的，为什么对构建健壮可维护的软件来说，
这种信任非常重要。

可以用 JavaScript 编写异步代码而无需信任吗？当然可以。JavaScript 开发者近二十年来一直都只用回调编写异步代码。

可一旦开始思考你在其上构建代码的机制具有何种程度的可预见性和可靠性时，你就会开始意识到回调的可信任基础是相当不牢靠。

Promise 这种模式通过可信任的语义把回调作为参数传递，使得这种行为更可靠更合理。通过把回调的控制反转反转回来，我们把控制权放在了一个可信任的系统（Promise）中，
这种系统的设计目的就是为了使异步编码更清晰。

## 链式流

尽管我们之前对此有过几次暗示，但 Promise 并不只是一个单步执行`this-then-that`操作的机制。当然，那是构成部件，但是我们可以把多个 Promise 连接到一起表示一系列异步步骤。

这种方式可以实现的关键在于以下两个 Promise 固有行为特性：

- 每次你对 Promise 调用`then(..)`，它都会创建并返回一个新的 Promise，我们可以将其链接起来。
- 不管从`then(..)`调用的完成回调（第一个参数）返回的值是什么，它都会被自动设置为被链接 Promise（第一点中的）的完成。

先来解释一下这是什么意思，然后推导一下其如何帮助我们创建流程控制异步序列。考虑如下代码：

```javascript
var p = Promise.resolve(21)

var p2 = p.then(function (v) {
  console.log(v) // 21

  // 用值42填充p2
  return v * 2
})

// 连接p2
p2.then(function (v) {
  console.log(v) // 42
})
```

我们通过返回`v * 2`（即 42），完成了第一个调用`then(..)`创建并返回的 promise`p2`。`p2`的`then(..)`调用在运行时会从`return v * 2`语句接受完成值。当然，`p2.then(..)`
又创建了另一个新的 promise，可以用变量`p3`存储。

但是，如果必须创建一个临时变量`p2`（或`p3`等），还是有一点麻烦的。谢天谢地，我们很容易把这些链接到一起：

```javascript
var p = Promise.resolve(21)

p.then(function (v) {
  console.log(v) // 21

  // 用值42完成链接的promise
  return v * 2
})
  // 这里是链接的promise
  .then(function (v) {
    console.log(v) // 42
  })
```

现在第一个`then(..)`就是异步序列中的第一步，第二个`then(..)`就是第二步。这可以一直任意扩展下去。只要保持把先前的`then(..)`连到自动创建的每一个 Promise 即可。

但这里还漏掉了一些东西。如果需要步骤 2 等待步骤 1 异步来完成一些事情怎么办？我们使用了立即返回 return 语句，这会立即完成链接的 promise。

使 Promise 序列真正能够在每一步有异步能力的关键是，回忆一下当传递给`Promise.resolve(..)`的是一个 Promise 或 thenable 而不是最终值时的运作方式。`Promise.resolve(..)`
会直接返回接收到的真正 Promise，或展开接收到的 thenable 值，并且会递归的持续展开 thenable。

从完成（或拒绝）处理函数返回 thenable 或者 Promise 的时候也会发生同样的展开。考虑：

```javascript
var p = Promise.resolve(21)

p.then(function (v) {
  console.log(v) // 21

  // 创建一个promise并返回
  return new Promise(function (resolve, reject) {
    // 用值42填充
    resolve(v * 2)
  })
}).then(function (v) {
  console.log(v) // 42
})
```

虽然我们把 42 封装到了返回的 promise 中，但它仍然会被展开并最终成为链接的 promise 的决议，因此第二个`then(..)`得到的仍然是 42。如果我们向封装的 promise 引入异步，
一切都仍然会同样工作：

```javascript
var p = Promise.resolve(21)

p.then(function (v) {
  console.log(v) // 21

  // 创建一个promise并返回
  return new Promise(function (resolve, reject) {
    // 引入异步！
    setTimeout(function () {
      // 用值42填充
      resolve(v * 2)
    }, 100)
  })
}).then(function (v) {
  // 在前一步中的100ms延迟之后运行
  console.log(v) // 42
})
```

这种强大是在不可思议！现在我们可以构建这样一个序列：不管我们想要多少异步步骤，每一步都能够根据需要等待下一步（或者不等！）。

当然，在这些例子中，一步步传递的值是可选的。如果不显式返回一个值，就会隐式返回`undefined`，并且这些 promise 仍然会以同样的方式链接在一起。这样，
每个 Promise 的决议就成了继续下一个步骤的信号。

为了进一步阐释链接，让我们把延迟 Promise 创建（没有决议消息）过程一般化到一个工具中，以便在多个步骤中复用：

```javascript
function delay(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, time)
  })
}

delay(100) //步骤1
  .then(function STEP2() {
    console.log('step 2 (after 100ms)')
    return delay(200)
  })
  .then(function STEP3() {
    console.log('step 3 (after another 200ms)')
  })
  .then(function STEP4() {
    console.log('step 4 (next Job)')
    return delay(50)
  })
  .then(function STEP5() {
    console.log('step 5 (after another 50ms)')
  })
// ...
```

调用`delay(200)`创建了一个将在`200ms`后完成的 promise，然后我们从第一个`then(..)`完成回调中返回这个 promise，这会导致第二个`then(..)`的 promise 等待这个`200ms`的 promise。

> [!NOTE]
> 如前所述，严格地说，这个交互过程中有两个 promise：200ms 延迟 promise，和第二个`then(..)`链接到的那个链接 promise。但是你可能已经发现了，在脑海中把这两个 promise
> 合二为一之后更好理解，因为 Promise 机制已经自动为你把它们的状态和并在了一起。这样一来，可以把`return delay(200)`看作是创建了一个 promise，并用其替代了前面返回的链接 promise。

但说实话，没有消息传递的延迟序列对于 Promise 流程控制来说并不是一个很有用的示例。我们来考虑如下一个更实际的场景。

这里不用定时器，而是构造 Ajax 请求：

```javascript
// 假定工具ajax({url}, {callback})存在

// Promise-aware ajax
function request(url) {
  return new Promise(function (resolve, reject) {
    // ajax(..)回调应该是我们这个promise的resolve(..)函数
    ajax(url, resolve)
  })
}
```

我们首先定义一个工具`request(..)`，用来构造一个表示`ajax(..)`调用完成的 promise：

```javascript
request('http://some.url.1/')
  .then(function (response1) {
    return request('http://some.url.2/?v=' + response1)
  })
  .then(function (response2) {
    console.log(response2)
  })
```

> [!NOTE]
> 开发者常会遇到这样的情况：他们想要通过本身并不支持 Promise 的工具（就像这里的`ajax(..)`，它接收的是一个回调）实现支持 Promise 的异步流程控制。虽然原生 ES6 Promise 机制并不会自动
> 我们提供这个模式，但所有实际的 Promise 库都会提供。通常他们把这个过程称为“提升”、“ promise 化”或者其他类似的名称。我们稍后会再介绍这种技术。

利用返回的 Promise 的`request(..)`，我们通过使用第一个 URL 调用它来创建链接中的第一步，并且把返回的 promise 与第一个`then(..)`链接起来。

`response1`一返回，我们就是用这个值构建第二个 URL，并发出第二个`request(..)`调用。第二个`request(..)`的 promise 返回，以便异步流控制中的第三步等待这个 Ajax 调用完成。
最后，`response2`一返回，我们就立即打出结果。

我们构建的这个 Promise 链不仅是一个表达多步异步序列的控制流程，还是一个从步骤到下一个步骤传递消息的消息通道。

如果这个 Promise 链中的某个步骤出错了怎么办？错误和异常是基于每个 Promise 的，这意味着可能在链的任意位置捕捉到这样的错误，而这个捕捉动作在某种程度上就相当于在这一位置将整条链“重置”
回到了正常的运作：

```javascript
// 步骤1:
request('http://some.url.1/')
  // 步骤2:
  .then(function (response1) {
    foo.bar() // undefined, 引发一个错误！

    // 永远不会到达这里
    return request('http://some.url.2/?v=' + response1)
  })
  // 步骤3:
  .then(
    function fulfilled(response2) {
      // 永远不会到达这里
    },
    // 捕捉错误的拒绝处理函数
    function rejected(err) {
      console.log(err)
      // 来自foo.bar()的错误TypeError
      return 42
    }
  )
  // 步骤4:
  .then(function (msg) {
    console.log(msg) // 42
  })
```

第 2 步出错后，第 3 步的拒绝处理函数会捕捉到这个错误。拒绝处理函数的返回值（这段代码中是 42），如果有的话，会用来完成交给下一个步骤（第 4 步）的 promise，这样，这个链现在就回到了完成状态。

> [!NOTE]
> 正如之前讨论过的，当从完成处理函数返回一个 promise 时，它会被展开并有可能延迟下一个步骤。从拒绝处理函数返回 promise 也是如此，因此如果在第 3 步返回的不是 42 而是一个 promise 的话，
> 这个 promise 可能会延迟第 4 步。调用`then(..)`时的完成处理函数或拒绝处理函数如果抛出异常，都会导致（链中的）下一个 promise 因这个异常而立即被拒绝。

如果你调用 promise 的`then(..)`，并且只传入一个完成处理函数，一个默认拒绝处理函数就会顶替上来：

```javascript
var p = new Promise(function (resolve, reject) {
  reject('Oops')
})

var p2 = p.then(
  function fulfilled() {
    // 永远不会到达这里
  }
  // 假定的拒绝处理函数，如果省略或者传入任何非函数值
  // function (err){
  //   throw err
  // }
)
```

如你所见，默认拒绝处理函数只是把错误重新抛出，这最终会使得 p2（链接的 promise）用同样的错误理由拒绝。从本质上说，这使得错误可以继续沿着 Promise 链传播下去，直到遇到显示定义的拒绝处理函数。

> [!NOTE]
> 稍后我们会介绍关于 Promise 错误处理的更多细节，因为还有其他一些微妙的细节需要考虑

如果没有给`then(..)`传递一个是当有效的函数作为完成处理函数参数，还是会有作为替代的一个默认处理函数：

```javascript
var p = Promise.resolve(42)

p.then(
  // 假设的完成处理函数，如果省略或者传入任何非函数
  // function (v){
  //   return v
  // }
  null,
  function rejected(err) {
    // 永远不会到达这里
  }
)
```

你可以看到，默认的完成处理函数只是把接收到的任何传入值传递给下一个步骤（Promise）而已。

> [!NOTE] > `then(null, function(err){ .. })`这个模式 —— 只处理拒绝（如果有的话），但又把完成值传递下去 —— 有一个缩写形式的 API：`catch(function(err){ .. })`。
> 下一小节会详细介绍`catch(..)`。

让我们来简单总结一下使链式流程控制可行的 Promise 固有特性。

- 调用 Promise 的`then(..)`会自动创建一个新的 Promise 从调用返回。
- 在完成或拒绝处理函数内部，如果返回一个值或抛出一个异常，新返回的（可链接的）Promise 就相应的决议。
- 如果完成或拒绝处理函数返回一个 Promise，它将会被展开，这样一来，不管它的决议值是什么，都会成为当前`then(..)`返回的链接 Promise 的决议值。

尽管链式流程控制是有用的，但是对其最精确的看法是把它看作 Promise 组合到一起的一个附加益处，而不是主要目的。正如前面已经多次深入讨论的，Promise 规范化了异步，并封装了时间相关值的状态，
使得我们能够把它们以这种有用的方式链接到一起。

当然，相对于第 2 章讨论的回调的一团乱麻，链接的顺序表达（this-then-this-then-this...）已经是一个巨大的进步。但是，仍然有大量的重复样板代码（`then(..)`以及`function(){ .. }`）。
在第 4 章，我们将会看到在顺序流程控制表达方面提升巨大的优美模式，通过生成器实现。

### 术语：决议、完成以及拒绝

对于术语`决议（resolve）`、`完成（fulfill）`和`拒绝（reject）`，在更深入学习 Promise 之前，我们还有一些模糊之处需要澄清。先来研究一下构造器 Promise(..)：

```javascript
var p = new Promise(function (X, Y) {
  // X(..)是完成处理函数
  // Y(..)是拒绝处理函数
})
```

你可以看到，这里提供了两个回调（称为 X 和 Y）。第一个*通常*用于标识 Promise 已经完成，第二个*总是*标识 Promise 被拒绝。这个“通常”是什么意思呢？对于这些参数的精确命名，又意味着什么呢？

追根究底，这只是你的用户代码和标识符名称，对引擎而言没有意义。所以从技术上说，这无关紧要，`foo(..)`或者`bar(..)`还是同样的函数。但是，你使用的文字不只会影响你对这些代码的看法，也会影响
团队其他开发者对代码的认识。错误理解精心组织起来的异步代码还不如使用一团乱麻的回调函数。

所以事实上，命名还是有一定的重要性的。

第二个参数名称很容易决定。几乎所有的文献都将其命名为`reject(..)`，因为这就是它真实的（也是唯一的！）工作，所以这样的名字是很好的选择。我强烈建议大家要一直使用`reject(..)`这一名称。

但是，第一个参数就有一些模糊了，Promise 文件通常将其称为`resolve(..)`。这个词显然和决议（resolution）有关，而决议在各种文献（包括本书）中是用来描述“为 Promise 设置最终值/状态”。
前面我们已经多次使用“Promise 决议”来表示完成或拒绝 Promise。

但是，如果这个参数用来特指完成这个 Promise，那为什么不使用`fulfill(..)`来代替`resolve(..)`以求表达更精确呢？要回答这个问题，我们先来看看两个 Promise API 方法：

```javascript
var fulfilledPr = Promise.resolve(42)

var rejectedPr = Promise.reject('Oops')
```

`Promise.resolve(..)`创建了一个决议为输入值的 Promise，在这个例子中，42 是一个非 Promise、非 thenable 的普通值，所以完成后的 promise fulfilledPr 是为值 42 创建的。
`Promise.reject('Oops')`创建了一个被拒绝的 promise rejectedPr，拒绝理由为“Oops”。

现在我们来解释为什么单词 resolve（比如在`Promise.resolve(..)`中）如果用于表达结果可能是完成也可能是拒绝的话，既没有歧义，而且也确实更精确：

```javascript
var rejectedTh = {
  then: function (resolved, rejected) {
    rejected('Oops')
  },
}

var rejectedPr = Promise.resolve(rejectedTh)
```

本章前面已经介绍过，`Promise.resolve(..)`会将传入的真正 Promise 直接返回，对传入的 thenable 则会展开。如果这个 thenable 展开得到一个拒绝状态，那么从`Promise.resolve(..)`返回的
Promise 实际上就是这同一个拒绝状态。

所以对这个 API 方法来说，`Promise.resolve(..)`是一个精确的好名字，因为它实际上的结果可能是完成或拒绝。

`Promise(..)`构造器的第一个参数回调将会展开 thenable（和`Promise.resolve(..)`一样）或真正的 Promise：

```javascript
var rejectedPr = new Promise(function (resolve, reject) {
  // 用一个拒绝的promise完成这个promise
  resolve(Promise.reject('Oops'))
})

rejectedPr.then(
  function fulfilled() {
    // 永远不会到达这里
  },
  function rejected(err) {
    console.log(err) // Oops
  }
)
```

现在应该很清楚了，`Promise(..)`构造器的第一个回调参数的恰当称谓是`resolve(..)`。

> [!WARNING]
> 前面提到的`reject(..)`不会像`resolve(..)`一样进行展开。如果向`reject(..)`传入一个 Promise/thenable 值，它会把这个值原封不动地设置为拒绝理由。后续的拒绝处理函数接收到的
> 是你实际传给`reject(..)`的那个 Promise/thenable，而不是其底层的立即值。

不过，现在我们再来关注一下提供给`then(..)`的回调。它们（在文献和代码中）应该怎么命名呢？我的建议是`fulfilled(..)`和`rejected(..)`：

```javascript
function fulfilled(msg) {
  console.log(msg)
}

function rejected(err) {
  console.log(err)
}

p.then(fulfilled, rejected)
```

对于`then(..)`的第一个参数来说，毫无疑义，总是处理完成的情况，所以不需要使用标识两种状态的术语“resolve”。这里提一下，
ES6 规范将这两个回调命名为`onFulfilled(..)`和`onRejected(..)`，所以，这两个术语很准确。

## 错误处理

前面已经展示了一些例子，用于说明在异步编程中 Promise 拒绝（调用`reject(..)`有意拒绝或 JS 异常导致的无意拒绝）如何使得错误出处理更完善。
我们来回顾一下，并明确解释一下前面没有明说的几个细节。

对多数开发者来说，错误处理最自然的形式就是同步的`try..catch`结构。遗憾的是，它只能是同步的，无法用于异步代码模式：

```javascript
function foo() {
  setTimeout(function () {
    baz.bar()
  }, 100)
}

try {
  foo()
  // 后面从`baz.bar()`抛出全局错误
} catch (err) {
  // 永远不会到达这里
}
```

`try..catch`当然很好，但是无法跨异步操作工作。也就是说，还需要一些额外的环境支持，我们会在第 4 章关于生成器的部分介绍这些环境支持。

在回调中，一些模式化的错误处理方式已经出现，最值得一提的是`error-first`回调风格：

```javascript
function foo(cb) {
  setTimeout(function () {
    try {
      var x = baz.bar()
      cb(null, x)
    } catch {
      cb(err)
    }
  }, 100)
}

foo(function (err, val) {
  if (err) {
    console.error(err) // 烦 :(
  } else {
    console.log(val)
  }
})
```

> [!NOTE]
> 只有在`baz.bar()`调用会同步地立即成功或失败的情况下，这里的`try..catch`才能工作。如果`baz.bar()`本身有自己的异步完成函数，其中的任何异步错误都将无法捕捉到。

传给`foo(..)`的回调函数保留第一个参数`err`，用于在出错时接收到信号。如果其存在的话，就认为出错；否则就认为是成功。

严格来说，这一类错误处理是支持异步的，但完全无法很好的组合。多级`error-first`回调交织在一起，再加上这些无所不在的 if 检查语句，都不可避免地
导致了回调地狱的风险（参见第 2 章）。

我们回到 Promise 中的错误处理，其中拒绝处理函数被传递给`then(..)`。Promise 没有采用流行的`error-first`回调设计风格，而是使用了分离回调（split-callback）风格。
一个回调用于完成情况，一个回调用于拒绝情况：

```javascript
var p = Promise.reject('Oops')
p.then(
  function fulfilled() {
    // 永远不会到达这里
  },
  function rejected(err) {
    console.log(err) // Oops
  }
)
```

尽管表面看来，这种出错处理模式很合理，但彻底掌握 Promise 错误处理的各种细微差别常常还是有些难度的。

考虑：

```javascript
var p = Promise.resolve(42)
p.then(
  function fulfilled(msg) {
    // 数字没有string函数，所以会抛出错误
    console.log(msg.toLowerCase())
  },
  function rejected(err) {
    // 永远不会到达这里
  }
)
```

如果`msg.toLowerCase()`合法地抛出一个错误（事实确实如此！），为什么我们的错误处理函数没有得到通知呢？正如前面解释过的，这是因为那个错误处理函数为 promise p 准备的，
而这个 promise 已经用值 42 完成了。promise p 是不可变的，所以唯一可以被通知这个错误的 promise 是从`p.then(..)`返回的那一个，但我们在此例中没有捕捉。

这应该清晰地解释了为什么 Promise 的错误处理易于出错。这非常容易造成错误被吞掉，而这极少是出于你的本意。

> [!WARNING]
> 如果通过无效的方式使用 Promise API，并且出现一个错误阻碍了正常的 Promise 构造，那么结果会得到一个立即抛出的异常，而不是一个被拒绝的 Promise。这里是一些错误使用导致 Promise 构造
> 失败的例子： new Promise(null)、Promise.all()、Promise.race(42)，等等。如果一开始你就没能有效使用 Promise API 真正构造出一个 Promise，那就无法得到一个被拒绝的 Promise！

### 绝望的陷阱

Jeff Atwood 多年前就曾提出：通常编程语言构建的方式是，默认情况下，开发者陷入“绝望的陷阱”（[pit of despair](http://blog.codinghorror.com/falling-into-the-pit-of-success/)）,
要为错误付出代价，只有更努力才能做对。他呼吁我们转而构建一个“成功的坑”（pit of success），其中默认情况下你能够得到想要的结果（成功），想出错很难。

毫无疑问，Promise 错误处理就是一个“绝望的陷阱”设计。默认情况下，它假定你想要 Promise 状态吞掉所有的错误。如果你忘了查看这个状态，这个错误就会默默地（通常是绝望地）在暗处凋零死掉。

为了避免丢失被忽略和抛弃的 Promise 错误，一些开发者表示，Promise 链的一个最佳实践就是最后总以一个`catch(..)`结束，比如：

```javascript
var p = Promise.resolve(42)

p.then(function fulfilled() {
  // 数字没有string函数，所以会抛出错误
  console.log(msg.toLowerCase())
}).catch(handleErrors)
```

因为我们没有为`then(..)`传入拒绝处理函数，所以被默认的处理函数替换掉了，而这仅仅是把错误传递给了链中的下一个 promise。因此，进入 p 的错误以及 p 之后
进入其决议（就像`msg.toLowerCase()`）的错误都会传递到最后的`handleErrors(..)`。

问题解决了，对吧？没那么快！

如果`handleErrors(..)`本身内部也有错误怎么办呢？谁来捕捉它？还有一个没人处理的 promise：`catch(..)`返回的那一个。我们没有捕获这个 promise 的结果，
也没有为其注册拒绝处理函数。

你并不能简单的在这个链尾端添加一个新的`catch(..)`，因为它很可能会失败。任何 Promise 链的最后一步，不管是什么，总是存在着在未被查看的 Promise 中出现
未捕获错误的可能性，尽管这种可能性越来越低。

看起来好像是一个无解的问题吧？

### 处理未捕获的情况

这不是一个容易彻底解决的问题。还有其他（很多人认为是更好的）一些处理方法。

有些 Promise 库增加了一些方法，用于注册一个类似于“全局未处理拒绝”处理函数的东西，这样就不好抛出全局错误，而是调用这个函数。但它们辨识未捕获错误的方法是定义一个
某个时长的定时器，比如 3 秒钟，在拒绝的时刻启动。如果 Promise 被拒绝，而在定时器触发之前都没有错误处理函数被注册，那它就假定你不会注册处理函数，进而就是未被捕获错误。

在实际使用中，对很多库来说，这种方法运行良好，因为通常多数使用模式在 Promise 拒绝和检查拒绝结果之间不会有很长的延迟。但是这种模式可能会有些麻烦，因为 3 秒这个时间
太随意了（即使是经验值），也因为确实有一些情况下会需要 Promise 在一段不确定的时间内保持其拒绝状态。而且你绝对不希望因为这些误报（还没被处理的未捕获错误）而调用未捕获错误处理函数。

更常见的一种看法是：Promise 应该添加一个`done(..)`方法，从本质上标识 Promise 链的结束。`done(..)`不会创建和返回 Promise，所以传递给`done(..)`的回调显然不会报告一个并不存在的
链接 Promise 问题。

那么会发生什么呢？它的处理方式类似于你可能对未捕获错误通常期望的处理方式：`done(..)`拒绝处理函数内部的任何异常都会被作为一个全局未处理错误抛出（基本上是在开发者终端上）。代码如下：

```javascript
var p = Promise.resolve(42)

p.then(function fulfilled(msg) {
  // 数字没有string函数，所以会抛出错误
  console.log(msg.toLowerCase())
}).done(null, handleErrors)

// 如果handleErrors(..)引发了自身的异常，会被全局抛出到这里
```

相比没有结束的链接或者任意时长的定时器，这种方案看起来似乎更有吸引力。但最大的问题是，它并不是 ES6 标准的一部分，所以不管听起来怎么好，要成为可靠的普遍解决方案，它还有很长一段路要走。

那我们就这么被卡住了？不完全是。

浏览器有一个特有的功能是我们的代码所没有的：它们可以跟踪并了解所有对象被丢弃以及被垃圾回收的时机。所以，浏览器可以追踪 Promise 对象。如果在它被垃圾回收的时候其中有拒绝，
浏览器就能够确保这是一个真正的未捕获错误，进而可以确定应该将其报告到开发者终端。

> [!NOTE]
> 在编写本书的时候，Chrome 和 Firefox 对于这种（追踪）未捕获拒绝功能都已经有了早期的实验性支持，尽管还不完善。

但是，如果一个 Promise 未被垃圾回收 —— 各种不同的代码模式中很容易不小心出现这种情况 —— 浏览器的垃圾回收嗅探就无法帮助你知晓和诊断一个被你默默拒绝的 Promise。

还有其他办法吗？有。

### 成功的坑

接下来的内容只是理论上的，关于未来的 Promise 可以变成什么样。我相信它会变得比现在我们所拥有的高级得多。我认为这种改变甚至可能是后 ES6 的，因为我觉得它不会打破
ES6 Promise 的 web 兼容性。还有，如果你认真对待的话，它可能是可以 ployfill 的。我们来看一下。

- 默认情况下，Promise 在下一个任务或事件循环 tick 上（向开发者终端）报告所有拒绝，如果在这个时间点上该 Promise 上还没有注册错误处理函数。
- 如果想要一个被拒绝的 Promise 在查看之前的某个时间段内保持被拒绝状态，可以调用`defer()`，这个函数优先级高于该 Promise 的自动错误报告。

如果一个 Promise 被拒绝的话，默认情况下会向开发者终端报告这个事实（而不是默认为沉默）。可以选择隐式（在拒绝之前注册一个错误处理函数）或者显式（通过`defer()`）禁止这种报告。
在这两种情况下，都是有你来控制误报的情况。

考虑：

```javascript
var p = Promise.reject('Oops').defer()

// foo(..)是支持Promise的
foo(42).then(
  function fulfilled() {
    return p
  },
  function rejected(err) {
    // 处理foo(..)错误
  }
)
// ...
```

创建 p 的时候，我们知道需要等待一段时间才能使用或查看它的拒绝结果，所以我们就调用`defer()`，这样就不会有全局报告出现。为了便于链接，`defer()`只是返回这同一个 promise。

从`foo(..)`返回的 promise 立即就被关联了一个错误处理函数，所以它也隐式消除了出错全局报告。

但是，从`then(..)`调用返回的 promise 没有调用`defer()`，也没有关联错误处理函数，所以如果它（从内部或决议处理函数）拒绝的话，就会作为一个未捕获错误被报告到开发者终端。

这种设计就是成功的坑。默认情况下，所有的错误要么被处理要么被报告，这几乎是绝大多数情况下几乎所有开发者会期望的结果。你要么必须注册一个处理函数要么特意选择退出，
并表明你想把错误处理延迟到*将来*。你这时候是在为特殊情况主动承担特殊的责任。

这种方案唯一真正危险的是，如果你`defer()`了一个 Promise，但之后却没有成功查看或处理它的拒绝结果。

但是，你得特意调用`defer()`从能选择进入这个绝望的陷阱（默认情况下总是成功的坑）。所以这是你自己的问题，别人也无能为力。

我认为 Promise 错误处理还是有希望的（后 ES6）。我希望权威组织能否重新思考现状，考虑一下这种修改。同时，你也可以自己实现这一点（这是一道留给大家的挑战性习题！），
或者选择更智能的 Promise 为实现！

> [!NOTE]
> 这个错误处理/报告的精确模板是在我的 asynquesce Promise 抽象库中实现的。本部分的附录 A 中详细讨论了这个库。

## Promise 模式

前文我们无疑已经看到了使用 Promise 链的顺序模式（this-then-this-then-that 流程控制），但是可以基于 Promise 构建的异步模式抽象还有很多变体。这些模式是为了简化异步流程控制，
这使得我们的代码更容易追踪和维护，即使在程序中最复杂的部分也是如此。

原生 ES6 Promise 实现中直接支持了两个这样的模式，所以我们可以免费得到它们，用作构建其他模式的基本块。

### Promise.all([ .. ])

在异步序列中（Promise 链），任意时刻都只能有一个异步任务正在执行 —— 步骤 2 只能在步骤 1 之后，步骤 3 只能在步骤 2 之后。但是，
如果想要同时执行两个或更多步骤（也就是“并行执行”），要怎么实现呢？

在经典的编程术语中，门（gate）是这样一种机制要等待两个或更多并行/并发的任务都完成才能继续。它们的完成顺序不重要，但是必须都要完成，门才能打开并让流程控制继续。

在 Promise API 中，这种模式被称为`all([ .. ])`。

假定你想要同时发送两个 Ajax 请求。等它们不管以什么顺序全部完成之后，再发送第三个 Ajax 请求。考虑：

```javascript
// request(..)是一个Promise-aware Ajax工具
// 就像我们在本章前面定义的一样
var p1 = request('http://some.url.1/')
var p2 = request('http://some.url.2/')

Promise.all([p1, p2])
  .then(function (msgs) {
    //  这里p1和p2完成并把它们的消息传入
    return request('http://some.url.3/?v=' + msgs.join(','))
  })
  .then(function (msg) {
    console.log(msg)
  })
```

`Promise.all([ .. ])`需要一个参数，是一个数组，通常由 Promise 实例组成。从`Promise.all([ .. ])`调用返回的 promise 会收到一个完成消息（代码片段中的 msgs）。
这是一个由所有传入 promise 的完成消息组成的数组，与指定的顺序一致（与完成顺序无关）。

> [!NOTE]
> 严格来说，传给`Promise.all([ .. ])`的数组中的值可以是 Promise、thenable，甚至是立即值。就本质而言，列表中的每个值都会通过`Promise.resolve(..)`过滤，
> 以确保要等待的是一个真正的 Promise，所以立即值会被规范化为这个值构建的 Promise。如果数组是空的，主 Promise 会立即完成。

从`Promise.all([ ..])`返回的主 promise 在且仅在所有的成员 promise 都完成后才会完成。如果这些 promise 中有任何一个被拒绝的话，主`Promise.all([ .. ])` promise 就会立即
被拒绝，并丢弃来自其他所有 promise 的全部结果。

永远要记住为每个 promise 关联一个拒绝/错误处理函数，特别是从`Promise.all([ .. ])`返回的那一个。

### Promise.race([ .. ])

尽管`Promise.all([ ..])`协调多个并发 promise 的运行，并假定所有 Promise 都需要完成，但有时候你会想只响应“第一个夸过终点线的 Promise”，而抛弃其他 Promise。

这种模式传统上称为门闩，但在 Promise 中称为竞态。

> [!WARNING]
> 虽然“只有第一个到达终点的才算胜利”这个比喻很好地描述了其行为特性，但遗憾的是，由于竟态条件通常被认为是程序中的 bug（参见第 1 章），
> 所以从某种程度上说，“竞争”这个词已经是一个具有固定意义的术语了。不要混淆了`Promise.race([ .. ])`和竟态条件。

`Promise.race([ .. ])`也接受单个数组参数。这个数组由一个或多个 Promise、thenable 或者立即值组成。立即值之间的竞争在实践中没有太大意义，因为显然列表中的第一个会获胜，
就像赛跑中有一个选手是从重点开始比赛一样！

与`Promise.all([ .. ])`类似，一旦有任何一个 Promise 决为完成，`Promise.race([ .. ])`就会完成；一旦有任何一个 Promise 决议为拒绝，它就会拒绝。

> [!WARNING]
> 一项竞赛需要至少一个“参赛者”。所以，如果你传入了一个空数组，主`race([ .. ])`Promise 永远不会决议，而不是立即决议。这很容易搬起石头砸自己的脚！ES6
> 应该指定它完成或拒绝，抑或只是抛出某种同步错误。遗憾的是，因为 Promise 库在时间上早于 ES6，他们不得已遗留了这个问题，所以，要注意，永远不要传递空数组。

再回顾一下前面的并发 Ajax 例子，不过这次的 p1 和 p2 是竞争关系：

```javascript
// request(..)是一个支持Promise的Ajax工具
// 就像我们在本章前面定义的一样

var p1 = request('http://some.url.1/')
var p2 = request('http://some.url.2/')

Promise.race([p1, p2])
  .then(function (msg) {
    // p1或p2将赢得这场竞赛
    return request('http://some.url.3/?v=' + msg)
  })
  .then(function (msg) {
    console.log(msg)
  })
```

因为只有一个 promise 能够取胜，所以完成只是单个消息，而不是像对`Promise.all([ ..])`那样的是一个数组。

#### 超时竞赛

我们之前看到过这个例子，其展示了如何使用`Promise.race([ .. ])`表达 Promise 超时模式：

```javascript
// foo()是一个支持Promise的函数
// 前面定义的timeoutPromise(..)返回一个promise，
// 这个promise会在指定延时之后拒绝

// 为foo()设定超时
Promise.race([
  foo(), // 启动foo()
  timeoutPromise(3000), // 给它3秒钟
]).then(
  function () {
    // foo()按时完成！
  },
  function (err) {
    // 要么foo()被拒绝，要么只是没能够按时完成，
    // 因此要查看err了解具体原因
  }
)
```

在多数情况下，这个超时模式能够很好的工作。但是，还有一些微妙的情况需要考虑，并且坦白地说，对于`Promise.race([ .. ])`和`Promise.all([ .. ])` 也都是如此。

#### finally

一个关键问题是：“那些被丢弃或忽略的 promise 会发生什么呢？”我们并不是从性能的角度提出这个问题的 —— 通常最终它们会被垃圾回收 —— 而是从行为的角度（副作用等）。
Promise 不能被取消，也不应该被取消，因为那会摧毁本章稍后的“无法取消的 Promise”一节中讨论的外部不可变性原则，所以它们只能被默默忽略。

那么如果前面例子中的`foo()`保留了一些要用的资源，但是出现了超时，导致这个 promise 被忽略，这又会怎样呢？在这种模式中，会有什么为超时后主动释放这些保留资源提供任何支持，
或者取消任何可能产生的副作用吗？如果你想要的只是记录下`foo()`超时这个事实，又会如何呢？

有些开发者提出，Promise 需要一个`finally(..)`回调注册，这个回调在 Promise 决议后总是会被调用，并且允许你执行任何必要的清理工作。目前，规范还没有支持这一点，
不过在 ES7+中也许可以。只好等等看了。

它看起来可能类似于：

```javascript
var p = Promise.resolve(42)

p.then(something).finally(cleanup).then(another).finally(cleanup)
```

> [!NOTE]
> 在各种各样的 Promise 库中，`finally(..)`还是会创建并返回一个新的 Promise（以支持链接继续）。如果`cleanup()`函数要返回一个 Promise 的话，这个 promise
> 就会被链接到链中，这意味着这里还是会有前面讨论过的未处理拒绝问题。

同时，我们可以构建一个静态辅助工具来查看（而不影响）Promise 的决议：

```javascript
// polyfill安全的guard检查
if (!Promise.observe) {
  Promise.observe = function (pr, cb) {
    // 观察pr的决议
    pr.then(
      function fulfilled(msg) {
        // 安排异步回调（作为Job）
        Promise.resolve(msg).then(cb)
      },
      function rejected(err) {
        // 安排异步回调（作为Job）
        Promise.resolve(err).then(cb)
      }
    )
    // 返回最初的promise
    return pr
  }
}
```

下面是如何在前面的超时例子中使用这个工具：

```javascript
Promise.race([
  Promise.observe(foo(), function cleanup(msg) {
    // 在`foo()`之后清理，即使它没有在超时之前完成
  }),
  timeoutPromise(3000), // 给它3秒钟
])
```

这个辅助工具`Promise.observe(..)`只是用来展示可以如何查看 Promise 的完成而不对其产生影响。其他的 Promise 库有自己的解决方案。不管如何实现，
你都很可能遇到需要确保 Promise 不会被意外默默忽略的情况。

### `all([ .. ])`和`race([ .. ])`的变体

虽然原生 ES6 Promise 中提供了内建的`Promise.all([ .. ])`和`Promise.race([ .. ])`，但这些语义还有其他几个常见的变体模式。

- `none([ .. ])` - （没进入标准，当所有 promise 拒绝时，进入 onFulfilled(errors)；只要有一个成功，就立即失败进入 onRejected(success)）

  这个模式类似于`all([ .. ])`，不过完成和拒绝的情况互换了。所有的 Promise 都要被拒绝，即拒绝转化为完成值，反之亦然。

- `any( [ .. ])` - （进入标准库，返回第一个完成的 promise，全都拒绝返回`AggregateError`）

  这个模式与`all([ .. ])`类似，但是会忽略拒绝，所以只需要完成一个而不是全部。

- `first([ .. ])` - （没进入标准，返回第一个完成的 promise，忽略后续的任何拒绝和完成）

  这个模式类似于`any([ .. ])`的竞争，即只要第一个 Promise 完成，它就会忽略后续的任何拒绝和完成。

- `last([ .. ])` - （没进入标准，返回最后一个完成的 promise）

  这个模式类似于`first([ .. ])`。但却是只有最后一个完成胜出。

这些 Promise 抽象库提供了这些支持，但也可使用 Promise、`race([ .. ])`和`all([ .. ])`这些机制，你自己来实现它们。

比如，可以像这样定义`first([ .. ])`：

```javascript
// polyfill安全的guard检查
if (!Promise.first) {
  Promise.first = function (prs) {
    return new Promise(function (resolve, reject) {
      // let rejectCounter = 0
      prs.forEach(pr => {
        // 把值规整化
        Promise.resolve(pr)
          // 不管哪个最先完成，就决议主promise
          .then(
            resolve
            // ,function () {
            //   ++rejectCounter
            //   if (rejectCounter === prs.length) {
            //     reject(new Error('All promises were rejected'))
            //   }
            // }
          )
      })
    })
  }
}
```

> [!NOTE]
> 在这个`first(..)`视线中，如它的所有 promise 都拒绝的话，它不会拒绝。它只会挂住，非常类似于`Promise.race([])`。如果需要的话，可以添加额外的逻辑
> 跟踪每个 promise 拒绝。如果所有的 promise 都被拒绝，就在主 promise 上调用 reject()。这个实现留给你当练习。

### 并发迭代

有些时候会需要在一列 Promise 中迭代，并对所有 Promise 都执行某个任务，非常类似于对同步数组可以做的那样（比如`forEach(..)`、`map(..)`、`some(..)`和`every(..)`）。如果要对每个 Promise 执行的任务本身是同步的，那这些工具就可以工作，就像前面代码中的`forEach(..)`。

但如果这些任务从根本上是异步的，或者可以/应该并发执行，那你可以使用这些工具的异步版本，许多库中提供了这样的工具。

举例来说，让我们考虑一下一个异步的`map(..)`工具。它接收一个数组的值（可以是 Promise 或其他任何值），外加要在每个值上运行一个函数（任务）作为参数。`map(..)`
本身返回一个 promise，其完成值是一个数组，该数组（保持映射顺序）保存任务执行之后的异步完成值：

```javascript
if (!Promise.map) {
  Promise.map = function (vals, cb) {
    // 一个等待所有map的promise的新promise
    return Promise.all(
      // 注：一般数组的map(..)`把值数组转换为promise数组
      vals.map(val => {
        // 用val异步map之后决议的新promise替换val
        return new Promise(resolve => {
          cb(val, resolve)
        })
      })
    )
  }
}
```

> [!NOTE]
> 在这个`map(..)`实现中，不能发送异步拒绝信号，当如果在映射的回调`cb(..)`内出现同步的异常或错误，主`Promise.map(..)`返回的 promise 就会拒绝。

下面展示如何在一组 Promise（而非简单的值）上使用`map(..)`：

```javascript
var p1 = Promise.resolve(21)
var p2 = Promise.resolve(42)
var p3 = Promise.reject('Oops')

// 把列表中的值加倍，即使是在Promise中
Promise.map([p1, p2, p3], function (pr, done) {
  // 保证这一条本身是一个Promise
  Promise.resolve(pr).then(
    // 提取值作为v
    function (v) {
      // map 完成的v到新值
      done(v * 2)
    },
    // 或者map到promise拒绝消息
    done
  )
}).then(function (vals) {
  console.log(vals) // [42, 84, 'Oops']
})
```

## Promise API 概述

本章已经在多处零零碎碎地展示了 ES6 Promise API，现在让我们来总结一下。

> [!NOTE]
> 下面的 API 只对于 ES6 是原生的，但是有符合规范的适配版（不只是对 Promise 库的扩展），其定义了 Promise 及它的所有相关特性，这样你在前 ES6 浏览器
> 也可以使用原生 Promise。这样的适配版之一是[Native Promise Only](http://github.com/getify/native-promise-only)，是我写的。

### new Promise(..)构造器

有启示性的构造器 Promise(..)必须和 new 一起使用，并且必须提供一个函数回调。这个回调是同步的或立即调用的。这个函数接受两个函数回调，用以支持 promise 的决议。
通常我们把这两个函数称为`resolve(..)`和`reject(..)`：

```javascript
var p = new Promise(function (resolve, reject) {
  // resolve(..)用以决议/完成这个promise
  // reject(..)表示拒绝这个promise
})
```

`reject(..)`就是拒绝这个 promise；但`resolve(..)`既可能完成 promise，也可能拒绝，要根据传入参数而定。如果传给`resolve(..)`的是一个非 Promise、非 thenable
的立即值，这个 promise 就会用这个值完成。

但是，如果传给`resolve(..)`的是一个真正的 Promise 或 thenable 值，这个值就会被递归展开，并且（要构造的）promise 将取用其最终决议值或状态。

### Promise.resolve(..)和 Promise.reject(..)

创建一个一被拒绝的 Promise 的快捷方式是使用`Promise.reject(..)`，所以以下两个 promise 是等价的：

```javascript
var p1 = new Promise(function (resolve, reject) {
  reject('Oops')
})

var p2 = Promise.reject('Oops')
```

`Promise.resolve(..)`常用于创建一个已完成的 Promise，使用方式与`Promise.reject(..)`类似。但是，`Promise.resolve(..)`也会展开 thenable 值（前面已多次介绍）。
在这种情况下，返回的 Promise 采用传入的这个 thenable 的最终决议值，可能是完成，也可能是拒绝：

```javascript
var fulfilledTh = {
  then: function (cb) {
    cb(42)
  },
}

var rejectedTh = {
  then: function (cb, errCb) {
    errCb('Oops')
  },
}

var p1 = Promise.resolve(fulfilledTh)
var p2 = Promise.resolve(rejectedTh)
```

还要记住，如果传入的是真正的 Promise，`Promise.resolve(..)`什么都不会做，只会直接把这个值返回。所以，对你不了解属性的值调用`Promise.resolve(..)`，如果
它恰好是一个真正的 Promise，是不会有额外的开销的。

### then(..)和 catch(..)

每个 Promise 实例（不是 Promise API 命名空间）都有`then(..)`和`catch(..)`方法，通过这两个方法可以为这个 Promise 注册完成和拒绝处理函数。Promise 决议之后，
立即会调用这两个处理函数之一，但不会两个都调用，而且总是异步调用（参见第一章的“Jobs”）。

`then(..)`接受一个或两个参数：第一个用于完成回调，第二个用于拒绝回调。如果两者中的任何一个被省略或者作为非函数值传入的话，就会替换为相应的默认回调。默认完成回调
只是把消息传递下去，而默认拒绝回调则只是重新抛出（传播）其接受到的出错原因。

就像刚刚讨论过的一样，`catch(..)`只接受一个拒绝回调作为参数，并自动替换默认完成回调。换句话说，它等价于`then(null, ..)`：

```javascript
p.then(fulfilled)

p.then(fulfilled, rejected)

p.catch(rejected) // 或者 p.then(null, rejected)
```

`then(..)`和`catch(..)`也会创建并返回一个新的 promise，这个 promise 可以用于实现 Promise 链式流程控制。如果完成或拒绝回调中抛出异常，返回的 promise 是被拒绝的。
如果任意一个回调返回非 Promise、非 thenable 的立即值，这个值会被用做返回 promise 的完成值。如果完成处理函数返回一个 promise 或 thenable，那么这个值会被展开，并作为
返回 promise 的决议值。

### Promise.all([ .. ])和 Promise.race([ .. ])

ES6 Promise API 静态辅助函数`Promise.all([ .. ])`和`Promise.race([ .. ])`都会创建一个 Promise 作为它们的返回值。这个 promise 的决议完全由
传入的 promise 数组控制。

对`Promise.all([ .. ])`来说，只有传入的所有 promise 都完成，返回 promise 才能完成。如果有任何 promise 被拒绝，返回的主 promise 就立即会被拒绝（抛弃
任何其他 promise 的结果）。如果完成的话，你会得到一个数组，其中包含传入的所有 promise 的完成值。对于拒绝的情况，你只会得到第一个拒绝 promise 的拒绝理由值。
这种模式传统上被称为门（gate）：所有人都到齐了才开门。

对`Promise.race([ .. ])`来说，只有第一个决议的 promise（完成或拒绝）取胜，并且其解决结果成为返回 promise 的决议。
这种模式传统上称为门闩：第一个到达者打开门闩通过。考虑：

```javascript
var p1 = Promise.resolve(42)
var p2 = Promise.resolve('Hello World')
var p3 = Promise.reject('Oops')

Promise.race([p1, p2, p3]).then(function (msg) {
  console.log(msg) // 42
})

Promise.all([p1, p2, p3]).catch(function (err) {
  console.error(err) // 'Oops'
})

Promise.all([p1, p2]).then(function (msgs) {
  console.log(msgs) // [42, 'Hello World']
})
```

> [!WARNING]
> 当心！若向`Promise.all([ .. ])`传入空数组，它会立即完成，但`Promise.race([ .. ])`会挂起，且永远不会决议。

ES6 Promise API 非常简单直观。它至少足以处理最基本的异步情况，并且如果要重新整理，把代码从地狱回调解救出来的话，它也是一个很好的起点。

但是，应用常常会有很多更复杂的异步情况需要实现，而 Promise 本身对此在处理上具有局限性。下一节会深入探讨这些局限，理解 Promise 库出现的动机。

## Promise 局限性

这一届讨论的许多细节本章之前都已经有所提及，不过我们还是一定要专门总结这些局限性才行。

### 顺序错误处理

本章前面已经详细介绍了适合 Promise 的错误处理。Promise 的设计局限性（具体来说，就是它们的链接的方式）造成了一个让人很容易中招的陷阱，
即 Promise 链中的错误很容易被无意中默默忽略掉。

关于 Promise 错误，还有其他需要考虑的地方。由于一个 Promise 链仅仅是连接到一起的成员 promise，没有把整个链标识为一个个体的实体，这意味着
没有外部方法可以用于观察可能发生的错误。

如果构建了一个没有错误处理函数的 Promise 链，链中任何地方的任何错误都会在链中一直传播下去，直到被查看（通过在某个步骤注册拒绝处理函数）。在这个特定的例子中，
只要有一个指向链中最后一个 promise 的引用就足够了（下面代码中的 p），因为你可以在那里注册拒绝处理函数，而且这个处理函数能够得到所有传播过来的错误的通知：

```javascript
// foo(..)，STEP2(..)以及STEP3(..)都是支持Promise的

var p = foo(42).then(STEP2).then(STEP3)
```

虽然这里可能有点鬼祟、令人迷惑，但是这里的 p 并不指向链中的第一个 promise（调用`foo(42)`产生的那一个），而是指向最后一个 promise，即
来自调用`then(STEP3)`的那一个。

还有，这个 Promise 链中的任何一个步骤都没有显式的处理自身错误。这意味着你可以在 p 上注册一个拒绝错误处理函数，对于链中任何位置出现的任何错误，
这个处理函数都会得到通知：

```javascript
p.catch(handleErrors)
```

但是，如果链中的任何一个步骤事实上进行了自身的错误处理（可能以隐藏或抽象的不可见的方式），那你的`handleErrors(..)`就不会得到通知。这可能是你想要的 —— 毕竟这是
一个“已处理的拒绝” —— 但也可能并不是。完全不能得到（对任何“已经处理”的拒绝错误的）错误通知也是一个缺陷，它限制了某些用例的功能。

基本上，这等同于`try..catch`存在的局限：`try..catch`可能捕获一个异常并简单的吞掉它。所以这并不是 Promise 独有的局限性，但可能是我们希望绕过的陷阱。

遗憾的是，很多时候并没有为 Promise 链序列的中间步骤保留的引用。因此，没有这样的引用，你就无法关联错误处理函数来可靠的检查错误。

### 单一值

根据定义，Promise 只能有一个完成值或一个拒绝理由。在简单的例子中，这不是什么问题，但是在更复杂的场景中，你可能就会发现这是一种局限了。

一般的建议是构造一个值封装（比如一个对象或数组）来保持这样的多个信息。这个解决方案可以起作用，但要在 Promise 链中的每一步都进行封装和解封，就十分丑陋和笨重了。

#### 分裂值

有时候你可以把这一点当作提示你可以/应该把问题分解为两个或更多 Promise 的信号。

设想你有一个工具`foo(..)`，它可以异步产生两个值（x 和 y）：

```javascript
function getY(x) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(3 * x - 1)
    }, 100)
  })
}

function foo(bar, baz) {
  var x = bar * baz

  return getY(x).then(function (y) {
    // 把两个值封装到容器中
    return [x, y]
  })
}

fo(10, 20).then(function (msgs) {
  var x = msgs[0]
  var y = msgs[1]

  console.log(x, y) // 200 599
})
```

首先，我们重新组织一下`foo(..)`返回的内容，这样就不再需要把 x 和 y 封装到一个数组值中以通过 promise 传输。取而代之的是，我们可以把每个值封装到它自己的 promise：

```javascript
function foo(bar, baz) {
  var x = bar * baz
  // 返回两个promise

  return [Promise.resolve(x), getY(x)]
}

Promise.all(foo(10, 20)).then(function (msgs) {
  var x = msgs[0]
  var y = msgs[1]

  console.log(x, y) // 200 599
})
```

一个 promise 数组真的要优于传递给单个 promise 的一个值数组吗？从语法的角度来说，这算不上是一个改进。

但是，这种方法更符合 Promise 的设计理念。如果以后需要重构代码把对 x 和 y 的计算分开，这种方法就简单得多。由调用代码来决定如何安排这两个 promise，而不是把这种细节
放在`foo(..)`内部抽象，这样更整洁也更灵活。这里使用了`Promise.all([ .. ])`，当然，这并不是唯一的选择。

#### 展开/传递参数

`var x = ..`和`var y = ..`赋值操作仍然是麻烦的开销。我们可以在辅助工具中采用某种函数技巧（感谢 Reginald Braithwaite， 推特：@raganwald）：

```javascript
function spread(fn) {
  return Function.apply.bind(fn, null)
}

// 看上边的函数卡壳了，这个注释代码是导图
// const obj = {
//   a: 1,
//   foo(x) {
//     return this.a * x
//   },
// }
// obj.foo.call({ a: 2 }, 3)

Promise.all(foo(10, 20)).then(
  spread(function (x, y) {
    console.log(x, y) // 200 599
  })
)
```

这样会好一点！当然，你可以把这个函数戏法在线化，以避免额外的辅助工具：

```javascript
Promise.all(foo(10, 20)).then(
  Function.apply.bind(function (x, y) {
    console.log(x, y) // 200 599
  }, null)
)
```

这些技巧可能很灵巧，但 ES6 给出了一个更好的答案：解构。数组解构赋值形式看起来是这样的：

```javascript
Promise.all(foo(10.2)).then(function (msgs) {
  var [x, y] = msgs
  console.log(x, y) // 200 599
})
```

不过最好的是，ES6 提供了数组参数结构形式：

```javascript
Promise.all(foo(10, 20)).then(function ([x, y]) {
  console.log(x, y) // 200 599
})
```

现在，我们符合了“每个 Promise 一个值”的理念，并且又将重复样板代码量保持在了最小！

> [!NOTE]
> 关于 ES6 解构形式的更多信息，请参考本系列的*ES6 与未来*。

### 单决议

Promise 最本质的一个特征是：Promise 只能被决议一次（完成或拒绝）。在许多异步情况中，你只会获取一个值一次，所以这可以工作良好。

但是，还有很多异步的情况适合另一种模式 —— 一种类似于事件或数据流的模式。在表面上，目前还不清楚 Promise 能不能很好用于这样的用例，如果不是完全不可用的话。
如果不在 Promise 之上构建显著的抽象，Promise 肯定完全无法支持多值决议处理。

设想这样一个场景：你可能要启动一系列异步步骤以响应某种可能多次发生的激励（就像事件），比如按钮点击。

这样可能不会按照你的期望工作：

```javascript
// click(..)把 click 事件绑定到一个DOM元素
// request(..)是一个支持Promise的Ajax工具

var p = new Promise(function (resolve, reject) {
  click('#myBtn', resolve)
})

p.then(function (evt) {
  var btnId = evt.currentTarget.id
  return request('http://some.url.1/?id=' + btnId)
}).then(function (tex, cbt) {
  console.log(text)
})
```

只有在你的应用只需要响应按钮点击一次的情况下，这种方式才能工作。如果这个按钮被点击了第二次的话，promise p 已经决议，因此第二个`resolve(..)`调用就会被忽略。

因此，你可能需要转化这个范例，为每个事件的发生创建一整个新的 Promise 链：

```javascript
click('#myBtn', function (evt) {
  var btnId = evt.currentTarget.id

  request('http://some.url.1/?id=' + btnId).then(function (text) {
    console.log(text)
  })
})
```

这种方法可以工作，因为针对这个按钮上的每个“click”事件都会启动一整个新的 Promise 序列。

由于需要在事件处理函数中定义整个 Promise 链，这很丑陋。除此之外，这个设计在某种程度上破坏了*关注点与功能分离*（SoC）的思想。你很可能想要把事件处理函数的定义
和对事件的响应（那个 Promise 链）的定义放在代码中的不同位置。如果没有辅助机制的话，在这种模式下很难这样实现。

> [!NOTE]
> 另外一种清晰展示这种局限性的方法是：如果能够构建某种“可观测量”（observable），可以将一个 Promise 链对应到这个“可观测量”就好了。有一些库已经创建了这样的抽象（
> 比如[RxJS](https://rxjs.dev/guide/observable)），但是这种抽象看起来非常笨重，以至于你甚至已经看不到任何 Promise 本身的特性。这样厚重的抽象带来了一些需
> 要考虑的重要问题，比如这些机制（无 Promise）是否像 Promise 本身设计的那样可以信任。附录 B 会再次讨论这种“可观测量”模式。

### 惯性

要在你自己的代码中开始使用 Promise 的话，一个具体的障碍是，现存的所有代码都还不理解 Promise。如果你已经有大量基于回调的代码，那么保持编码风格不变要简单得多。

“运动状态（使用回调的）的代码库会一直保持运动状态（使用回调），直到受到一位聪明的、理解 Promise 的开发者的作用。”

Promise 提供了一种不同的范式，因此，编码方式的改变程度从某处的个别差异到某种情况下的截然不同都有可能。你需要刻意的改变，因为 Promise 不会从目前的编码方式
中自然而然地衍生出来。

考虑如下的类似基于回调的场景：

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

能够很快明显看出要把这段基于回调的代码转化为基于 Promise 的代码应该从哪些步骤开始吗？这要视你的经验而定。时间越多，越会觉得得心应手。但可以确定的是，Promise
并没有明确表示要如何实现转化。没有放之四海皆准的答案，责任还是在你的身上。

如前所述，我们绝对需要一个支持 Promise 而不是基于回调的 Ajax 工具，可以称之为`request(..)`。你可以实现自己的版本，就像我们所做的一样。但是，如果不得不为每个基于
回调的工具定义支持 Promise 的封装，这样的开销会让你不太可能选择支持 Promise 的重构。

Promise 没有为这个局限性直接提供答案。多数 Promise 库确实提供辅助工具，但即使没有库，也可以考虑如下的辅助工具：

```javascript
// polyfill安全的guard检查
if (!Promise.wrap) {
  Promise.wrap = function (fn) {
    return function () {
      var args = [].slice.call(arguments)

      return new Promise(function (resolve, reject) {
        fn.apply(
          null,
          args.concat(function (err, v) {
            if (err) {
              reject(err)
            } else {
              resolve(v)
            }
          })
        )
      })
    }
  }
}
```

好吧，这不只是一个简单的小工具。然而，尽管它看起来有点令人生畏，但是实际上并不像你想的那么糟糕。它接受一个函数，这个函数需要一个`error-first`风格的回调作为第一个
参数，并返回一个新的函数。返回的函数自动创建一个 Promise 并返回，并替换回调，连接到 Promise 完成或拒绝。

与其花费太多时间解释这个`Promise.wrap(..)`辅助工具的工作原理，还不如直接看看其使用方式：

```javascript
var request = Promise.wrap(ajax)
request('http://some.url.1/').then()
```

哇，非常简单！

`Promise.wrap(..)`并不产出 Promise。它产出的是一个将产生 Promise 的函数。在某种意义上，产生 Promise 的函数可以看作是一个 Promise 工厂。
我提议将其命名为“Promisory”（Promise + factory）。

把需要回调的函数封装为支持 Promise 的函数，这个动作有时被称为“提升”或“Promise 工厂化”。但是，对于得到的结果函数来说，除了“被提升函数”似乎就没有什么标准术语可称呼了。
所以我更喜欢“Promisory”这个词，我认为它的描述更准确。

> [!NOTE]
> promisory 并不是编造的。它是一个真实的单词，意思是包含或传输一个 promise。这正是这些函数所做的，所以这个术语与其意义匹配的很完美。

如果所有函数都已经是 promisory，我们就不需要自己构造了，所以这个额外的步骤有点可惜。但至少这个封装模式（通常）是重复的，所以我们可以像前面展示的那样把它
放入`Promise.wrap(..)`辅助工具，以帮助我们的 promise 代码。

所以，回到前面的例子，我们需要为`ajax(..)`和`foo(..)`都构造一个 promisory：

```javascript
// 为ajax(..)构造一个promisory
var request = Promise.wrap(ajax)

// 重构foo(..)，但使其外部成为基于外部回调的，
// 与目前代码的其他部分保持通用
// ———— 只在内部使用request(..)的promise
function foo(x, y, cb) {
  request('http://some.url.1/?x=' + x + '&y=' + y).then(function fulfilled(text) {
    cb(null, text)
  }, cb)
}

// 现在，为了这段代码的目的，为`foo(..)`构造一个promisory
var betterFoo = Promise.wrap(foo)

// 并使用这个promisory
betterFoo(11, 31).then(
  function fulfilled(text) {
    console.log(text)
  },
  function rejected(err) {
    console.error(err)
  }
)
```

当然，尽管我们在重构`foo(..)`以使用新的`request(..)`promisory，但是也可以使`foo(..)`本身成为一个 promisory，而不是保持基于回调的形式并需要构建和使用
后续的`betterFoo(..)`promisory。这个决策就取决于`foo(..)`是否需要保持与代码库中其他部分兼容的基于回调的形式。

考虑：

```javascript
// 现在`foo(..)`也是一个promisory，因为它委托了`request(..)`

function foo(x, y) {
  return request('http://some.url.1/?x=' + x + '&y=' + y)
}

foo(11, 31).then()
```

虽然原生 ES6 Promise 并没有提供辅助函数用于这样的 promisory 封装，但多数库都提供了这样的支持，或者你也可以构建自己的辅助函数。不管采用何种方式，解决 Promise 这个特定的限制
都不需要太多代价（可对比回调地狱给我们带来的痛苦！）。

### 无法取消的 Promise

一旦创建了一个 Promise 并为其注册了完成和/或拒绝处理函数，如果出现某种情况使得这个任务悬而未决的话，你也没有办法从外部停止它的进程。

> [!NOTE]
> 很多 Promise 抽象库提供了工具来取消 Promise，但这个思路很可怕！很多开发者希望 Promise 的原生设计就具有外部取消功能，但问题是，这可能会使 Promise 的一个消费者或观察者
> 影响其他消费者查看这个 Promise。这违背了未来值的可信性（外部不变性），但更坏的是，这是
> [“远隔作用”（action at a distance）](<https://zh.wikipedia.org/wiki/%E8%BF%9C%E9%9A%94%E4%BD%9C%E7%94%A8_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6)>)
> 反模式的体现。不管看起来如何有用，这实际上会导致你重陷与使用回调同样的噩梦。

考虑前面的 Promise 超时场景：

```javascript
var p = foo(42)

Promise.race([p, timeoutPromise(3000)]).then(doSomething, handleError)

p.then(function () {
  // 即使在超时的情况下也会发生 :(
})
```

这个“超时”相对于 promise p 是外部的，所以 p 本身还会继续运行，这一点可能并不是我们所期望的。

一种选择是侵入式地定义你自己的决议回调：

```javascript
var OK = true
var p = foo(42)

Promise.race([
  p,
  timeoutPromise(300).catch(function (err) {
    OK = false
    throw err
  }),
]).then(doSomething, handleError)

p.then(function () {
  if (OK) {
    // 只有没有超时情况下才会发生 :)
  }
})
```

这很丑陋。它可以工作，但是离理想实现还差很远。一般来说，应避免这样的情况。

但如果没法避免的话，这个解决方案的丑陋应该是一个线索，它提示*取消*这个功能属于 Promise 之上更高级的抽象。我建议你应查看 Promise 抽象库以获得帮助，而不是 hack 自己的版本。

> [!NOTE]
> 我的 Promise 抽象库 asynquence 提供了这样一个抽象，还有一个为序列提供了`abort()`功能，这些内容都会在本部分的附录 A 中讨论。

单独的一个 Promise 并不是一个真正的流程控制机制（至少不是很有意义），这正是*取消*所涉及的层次（流程控制）。这就是为什么 Promise 取消总是让人感觉很别扭。

相比之下，集合在一起的 Promise 构成的链，我喜欢称之为一个“序列”，就是一个流程控制的表达，因此将取消定义在这个抽象层次上是合适的。

单独的 Promise 不应该可取消，但是取消一个可序列是合理的，因为你不会像对待 Promise 那样把序列作为一个单独的不变值来传递。

### Promise 性能

这个特定的局限性既简单又复杂。

把基本的基于回调的异步任务链与 Promise 链中需要移动的部分数量进行比较。很显然，Promise 进行的动作要多一些，这自然意味着它也会稍慢一些。请回想 Promise 提供的信任保障列表，
再与你要在回调之上建立同样的保护自建的解决方案来比较一下。

更多的工作，更多的保护。这些意味着 Promise 与不可信任的裸回调相比会更慢一些。这是显而易见的，也很容易理解。

但会慢多少呢？呃，实际上，要精确回答这个问题极其困难。

坦白地说，这有点像是拿苹果和桔子相比，所以这可能就是一个错误的问题。实际上们应该比较的是提供了同样保护的手工自建回调系统是否能够快于 Promise 实现。

如果说 Promise 确实有一个真正的性能局限的话，那就是它们没有真正提供可信任性保护支持的列表以供选择（你总是得到全部）。

虽然如此，如果我们承认 Promise 通常要比其非 Promise、非可信任回调的等价系统慢一点（假定有些情况下你认为可以接受可信任性的缺乏），这是否意味着应该完全避免 Promise，
就好像你整个应用的唯一驱动力就是必须采用尽可能快的代码呢？

合理性检查：如果你的代码有合理的理由这样要求，那么 JS 是否真的是实现这样任务的正确语言呢？我们可以优化 JS，使其高性能运行应用（参见第 5 章和第 6 章）。但是，耿耿于 Promise
微小的性能损失而无视它提供的所有优点，真的合适吗？

另一个微妙的问题是：Promise 使所有一切都成为异步的了，即有一些立即（同步）完成的步骤仍然会延迟到任务的下一步（参见第一章“JOB”）。这意味着一个 Promise 任务序列可能比完全通过回调
连接的同样的任务序列运行得稍慢一点。

当然，这里的问题是：本章介绍的 Promise 的这些优点是否值得付出这些微小的性能损失。

我的观点是：几乎所有那些你可能认为 Promise 性能会慢到需要担心的情况，实际上都是通过绕开 Promise 可信任性和可组合性优化掉了它们带来的好处的反模式。

取而代之的是，在默认情况下，你应该在代码中使用它们，然后对你应用的热路径进行性能分析。Promise 真的是性能瓶颈呢，还是只有理论上的性能下降呢？只有这样，
具备了真实有效的性能测评（参见第 6 章），在这些识别出来的关键区域分离出 Promise 才是审慎负责的。

Promise 稍慢一些，但是作为交换，你得到的是大量内建的可信任性、对 Zalgo 的避免以及可组合性。可能局限性实际上并不是它们的真实表现，而是你缺乏发现其好处的眼光呢？

## 复习

Promise 非常好，请使用。它们解决了我们因只用回调的代码而备受困扰的*控制反转*问题。

它们并没有摒弃回调，只是把回调的安排转交给了一个位于我们和其他工具之间的可信任的中介机制。

Promise 链也开始提供（尽管并不完美）以顺序的方式表达异步流的一个更好的方式，这有助于我们的大脑更好的计划和维护异步 JS 代码。我们将在第 4 章看到针对这个问题的一种更好的解决方案！

[^the-revealing-constructor-pattern]: [显示构造器](https://blog.domenic.me/the-revealing-constructor-pattern/)
[^race-condition]: [竟态条件](https://zh.wikipedia.org/wiki/%E7%AB%B6%E7%88%AD%E5%8D%B1%E5%AE%B3)
