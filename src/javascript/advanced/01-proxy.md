# Proxy

Proxy 对象用于创建一个对象的代理，，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

## 语法

```js
const p = new Proxy(target, handler)
```

- `target`

        要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组、函数、甚至另一个代理）。

- `handler`

        一个通常以函数作为属性的对象，用来定制拦截行为

## 示例

```js
const obj = {
  msg: 'hello',
}
const proxyObj = new Proxy(obj, {
  get: function (target, key, receiver) {
    console.log('被代理对象：', target, '被访问的key', key, 'Proxy或继承Proxy的对象', receiver)
    return '666'
  },
})
console.log(proxyObj.msg) //  666
console.log(proxyObj.xxx) //  666
console.log(obj.msg) // hello
console.log(obj.xxx) // undefined
```

代理对象的 `get` 方法会拦截对象的属性读取操作，改为定义的返回值。并且不会影响原对象的属性读取。

## handler 对象常用方法

| 方法名                 | 描述                                                              |
| ---------------------- | ----------------------------------------------------------------- |
| handler.get            | 拦截对象属性的读取操作                                            |
| handler.set            | 拦截对象属性的设置操作                                            |
| handler.has            | 拦截 `in` 操作符                                                  |
| handler.deleteProperty | 拦截 `delete` 操作符                                              |
| handler.ownKeys        | 拦截 `Object.getOwnPropertyNames`、`Object.getOwnPropertySymbols` |
| handler.apply          | 拦截函数的调用、call 和 apply 操作                                |
| handler.construct      | 拦截 `new` 操作符                                                 |

## handler.get

捕获器方法使用大同小异，只有参数不同，下面是 `get` 方法的参数：

- `target`：目标对象
- `key`：属性名
- `receiver`：Proxy 或者继承 Proxy 的对象

```js
const obj1 = {
  msg: 'hello',
}
const proxyObj1 = new Proxy(obj1, {
  get: function (target, key, receiver) {
    if (key in target) {
      return target[key]
    } else {
      return 'not found'
    }
  },
})
console.log(proxyObj1.msg) //  hello
console.log(proxyObj1.xxx) //  not found
```

读取代理目标的值时，如果原对象存在该属性，则返回原对象的属性值，否则返回自定义的值。

```js
const obj2 = {}
Object.defineProperty(obj2, 'msg', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: 'hello',
})
const proxyObj2 = new Proxy(obj2, {
  get: function (target, key, receiver) {
    // return target[key]
    return 'world'
  },
})
console.log(proxyObj2.msg)
// Uncaught TypeError: 'get' on proxy: property 'msg' is a read-only and non-configurable data property
// on the proxy target but the proxy did not return its actual value (expected 'hello' but got 'world')
console.log(proxyObj2.xxx) // world
console.log(obj2.msg) // hello
```

- 如果原对象的属性是不可写、不可配置的，返回的值必须与原对象的值一致，否则会报错。
