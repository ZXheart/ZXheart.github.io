# :zzz:

三个文件在同一个目录下，启动一个本地服务。worker 需要运行在 http/s 协议下。

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
