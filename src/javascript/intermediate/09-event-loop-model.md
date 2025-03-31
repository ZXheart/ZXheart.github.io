# :zzz:

## 现代浏览器的主要进程

- 浏览器进程：

  主要负责界面显示、用户交互、子进程管理（网络进程、渲染进程等都是由浏览器进程启动的）等。浏览器进程内内部会启动多个线程处理不同的任务。

- 网络进程：

  负责加载网络资源。网络进程内部会启动多个线程来处理不同的网络任务。

- GPU 进程：

  负责图形渲染，主要用于处理 CSS 动画、Canvas 绘制等任务。GPU 进程会将渲染结果传递给浏览器进程进行显示。

- **渲染进程**：

  渲染进程启动后，会开启一个**渲染主线程**，主线程负责执行 HTML、CSS、JS 代码。

  默认情况下，浏览器会为每个标签页开启一个新的渲染进程，以保证不同的标签页之间不相互影响。

### 事件循环的核心：渲染主线程（Main thread）

- 解析 **HTML、CSS**
- 执行 **JS** 代码
- **计算样式（recalculate style）**
- **布局（layout）**
- **绘制（paint）**
- **合成（composite）**
- 执行**事件处理函数**（click、keydown 等）
- 处理**定时任务**（setTimeout、setInterval 等）
- 运行**微任务**（Promise.then, MutationObserver）

特点：

- 由于 JS 是**单线程**运行的，**主线程**只能一次执行一个任务。
- 所有任务都必须排队，等待主线程空闲才能运行。
- **某些任务队列的优先级高于其他任务**，浏览器会根据策略选择优先执行的队列。

### 工作流:

![event-loop](/javascript-img/intermediate/event-loop.svg)

1. 最开始时，渲染主线程会进入一个无限循环。
2. 每一次循环会检查消息队列中是否有任务存在。如果有，就取出第一个任务执行，执行完一个进入下一次循环；如果没有，则进入休眠状态。
3. 其他所有线程（包括其他进程的线程）可以随时向消息队列添加任务。新任务会加到消息队列的末尾。在添加新任务时，如果主线程是休眠状态，则会将其唤醒以继续循环拿取任务。

### 异步流:

JS 单线程语言，这是因为它运行在浏览器的渲染主线程中，而渲染主线程只有一个。
而渲染主线程承担着诸多工作，渲染页面、执行 JS 都在其中运行。
如果使用同步的方式，就极有可能导致主线程产生阻塞，从而导致消息队列中的还多其他任务无法得到执行。
这样一来，一方面会导致繁忙的主线程白白耗费时间，另一方面导致页面无法及时更新，造成卡死现象。

所以，浏览器采用异步的方式来避免。具体做法是当某些任务发生时，比如计时器、网络、事件监听，主线程将任务交给其他线程去处理，自身立即结束当前任务，转而执行后续任务。
当其他线程完成时，将事先传递的回调函数包装成任务，加入到消息队列的末尾排队，等待主线程调度执行。
在这种异步模式下，浏览器用不阻塞，从而最大限度的保证了单线程的流畅运行。

![event-loop-async](/javascript-img/intermediate/event-loop-async.svg)

### 为什么 JS 阻碍渲染？

JS 是单线程的，渲染主线程执行 JS 代码时，特别是长耗时的同步代码，会导致消息队列的其他任务（布局、计算、绘制等）无法进入主线程执行，造成页面卡顿。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>nice</h1>
    <button>change</button>

    <script>
      const h1El = document.querySelector('h1')
      const buttonEl = document.querySelector('button')

      function delay(ms) {
        const now = performance.now()
        while (performance.now() - now < ms) {}
      }

      buttonEl.addEventListener('click', () => {
        h1El.textContent = 'changed'
        delay(1000)
      })
    </script>
  </body>
