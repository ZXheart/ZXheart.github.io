# :zzz:

## 巨 JB 难； too damn hard

```javascript
function spread(fn) {
  // return function(array){
  //     return fn.apply(null, array);
  // }

  // 1. apply 以指定this值和参数数组调用函数；

  // 2. bind 以指定this值和系列参数（...args1）创建一个新函数。
  //    新函数this值为bind的第一个参数；新函数调用时的传参（...args2）会被放在...args1后面

  // 3. Function.apply为一个原型/静态方法，它以bind的方式调用。并为其绑定this为fn，等同于使用fn调用apply;
  //    null作为bind的参数会成为fn.apply的第一个参数，也就是为fn指定值为null的this，同时将来接受数组形式的参数。

  // 4. Function.apply.bind(fn, null) 会返回一个新apply函数，新函数接受一个数组参数。
  //    当新函数调用时，它会以apply的行为调用原函数。
  return Function.apply.bind(fn, null)
}

const add = (a, b) => a + b

console.log(spread(add)([1, 2])) // 3
```
