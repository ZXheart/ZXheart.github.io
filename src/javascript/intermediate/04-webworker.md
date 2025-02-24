# :zzz:

## Web Worker 是真正的并行吗？

是的，其运行在单独的线程中，因此它可以并行执行任务，不会阻塞主线程。

- **主线程和 Worker 线程是完全分开的，**它们不能直接共享变量，只能通过消息传递进行通信。
- **每个 Web Worker 都有自己的事件循环**，它不会影响主线程的事件循环。

## Web Worker 运行的任务在哪个队列？

Web Worker 本身有**独立的任务队列**，它的运行机制大致是：

1. **主线程创建 Web Worker**：

   - 代码：`const worker = new Worker('worker.js')`
   - 这会启动一个新线程，运行`worker.js`里的代码。

2. **Web Worker 内部有自己的事件循环**：

   - Worker 线程会从自己的任务队列里取出任务执行，就像主线程处理任务一样。
   - 但是**Worker 不能操作 DOM**，它只能执行计算任务。

3. Worker 通过`postMessage()` 发送消息到主线程：

   - 代码：`self.postMessage('hello')`
   - 这个操作会**把数据发送到主线程**，数据被**放入主线程的任务队列中**。

4. **主线程监听`message`事件**：

```javascript
worker.onmessage = e => {
  console.log('收到 Worker 结果：', e.data)
}
```

## 专用 Worker

启动一个本地服务。worker 需要运行在 http/s 协议下。

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>try webworker</title>
  </head>
  <body>
    <button id="start">start</button>
    <script src="./main.js"></script>
  </body>
</html>
```

### main.js

```javascript
document.getElementById('start').addEventListener('click', () => {
  const worker = new Worker('./worker.js')
  worker.postMessage('hello')
  worker.onmessage = function (e) {
    console.log('main', e.data)
  }
})
```

### worker.js

```javascript
self.onmessage = e => {
  const number = e.data // 获取主线程发送的数据
  const res = fibonacci(number) // 计算斐波那契数列
  self.postMessage(res) // 将结果发送给主线程
}

/**
 * @description 计算第n位斐波那契数列的值。斐波那契数列形如：1, 1, 2, 3, 5, 8, 13, 21, 34, ...
 * @param {number} n 第n位
 * @returns {number} 第n位的值
 */
function fibonacci(n) {
  if (n <= 2) {
    return 1
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

## 共享 Worker

`SharedWorker`是一种 Web Worker，它允许多个浏览器上下文（如多个标签页，iframe 或同一标签页中的不同脚本）共享同一个 WOrker 实例。`SharedWorker`
只能在同源（相同协议、域名和端口）下的多个标签或 iframe 中共享，不能跨域共享。

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Index</title>
  </head>
  <body>
    <a href="./about.html" id="to-about">to about</a>
    <script>
      const sharedWorker = new SharedWorker('./shared-worker.js')
      sharedWorker.port.start()
      sharedWorker.port.postMessage('Hello from index')
      sharedWorker.port.addEventListener('message', e => {
        console.log('Message from shared worker:', e.data)
      })
    </script>
  </body>
</html>
```

### about.html

```html
<a href="./index.html" id="to-index">to index</a>
<script>
  const sharedWorker = new SharedWorker('./shared-worker.js')
  sharedWorker.port.start()
  sharedWorker.port.postMessage('Hello from about')
  sharedWorker.port.addEventListener('message', e => {
    console.log('Message from shared worker:', e.data)
  })
</script>
```

### shared-worker.js

```javascript
addEventListener('connect', e => {
  const port = e.ports[0]
  port.start()
  port.addEventListener('message', e => {
    const msg = e.data + ' handled by shared worker'
    port.postMessage(msg)
  })
})
```
