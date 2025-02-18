# :zzz:

## 现代浏览器的事件循环模型

### 事件循环的核心：渲染主线程

浏览器的**渲染主线程（Main thread）**主要负责：

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
