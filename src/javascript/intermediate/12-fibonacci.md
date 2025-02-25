# :zzz:

## 定义

F(n) = F(n-1) + F(n-2); 其中`F(1) = 1` 和 `F(2) = 1`

1 1 2 3 5 8 13 21 34 55 89 144 ...

## 循环实现

```javascript
// 1.
function fibonacci(n) {
  if (n <= 2) return 1

  let a = 1,
    b = 1
  for (let i = 3; i <= n; i++) {
    ;[a, b] = [b, a + b]
  }
  return b
}

// 2.
function fibonacci(n) {
  if (n <= 2) return 1

  let dp = [0, 1, 1] // 初始化前两个值
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }

  return dp[n]
}
```

## 普通递归

```javascript
function fibonacci(n) {
  if (n <= 2) return 1

  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

## 尾递归

TCO - Tail Call Optimization 尾调用优化

**尾调用就是一个出现在另一个函数“结尾”出的函数调用。这个调用结束后就没有其余事情要做了（除了可能要返回结果值）。**

支持 TCO 的引擎能够意识到`fib(n - 1, b, a + b)`调用位于尾部，这意味着上一个`fib(..)`基本上已经完成了，所以调用一个新的
`fib(..)`不需要创建一个新的调用栈，而是可以重用当前调用栈。这样不仅速度更快，也更节省内存。

```javascript
// 1. 测试得： 该方法远比下边尾递归实现更快，数据越大，差距越大。原因不明
function fibonacci(n) {
  function fib(n, a, b) {
    if (n === 1) return a
    return fib(n - 1, b, a + b)
  }

  return fib(n, 1, 1)
}

// 2. 慢于 1 ，但快于普通递归实现
function fibonacci(n, a = 1, b = 1) {
  if (n === 1) return a
  return fibonacci(n - 1, b, a + b)
}
```
