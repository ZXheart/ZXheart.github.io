# :zzz:

[《你不知道的 JavaScript》](https://github.com/ZXheart/You-Dont-Know-JS/blob/1ed-zh-CN/async%20%26%20performance/ch5.md)

# 程序性能

到目前为止，本书的内容都是关于如何更加有效地利用异步模式。但是，我们并没有直接阐述为什么异步对 JS 来说真的很重要。最显而易见的原因就是*性能*。

举例来说，如果要发出两个 Ajax 请求，并且它们之间是彼此独立的，但是需要等待两个请求都完成才能执行下一步的任务，那么为这个交互建模有两种选择：顺序与并发。

可以先发出第一个请求，然后等待第一个请求结束，之后发出第二个请求。或者，就像我们在 promise 和生成器部分看到的那样，也可以并行发出两个请求，然后用门模式
来等待两个请求完成，之后再继续。

显然，通常后一种模式会比前一种更高效。而更高的性能通常也会带来更好的用户体验。

甚至有可能异步（交替执行的并发）只能够提高感觉到的性能，而整体来说，程序完成的时间还是一样的。用户对性能的感知同样 —— 甚至更重要 —— 比实际可测量的性能还要重要！

现在我们不再局限于局部化的异步模式，而是将在程序级别上讨论更大图景下的性能细节。

> [!NOTE]
> 你可能想要了解一些微性能问题，比如`a++`和`++a`哪个更快。这一类性能细节将在第六章讨论。

## Web Worker

如果你有一些处理密集型的任务要执行，但不希望它们都在主线程运行（这可能会减慢浏览器/UI），可能你就希望 JS 能够以多线程的方式运行。

在第一章里，我们已经详细介绍了 JS 是如何单线程运作的。但是，单线程并不是组织程序执行的唯一方式。

设想一下，你把程序分为两个部分：一部分运行在主 UI 线程下，另外一部分运行在另一个完全独立的线程中。

这样的架构可能会引出哪些方面的问题？

一个就是，你会想要知道在独立的线程运行是否意味着它可以并行运行（在多 CPU/核心的系统上），这样第二个线程的长时间运行就不会阻塞程序主线程。否则，相比于 JS
中已有的异步并发，”虚拟多线程“并不会带来多少好处。

你还会想知道程序的这两个部分能否访问共享的作用域和资源。如果可以的话，那你就将遇到多线程语言（Java、C++等）要面对的所有问题，比如需要合作式或抢占式的锁机制（mutex 等）。
这是相当多的额外工作，不要小看。

还有，如果这两个部分能够共享作用域和资源的话，你会想要知道它们将如何通信。

在我们对 Web 平台 HTML5 的一个叫 Web Worker 的新增特性的探索过程中，这些都是很好的问题。这是浏览器（即宿主环境）的功能，实际上和 JS 语言本身几乎没什么关系。也就是说，JS 当前
并没有任何支持多线程执行的能力。

但是，想你的浏览器这样的环境，很容易提供多个 JS 引擎实例，各自运行在自己的线程上，这样你可以在每个线程上运行不同的程序。程序中每一个这样独立的多线程部分被称为一个(Web) Worker。
这种类型的并行化被称为“任务并行”，因为其重点在于把程序划分为多个块来并发运行。

从 JS 主程序（或另一个 Worker）中，可以这样实例化一个 Worker：

```javascript
var w1 = new Worker('http://some.url.1/mycoolworker.js')
```

这个 URL 应该指向一个 JS 文件的位置（而不是一个 HTML 页面！），这个文件将被加载到一个 Worker 中。然后浏览器启动一个独立的线程，让这个文件在这个线程中作为独立的程序运行。

> [!NOTE]
> 这样通过这样的 URL 创建的 Worker 成为专用 Worker（Dedicated Worker）。除了提供一个指向外部文件的 URL，你还可以提供一个 Blob URL（另外一个 HTML5 特性）创建一个内联
> Worker(Inline Worker)，本质上就是一个存储在单个（二进制）值中的在线文件。不过，Blob 已经超出了我们这里的讨论范围。

Worker 之间以及它们和主线程之间，不会共享任何作用域或资源，那会把所有多线程编程的噩梦带到前端领域，而是通过一个基本的事件消息机制相互联系。

Worker w1 对象是一个事件侦听者和触发者，可以通过订阅它来获得这个 Worker 发出的事件以及发送事件给这个 Worker。

以下是如何侦听事件（其实就是固定的“message”事件）：

```javascript
w1.addEventListener('message', function (evt) {
  // evt.data
})
```

也可以发送“message”事件给这个 Worker：

```javascript
w1.postMessage('something cool to say')
```

在这个 Worker 内部，收发消息是完全对称的：

```javascript
// "mycoolworker.js"

addEventListener('message', function (evt) {
  // evt.data
})

postMessage('a really cool reply')
```

注意，专用 Worker 和创建它的程序之间是一对一的关系。也就是说，“message”事件没有任何歧义需要消除，因为我们确定它只能来自这个一对一的关系：它要么来自这个 Worker，
要么来自主页面。

通常由主页面应用程序创建 Worker，但若是需要的话，Worker 也可以实例化它自己的子 Worker，称为 subworker。有时候，把这样的细节委托给一个“主”Worker，由它
创建其他 Worker 处理部分任务，这样很有用。不幸的是，到写作本书为止，Chrome 还不支持 subworker，不过 Firefox 支持。

要在创建 Worker 的程序中终止 Worker，可以调用 Worker 对象（就像前面代码中的 w1）上的`terminate()`。突然终止 Worker 线程不会给它任何机会完成它的工作或清理任何资源。
这就类似于通过关闭浏览器标签来关闭页面。

如果浏览器中有两个或多个页面（或同一页上的多个 tab！）试图从同一个文件 URL 创建 Worker，那么最终得到的实际上是完全独立的 Worker。后面我们会简单介绍如何共享 Worker。

> [!NOTE]
> 看起来似乎恶意或无知的 JS 程序只要在一个系统中生成上百个 Worker，让每个 Worker 运行在低级独立的线程上，就能够以此制造拒绝服务攻击（Dos 攻击）。
> 尽管这确实从某种程度上保证了每个 Worker 将运行在自己的独立线程上，但是这个保证并不是毫无限度的。系统能够决定可以创建多少个实际线程/CPI/核心。没有办法预测或保证
> 你能够访问多少个可用线程，尽管很多人假定至少可以达到 CPU/核心的数量。我认为最安全的假定就是在主 UI 线程之外还有一个线程，就是这样。

### Worker 环境

在 Worker 内部是无法访问主程序的任何资源的。这意味着你不能访问它的任何全局变量，也不能访问页面的 DOM 或者其他资源。记住，这是一个完全独立的线程。

但是，你可以执行网络请求（Ajax、WebSockets）以及设定定时器。还有，Worker 可以访问几个重要的全局变量和功能的本地副本。包括 navigator、location、JSON 和 applicationCache。

你还可以通过`importScripts(..)`向 Worker 加载额外的 JS 脚本：

```javascript
// 在Worker内部
importScripts('foo.js', 'bar.js')
```

这些脚本加载是同步的。也就是说，`importScripts(..)`调用会阻塞余下 Worker 的执行，直到文件加载和执行完成。

> [!NOTE]
> 另外，已经有一些讨论涉及把`<canvas>API`暴露给 Worker，以及把 canvas 变为 Transferable（参见下一节“数据传递”），这将使 Worker 可以执行更高级的 off-thread 图形处理，
> 这对于高性能游戏（WebGL）和其它类似的应用是很有用的。尽管目前的浏览器中还不存在这种支持，但很可能不远的将来就会有。

Web Worker 通常应用于哪些方面呢？

- 处理密集型数学计算

- 大数据集排序

- 数据处理（压缩、音频分析、图像处理等）

- 高流量网络通信

### 数据传递

你可能已经注意到这些应用中的大多数有一个共性，就是需要在线程之间通过事件机制传递大量的信息，可能是双向的。

在早期的 Worker 中，唯一的选择就是把所有数据序列化到一个字符串值中。除了双向序列化导致速度损失之外，另一个主要的负面因素是数据需要被复制，这意味着
两倍的内存使用（及其引起的垃圾收集方面的波动）。

谢天谢地，现在已经有了一些更好的选择。

如果要传递一个对象，可以使用*结构化克隆算法*（[structured clone algorithm](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)）
把这个对象复制到另一边。这个算法非常高级，甚至可以处理要复制的对象有循环引用的情况。这样就不用付出 to-string 和 from-string 的性能损失了，但是这种方案还是要使用双倍的内存。
IE10 及更高版本以及所有其他主流浏览器都支持这种方案。

还有一个更好的选择，特别是对于大数据集而言，就是使用[Transferable 对象](https://developer.chrome.com/blog/transferable-objects-lightning-fast?hl=zh-cn)。
这时发生的是对象所有权的转移，数据本身并没有移动。一旦你把对象传递到一个 Worker 中，在原地来的位置上，它就变为空的或者不可访问的，这样就消除了多线程编程作用域共享带来的混乱。
当然，所有权传递是可以双向进行的。

如果选择 Transferable 对象的话，其实不需要做什么。任何实现了[Transferable 接口](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Transferable_objects)
的数据结构就自动按照这种方式传输（Firefox 和 Chrome 都支持）。

举例来说，像 Unit8Array 这样的带类型的数组（参见本系列的“ES6 与未来”部分）就是 Transferable。下面是如何使用`postMessage(..)`发送一个 Transferable 对象：

```javascript
// 比如foo是一个Unit8Array
postMessage(foo.buffer, [foo.buffer])
```

第一个参数是一个原始缓冲区，第二个是一个要传输的内容的列表。

不支持 Transferable 对象的浏览器就降级到结构化克隆，这会带来性能下降而不是彻底的功能失效。

### 共享 Worker

如果你的站点或 app 允许多个 tab 加载同一个页面（一个常见的特性），那你可能非常希望通过防止重复专用 Worker 来降低系统的资源使用。在这一方面最常见的有限资源就是 socket 网络连接，
因为浏览器限制了到同一个主机的同时连接数目。当然，限制来自于同一客户端的连接数也减轻了你的资源压力。

在这种情况下，创建一个整个站点或 app 的所有页面实例都可以共享的中心 Worker 就非常有用了。

这称为 SharedWorker，可以通过下面的方式创建（只有 Firefox 和 Chrome 支持这一功能）：

```javascript
var w1 = new SharedWorker('http://some.url.1/mycoolworker.js')
```

因为共享 Worker 可以与站点的多个程序实例或多个页面连接，所以这个 Worker 需要通过某种方式来得知消息来自于哪个程序。这个唯一标识符称为*端口*（port），可以类比
网络 socket 的端口。因此，调用程序必须使用 Worker 的 port 对象用于通信：

```javascript
w1.port.addEventListener('message', handleMessage)

// ..

w1.port.postMessage('something coo')
```

还有，端口连接必须要初始化，形式如下：

```javascript
w1.port.start()
```

在共享 Worker 内部，必须要传递额外的一个事件：“connect”。这个事件为这个特定的连接提供了端口对象。保持多个连接独立的最简单办法就是使用 port 上的闭包（参见本系列的“作用域与闭包”部分），
就像下面的代码一样，把这个链接上的事件侦听和传递定义在“connect”事件的处理函数内部：

```javascript
// 在共享Worker内部

addEventListener('connect', function (evt) {
  // 这个连接分配的端口
  var port = evt.ports[0]

  port.addEventListener('message', function (evt) {
    // ..

    port.postMessage('..')

    // ..
  })

  // 初始化端口连接
  port.start()
})
```

除了这个区别之外，共享和专用 Worker 在功能和与一方面都是一样的。

> [!NOTE]
> 如果有某个端口链接终止而其它端口连接仍然活跃，那么共享 Worker 不会终止。而对专用 Worker 来说，只要实例化它的程序终止，它就会终止。

### 模拟 Web Worker

从性能的角度来说，将 Web Worker 用于并行运行 JS 程序是非常有吸引力的方案。但是，由于环境所限。你可能需要在缺乏对此支持的更老的浏览器中运行你的
代码。因为 Worker 是一种 API 而不是语法，所以我们可以作为扩展来模拟它。

如果浏览器不支持 Worker，那么从性能的角度来说是没法模拟多线程的。通常认为 Iframe 提供了并行环境，但是在所有的现代浏览器中，它们实际上都是和主页面
运行在同一个线程中，所以并不足以模拟并发。

就像我们在第一章中详细讨论的，JS 的异步（不是并行）来自于事件循环队列，所以可使用定时器（`setTimeout(..)`等）强制模拟实现异步的伪 Worker。
然后你只需要提供一个 Worker API 的封装。Modernizr [GitHub 页面](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills#web-workers)
上列出了一些实现，但坦白地说，它们看起来都不太好。

在这一点上，我也编写了一个模拟 Worker 的[概要实现](https://gist.github.com/getify/1b26accb1a09aa53ad25)。它是很基本的，但如果双向消息机制正确工作，
并且`onerror`处理函数也正确工作，那么它应该可以提供简单的 Worker 支持。如果需要的话，你也可以扩展它，实现更多的功能，比如`terminate()`或伪共享 Worker。

> [!NOTE]
> 因为无法模拟同步阻塞，所以这个封装不支持使用`importScripts(..)`。对此，一个可能的选择是，转并传递换 Worker 的代码（一旦 Ajax 加载之后）来重写一
> 个`importScript(..)`填补的一些异步形式，也许使用一个 promise 相关的接口。

## SIMD

单指令多数据（SIMD）是一种*数据并行*（data parallelism）方式，与 Web Worker 的*任务并行*（task parallelism）相对，因为这里的重点实际上不再是把程序逻辑
分成并行的块，而是并行处理数据的多个字节。

通过 SIMD，线程不再提供并行。相反，现代 CPU 提供了 SIMD 功能，通过“向量”（特定类型的数组），以及可以在所有这些数字上并行操作的指令。这些是
利用[指令级并行性](https://zh.wikipedia.org/wiki/%E6%8C%87%E4%BB%A4%E5%B1%A4%E7%B4%9A%E5%B9%B3%E8%A1%8C)进行的底层操作。

把 SIMD 功能暴露到 JS 的尝试最初是由
[Intel 发起的](https://www.intel.com/content/www/us/en/developer/articles/technical/boost-javascript-performance-by-exploiting-vectorization.html?wapkw=SIMD%20javascript)，
具体来说就是，Mohammad Haghighat（在本书写作时）与 Firefox 和 Chrome 团队合作。SIMD 目前正在进行早期的标准化，很有机会进入到 JS 的未来版本，比如 ES7。

SIMD JS 计划向 JS 代码暴露短向量类型和 API。在支持 SIMD 的那些系统中，这些运算将会直接映射到等价的 CPU 指令，而在非 SIMD 传统中就会退化回非并行化的运算。

对于数据密集型的应用（信号分析、关于图形的矩阵计算等等）这样的并行数学处理带来的性能收益是非常明显的！

在本书写作时，早期提案中的 API 形式类似如下：

```javascript
var v1 = SIMD.float32x4(3.14159, 21.0, 32.3, 55.55)
var v2 = SIMD.float32x4(2.1, 3.2, 4.3, 5.4)

var v3 = SIMD.int32x4(10, 101, 1001, 10001)
var v4 = SIMD.int32x4(10, 20, 30, 40)

SIMD.float32x4.mul(v1, v2) // [6.597339, 67.2, 138.89, 299.97]
SIMD.int32x4.add(v3, v4) // [20, 121, 1031, 10041]
```

这里展示的是两个不同的向量数据类型，32 位浮点数和 32 位整型。可以看到，这些向量大小恰好就是四个 32 位元素，因为这和多数当代 CPU 上支持的 SIMD 向量大小（128 位）匹配。
未来还有可能看到这些 API 的 x8（或更大！）版本。

除了`nul()`和`add()`，很多其他运算还可以包含在内，比如`sub()`、`div()`、`abs()`、`neg()`、`sqrt()`、`reciprocal()`、`reciprocalSqrt()`（算数）、
`shuffle()`（重新安排向量元素）、`and()`、`or()`、`xor()`、`not()`（逻辑）、`equal()`、`greaterThan()`、`lessThan()`（比较）、`shiftLeft()`、
`shiftRightLogical()`、`shiftRightArithmetic()`（位移）、`fromFloat32x4()`、以及`fromInt32x4()`（转换）。

> [!NOTE]
> 对于可用的[SIMD 功能](https://github.com/tc39/ecmascript_simd)，有一个官方的（有希望的、值得期待的、面向未来的 - 已经 gg 了）polyfill，
> 它展示了比我们这一节中多得多的计划好的 SIMD 功能。

## asm.js

[asm.js](http://asmjs.org/)这个标签是指 JS 语言中可以高度优化的的一个子集。通过小心避免某些难以优化的机制和模式（垃圾收集、类型强制转换，等等），asm.js 风格的代码
可以被 JS 引擎识别并进行特别激进的底层优化。

和本章前面讨论的其他程序性能机制不同，asm.js 并不是 JS 语言规范需要采纳的某种东西。虽然[asm.js 规范](http://asmjs.org/spec/latest/)的确存在，但它主要用来追踪一系列
达成一致的备选优化方案而不是对 JS 引擎的一组要求。

目前还没有提出任何新的语法。事实上，asm.js 提出了一些识别满足 asm.js 规则的现存标准 JS 语法的方法，并让引擎据此实现它们自己的优化。

浏览器提供者之间在关于程序中应如何激活 asm.js 这一点上有过一些分歧。早期版本的 asm.js 实验需要一个"use asm"; pragma（类似于严格模式的"use strict"）帮助提醒 JS 引擎寻找 asm.js
优化机会。另外一些人认为 asm.js 应该就是一个启发式的集合，引擎应该能够自动识别，无需开发者做任何额外的事情。这意味着，从理论上说，现有的程序可以从 asm.js 风格的优化得益而无需特意做什么。

### 如何使用 asm.js 优化

关于 asm.js 优化，首先要理解的是类型和强制类型转换（参见本书的“类型和语法”部分）。如果 JS 引擎需要跟踪一个变量在各种各样的运算之间的多个不同类型的值，
才能按需处理类型之间的强制类型转换，那么这大量的额外工作会使得程序优化无法达到最优。

> [!NOTE]
> 为了解释明了，我们在这里将使用 asm.js 风格代码，但你要清楚，通常并不需要手工编写这样的代码。asm.js 通常是其他工具的编译目标，比如
> [Emscripten](https://github.com/kripken/emscripten/wiki)。当然，你也可以自己编写 asm.js 代码，但一般来说，这想法并不好，因为这是非常耗时且容
> 易出错的过程。尽管如此，可能还是会有一些情况需要你修改代码，以便于 asm.js 优化。

还有一些技巧可以用来向支持 asm.js 的 JS 引擎暗示变量和运算想要的类型是什么，使它可以省略这些类型转换跟踪步骤。

比如：

```javascript
var b = a
```

在这个程序中，赋值`b = a`留下了变量类型二义性的后门。但它也可以换一种方式，写成这样：

```javascript
var a = 42

// ..

var b = a | 0
```

此处我们使用了与 0 的 |（二进制或）运算，除了确保这个值是 32 位整型之外，对于值没有任何效果。这样的代码在一般的 JS 引擎上都可以正常工作。而对支持 asm.js 的
JS 引擎来说，这段代码就发出这样的信号，b 应该总是被当作 32 位整型来处理，这样就可以省略强制类型转换追踪。

类似地，可以这样把两个变量的加运算限制为更高效的整型加运算（而不是浮点型）：

```javascript
;(a + b) | 0
```

另一方面，支持 asm.js 的 JS 引擎可以看到这个提示并推导出这里的 + 运算应该是 32 位整型加，因为不管怎样，整个表达式的结果都会自动规范为 32 位整型。

### asm.js 模块

对 JS 性能影响最大的因素是内存分配、垃圾收集和作用域访问。asm.js 对这些问题提出的一个解决方案就是，声明一个更正式的 asm.js“模块”，不要和 ES6 模块混淆。
请参考本系列的“ES6 & Beyond”部分。

对一个 asm.js 模块来说，你需要明确地导入一个严格规范的命名空间 —— 规范将之称为 stdlib，因为它应该代表所需的标准库 —— 以导入必要的符号，而不是通过词法作用域使
用全局的那些符号。基本上，window 对象就是一个 asm.js 模块可以接受的 stdlib 对象，但是，你能够而且可能也需要构造一个更加严格的。

你还需要声明一个堆（heap）并将其传入。这个术语用于表示内存中一块保留的位置，变量可以直接使用而不需要额外的内存请求或释放之前使用的内存。这样，asm.js 模块就不
需要任何可能导致内存扰动的动作了，只需使用预先保留的空间即可。

一个堆就像是一个带类型的 ArrayBuffer，比如：

```javascript
var heap = new ArrayBuffer(0x10000) // 64KB 堆
```

由于使用这个预留的 64k 二进制空间，asm.js 模块可以在这个缓冲区存储和获取值，不需要付出任何内存分配和垃圾收集的代价。举例来说，可以在模块内部使用堆缓冲区备份一
个 64 位浮点值数组，就像这样：

```javascript
var arr = new Float64Array(heap)
```

用一个简单快捷的 asm.js 风格模块例子来展示这些细节是如何结合到一起的。我们定义了一个 foo(..)。它接收一个起始值（x）和终止值（y）整数构成一个范围，并计算这个范
围内的值的所有相邻数的乘积，然后算出这些值的平均数：

```javascript
function fooASM(stdlib, foreign, heap) {
  'use asm'
  var arr = new stdlib.Int32Array(heap)

  function foo(x, y) {
    x = x | 0
    y = y | 0

    var i = 0
    var p = 0
    var sum = 0
    var count = ((y | 0) - (x | 0)) | 0

    // 计算所有的内部相邻数乘积
    for (i = x | 0; (i | 0) < (y | 0); p = (p + 8) | 0, i = (i + 1) | 0) {
      // 存储结果
      arr[p >> 3] = (i * (i + 1)) | 0
    }

    // 计算所有中间值的平均数
    for (i = 0, p = 0; (i | 0) < (count | 0); p = (p + 8) | 0, i = (i + 1) | 0) {
      sum = (sum + arr[p >> 3]) | 0
    }

    return +(sum / prod)
  }

  return { foo: foo }
}

var heap = new ArrayBuffer(0x10000)
var asmModule = fooASM(window, null, heap).foo

foo(10, 20) // 233
```

> [!NOTE]
> 出于展示的目的，这个 asm.js 例子是手写的，所以它并不能代表由目标为 asm.js 的编译工具产生的同样功能的代码。但是，它确实显示了 asm.js 代码
> 的典型特性，特别是类型提示以及堆缓冲区在存储临时变量上的使用。

第一个对 fooASM(..) 的调用建立了带堆分配的 asm.js 模块。结果是一个 foo(..) 函数，我们可以按照需要调用任意多次。这些 foo(..) 调用应该被支持 asm.js 的 JS 引擎专
门优化。很重要的一点是，前面的代码完全是标准 JavaScript，在非 asm.js 引擎中也能正常工作（没有特殊优化）。

显然，使 asm.js 代码如此高度可优化的那些限制的特性显著降低了这类代码的使用范围。asm.js 并不是对任意程序都适用的通用优化手段。它的目标是对特定的任务处理提供一种
优化方法，比如数学运算（如游戏中的图形处理）。

## 复习

本部分的前四章都是基于这样一个前提：异步编码模式使我们能够编写更高效的代码，通常能够带来非常大的改进。但是，异步特性只能让你走这么远，因为它本质上还是绑定在一个单事件循环线程上。

因此，在这一章里，我们介绍了几种能够进一步提高性能的程序级别的机制。Web Worker 让你可以在独立的线程运行一个 JS 文件（即程序），使用异步事件在
线程之间传递消息。它们非常适用于把长时间的或资源密集型的任务卸载到不同的线程中，以提高主 UI 线程的响应性。

SIMD 打算把 CPU 级的并行数学运算映射到 JS API，以获得高性能的数据并行运算，比如在大数据集上的数字处理。

最后，asm.js 描述了 JS 的一个很小的子集，它避免了 JS 难以优化的部分（比如垃圾收集和强制类型转换），并且让 JS 引擎识别并通过激进的优化运行这样
的代码。可以手工编写 asm.js，但是会极端费力且容易出错，类似于手写汇编语言（这也是其名字的由来）。实际上，asm.js 也是高度优化的程序语言交叉编译的一个很好的目标，
比如 [Emscripten](https://github.com/kripken/emscripten/wiki) 把 C/C++ 转换成 JS。

JS 还有一些更加激进的思路已经进入非常早期的讨论，尽管本章并没有明确包含这些内容，比如近似的直接多线程功能（而不是藏在数据结构 API 后面）。不管这些最终
会不会实现，还是我们将只能看到更多的并行特性偷偷加入 JS，但却是可以预见，未来 JS 在程序级别将获得更加优化的性能。
