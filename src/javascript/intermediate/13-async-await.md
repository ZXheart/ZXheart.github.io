# :zzz:

## 首先应该知道这个

```javascript
async function foo() {
  const res = await 1 // 非promise/thenable值，使用Promise.resolve(1)包裹
  console.log(res)
}

// 等同于

function foo() {
  return Promise.resolve(1).then(res => {
    console.log(res)
  })
}
```
