# :zzz:

```javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class ZPromise {
  #status = PENDING
  #value = undefined
  #taskQueue = []

  #changeStatus(status, value) {
    if (this.#status !== PENDING) return

    this.#status = status
    this.#value = value

    this.#runTaskQueue()
  }

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

  #resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }

    if (x instanceof ZPromise) {
      return x.then(y => this.#resolvePromise(promise2, y, resolve, reject), reject)
    }

    let called = false
    if (this.#isFnOrObj(x)) {
      try {
        const then = x.then

        if (typeof then === 'function') {
          then.call(
            x,
            y => {
              if (called) return
              called = true
              this.#resolvePromise(promise2, y, resolve, reject)
            },
            r => {
              if (called) return
              called = true
              reject(r)
            }
          )
        } else {
          resolve(x)
        }
      } catch (e) {
        if (called) return
        reject(e)
      }
    } else {
      resolve(x)
    }
  }

  #runTask(fn, resolve, reject, promise2) {
    this.#runMicroTask(() => {
      if (typeof fn !== 'function') {
        return this.#status === FULFILLED ? resolve(this.#value) : reject(this.#value)
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

    while (this.#taskQueue.length) {
      const { onFulfilled, onRejected, resolve, reject, promise2 } = this.#taskQueue.shift()
      this.#runTask(this.#status === FULFILLED ? onFulfilled : onRejected, resolve, reject, promise2)
    }
  }

  then(onFulfilled, onRejected) {
    const promise2 = new ZPromise((resolve, reject) => {
      this.#runMicroTask(() => {
        this.#taskQueue.push({ onFulfilled, onRejected, resolve, reject, promise2 })
        this.#runTaskQueue()
      })
    })
    return promise2
  }

  // utils
  #runMicroTask(fn) {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(fn)
      return
    }

    if (typeof process === 'object' && process.nextTick) {
      process.nextTick(fn)
      return
    }

    setTimeout(fn, 0)
  }

  #isFnOrObj(x) {
    return typeof x === 'function' || (typeof x === 'object' && x !== null)
  }
}
```
