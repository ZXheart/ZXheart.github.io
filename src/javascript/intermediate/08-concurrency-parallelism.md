# :zzz:

## 并发（Concurrency）

### （1）定义

- **并发**是指多个任务在同一时间段内交替运行。
- 它并不一定要求多个任务同时运行，而是通过时间分片的方式让多个任务看起来像是同时进行的。

### （2）JS 的并发模型

- JS 是单线程语言，这意味着它只有一个主线程来执行代码。
- 但是，JS 支持**事件循环（Event Loop）**和**非阻塞 I/O**，这使得它可以实现并发。
- 在 JS 中，并发通常是通过一下机制实现的：
  - **异步操作**： 如`setTimeout`、`Promise`、`async/await`等。
  - **回调函数**： 将任务交给底层系统处理，完成后通过回调通知主线程。
  - **事件队列**： 任务被放入事件队列中，等待主线程空闲时执行。

### （3）示例

```javascript
console.log('task 1')

setTimeout(() => {
  console.log('task 2')
}, 0)

console.log('task 3')

// Output:
// task 1
// task 3
// task 2
```

### （4）解释：

- 尽管`setTimeout`的延迟时间为`0`，但它会被放入事件队列中，等待主线程空闲时执行。
- 主线程先执行同步任务（`task 1`和`task 3`），然后才处理异步任务（`task 2`）。
- 这种交替执行的方式就是并发。

## 并行（Parallelism）

### （1）定义

- **并行**是指多个任务真正地同时运行。
- 并行需要多个线程或多个 CPU 核心的支持。

### （2）JS 的并行模型

- JS 本身是单线程的，但是可以通过以下方式实现并行：
  - **Web Workers**：允许在后台线程中运行脚本，从而实现真正的并行。
  - **Node.js 的多线程模块** ： 如`worker_threads`，可以创建多个线程来并行执行任务。
  - **底层系统调用** : 如文件 I/O 或网络请求，这些操作通常由操作系统或浏览器的底层线程池完成。

### （3）示例

#### 主脚本（main.js）:

```javascript
const worker = new Worker('worker.js')

// 向Worker发送消息
worker.postMessage(42)

// 接受Worker的响应
worker.onmessage = e => {
  console.log('Received:', e.data)
}
```

#### Worker 脚本（worker.js）:

```javascript
// 监听主线程的消息
self.onmessage = e => {
  const number = e.data
  const res = number * 2

  // 向主线程发送消息
  self.postMessage(res)
}
```

### （4）解释：

- 主线程和 Worker 县城可以同时运行，互不干扰。
- Worker 线程在后台执行计算任务，不会阻塞主线程。
- 这种真正地同时运行就是并行。