</html>
```

![render-blocking](/javascript-img/intermediate/render-blocking.svg)

### 任务有优先级吗？

任务没有优先级，在消息队列中先进先出，但是**消息队列有优先级**。

- 每个任务都有一个任务类型，同类型任务必须在一个队列，不同类型任务可以分属于不同的队列。在一次事件循环中，浏览器可以根据实际情况从不同的队列中取出任务执行。

  > 同类型任务必须在一个队列：某类型的任务出现在一个消息队列后，就不能再出现在其他队列中了。
  > 不同类型任务可以分属于不同队列：不同类型的任务可以在不同的消息队列中，也可以在同一个消息队列中。（队列与任务是一对多的关系，任务与队列是一对一的关系）。

- 浏览器必须准备好一个微队列，微队列中的任务优先所有其他任务执行。

### 事件循环

事件循环又叫做消息循环，是浏览器渲染主线程的工作方式。

在 Chrome 源码中，它开启一个不会结束的 for 循环，每次循环从消息队列中取出第一个任务执行，而其他线程只需要在合适的时候将任务加入到队列末尾即可。

过去把消息队列简单分为宏队列和微队列，这种说法目前已经无法满足复杂的浏览器环境，取而代之的是一种更加灵活多变的处理方式。

根据 W3C 官方的解释，每个任务有不同的类型，同类型任务必须在同一个队列，同一队列可以有不同类型的任务。不同任务队列有不同的优先级，在一次事件循环中，由浏览器自行决定哪个队列的任务。
但浏览器必须有一个微队列，微队列的任务一定具有最高优先级，必须优先调度执行。

### 计时器能做到精确吗？

1. 操作系统的机器函数本身就有少量偏差，JS 的计时器最终调用的是操作系统的函数，也就携带了这些偏差。
2. 按照 W3C 的标准，浏览器实现计时器时，如果嵌套层级超过 5 层，则会带有 4 毫秒的最少时间，这样在计时时间少于 4 毫秒时又带来了偏差。
3. 受事件循环的影响，计时器的回调函数只能在主线程空闲时运行，因此又带来了偏差。

如下代码在浏览器中运行，可以看出，嵌套 1 ～ 4 层没有太大偏差，到达第五层，最小延迟提高到 4ms 或者更多。

```javascript
const start = performance.now()
setTimeout(() => {
  console.log(`elapsed time:`, performance.now() - start)
  //大概在 0.3 ~ 0.8ms 左右（浏览器环境）
}, 0)

const start = performance.now()
setTimeout(() => {
  setTimeout(() => {
    setTimeout(() => {
      setTimeout(() => {
        console.log(`elapsed time:`, performance.now() - start)
        //略高一丢丢 还在 0.3 ~ 0.8ms 左右（浏览器环境）
      }, 0)
    }, 0)
  }, 0)
}, 0)

const start = Date.now()
setTimeout(() => {
  setTimeout(() => {
    setTimeout(() => {
      setTimeout(() => {
        setTimeout(() => {
          console.log(`elapsed time:`, Date.now() - start)
          // 大概4.5 ～ 6.0 ms 左右（浏览器环境）
        }, 0)
      }, 0)
    }, 0)
  }, 0)
}, 0)
```

### 任务的分类（多个任务队列）

在现代浏览器中，事件循环不仅仅是“**宏任务 vs. 微任务**”，而是多个优先级不同的任务队列。主要分为：

1. **微任务队列（Micro tasks）**（最高优先级）

- `Promise.then()`
- `queueMicrotask()`
- `MutationObserver`
- 特点：
  - 每次执行完同步代码后，**会立即执行所有微任务，直到清空**。
  - 在每个宏任务完成后，微任务队列也会被清空。

2. **用户交互任务队列（User Interaction Tasks）**（高优先级）

- 事件监听器（click、keydown 等）
- `addEventListener()`触发的回调
- 特点：
  - 比定时任务（setTimeout）更优先
  - 目的是确保**UI 相应流畅，减少点击延迟**

3. **动画和渲染任务队列（Animation & Rendering Tasks）**（中等优先级）

   - `requestAnimationFrame()`
   - `intersectionObserver` 回调
   - 特点：
     - 以**每秒 60 帧（16.67ms 一次）**的速度执行（如果可能）
     - 主要用于**流畅的动画和 UI 更新**

4. **定时器任务队列（Timer Tasks）**（较低优先级）

   - `setTimeout`
   - `setInterval`
   - 特点：
     - `setTimeout(fn, 0)`也不会**立即执行**，而是被推迟执行
     - 浏览器会根据**当前的负载**调整执行时机，防止性能问题

5. **后台任务队列（Background Tasks）**（最低优先级）

   - `setImmediate()`（Nodejs 专属，浏览器无）
   - `requestIdleCallback()`（实验性 API）
   - 特点：
     - 这些任务只有在**浏览器完全空闲**时才会执行
     - **不会阻塞 UI 渲染**

6. **网络任务队列（Networking Tasks）**(特殊队列)

   - `fetch()/XMLHttpRequest`
   - WebSocket/IndexedDB
   - 特点：
     - 需要等待 I/O 结果返回，回调会排入合适的任务队列
     - `fetch().then()`回调会进入**微任务队列**，比`setTimeout`更快执行

### 事件循环的执行顺序

浏览器的事件循环每次循环遵循以下流程：

1. **执行同步代码（全局执行上下文）**
2. **执行微任务队列（Micro tasks），直到清空**
3. **选择合适的队列执行下一个任务**（可能是用户交互、动画、定时任务等）
4. **执行完当前任务后，再次执行微任务队列**
5. **如果所有任务队列都为空，进入休眠（idle），等待新的任务**
