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

读取代理目标的值时，如果原对象存在该属性，则返回原对象的属性值，否则返回自定义的值:

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

- 如果原对象的属性是不可写、不可配置的，返回的值必须与原对象的值一致，否则会报错:

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

- 如果要访问的目标属性没有配置访问方法，即 get 方法是 undefined 的，则返回值必须为 undefined。(这个 MDN 翻译后描述，我测了半天都没报错)
- The value reported for a property must be undefined if the corresponding target object property is a non-configurable
  own accessor property that has undefined as its [[Get]] attribute. (这个是英文原文，少翻译了`non-configurable`)
- 正确的描述应该是：如果目标对象的属性是一个不可配置的自有访问器属性，且其 `get` 方法是 `undefined`，则代理对象的 `get` 方法必须返回 `undefined`。

```js
const obj3 = {
  foo: 2,
}
Object.defineProperty(obj3, 'foo', {
  configurable: false,
  get: undefined,
})
const proxyObj3 = new Proxy(obj3, {
  get: function (target, key, receiver) {
    return 666 // 这里应该返回 undefined
  },
})
console.log(proxyObj3.foo) // 抛出错误
```

## 可撤销的 Proxy

Proxy 唯一一个静态方法 `Proxy.revocable(target, handler)` 可以创建一个可撤销的 Proxy 实例。

Proxy.revocable()方法返回一个对象，结构为 `{proxy, revoke}`，其中：

- `proxy`： 代表新生成的代理对象本身，和 `new Proxy(target, handler)`创建的代理对象一样，只是它可以被销毁。
- `revoke`： 一个函数，调用时不需要加任何参数，调用后会撤销 Proxy 实例，此后再访问 Proxy 实例会抛出错误。

一旦某个代理对象被撤销，它将变得几乎完全不可调用，在它身上执行任何可代理操作都会抛出错误。一旦被撤销，代理对象便不可能恢复到原来的状态，同时和它
关联的目标对象以及处理器对象都有可能被垃圾回收掉。再次调用 revoke()方法不会有任何效果，但也不会报错。

该方法常用于完全封闭对目标对象的访问

```js
const obj4 = {}
const { proxy, revoke } = Proxy.revocable(obj4, {
  get: function (target, key, receiver) {
    return 'world'
  },
})
console.log(proxy.msg) // world
revoke()
console.log(proxy.msg) // Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked
```

## 使用场景

1. 验证

   通过代理，可以验证向一个对象的传值

```js
const validator = {
  set(target, key, value) {
    if (key === 'age') {
      if (typeof value !== Number && value === NaN) {
        throw new TypeError('The age is not a number')
      }
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer')
      }
      if (value < 0 || value > 130) {
        throw new RangeError('The age is invalid')
      }
    }
    return Reflect.set(...arguments)
  },
}
const person = new Proxy({}, validator)
person.age = 100
console.log(person.age) // 100
person.age = 'young' // Uncaught TypeError: The age is not a number
person.age = 140 // Uncaught RangeError: The age is invalid
```

2. 属性私有化

   通过代理，可以将对象的属性私有化，只能通过代理对象访问

```js
const obj5 = {
  _name: 'Tom',
  getName() {
    return this._name
  },
}
const proxyObj5 = new Proxy(obj5, {
  get(target, key, receiver) {
    if (key.startsWith('_')) {
      throw new Error('private property')
    }
    const fn = Reflect.get(...arguments)
    if (typeof fn === 'function') {
      return fn.bind(target)
    }
  },
})
console.log(proxyObj5._name) // Uncaught Error: private property
console.log(proxyObj5.getName()) // Tom
```

3. 扩展构造函数

方法代理可以通过一个新构造函数来扩展一个已有的构造函数

```js

```
