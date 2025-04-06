# :zzz:

## 随机[a, b]的整数

```typescript
/**
 * 随机[a, b]的整数
 * @param a
 * @param b
 */
function randomInt(a: number, b: number): number {
  return Math.floor(Math.random() * (b + 1 - a)) + a
}
```

## 防抖

```typescript
/**
 * 防抖
 * @param fn
 * @param delay
 */

function debounce(fn: Function, delay: number) {
  let timer: any = null
  return function (...args: any) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}
```

## 防抖-首次立即执行

```typescript
/**
 * 防抖-首次立即执行
 * @param fn
 * @param delay
 */
function debounce(fn: Function, delay: number) {
  let timer: any = null
  return function (...args: any) {
    let callNow = !timer
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
    }, delay)
    if (callNow) {
      fn.apply(this, args)
    }
  }
}
```

## promise

```javascript
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'

class ZPromise {
  #status = PENDING
  #value = undefined
  #queue = []

  constructor(executor) {
    const resolve = data => {
      this.#changeStatus(FULFILLED, data)
    }
    const reject = reason => {
      this.#changeStatus(REJECTED, reason)
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  #changeStatus(status, data) {
    if (this.#status !== PENDING) return
    this.#status = status
    this.#value = data
    this.#runTaskQueue()
  }

  ##resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected for promise'))
    }
    if (x instanceof ZPromise) {
      x.then(resolve, reject)
    } else {
      resolve(x)
    }
  }

  #runTask(cb, resolve, reject, promise2) {
    this.#runMicroTask(() => {
      if (typeof cb !== 'function') {
        resolve(this.#value)
        return
      }
      try {
        const x = fn(this.#value)
        this.#resolvePromise(promise2, x, resolve, reject)
      } catch (e) {
        reject(e)
      }
    })
  }

  #runTaskQueue() {
    if (this.#status === PENDING) return
    const { onFulfilled, onRejected, resolve, reject, promise2 } = this.queue.shift()
    while (this.#queue.length) {
      this.#runTask(this.#status === FULFILLED ? onFulfilled : onRejected, resolve, reject, promise2)
    }
  }

  then(onFulfilled, onRejected) {
    const promise2 = new ZPromise((resolve, reject) => {
      this.#runMicroTask(() => {
        this.queue.push({
          onFulfilled,
          onRejected,
          resolve,
          reject,
          promise2,
        })
        this.#runTaskQueue()
      })
    })
    return promise2
  }

  // utils
  #runMicroTask(fn) {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(fn)
    } else if (typeof process === 'object' && process.nextTick) {
      process.nextTick(fn)
    } else if (typeof MutationObserver === 'function') {
      const observer = new MutationObserver(fn)
      const textNode = document.createTextNode('')
      observer.observe(textNode, { characterData: true })
      textNode.data = '1'
      observer.disconnect()
    } else {
      setTimeout(fn, 0)
    }
  }
}
```
