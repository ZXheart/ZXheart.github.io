// ? 1. loose equals
// const a = new Number(2)
// let b = 2
// Number.prototype.valueOf = function () {
//   return b++
// }
// console.log('a:', a)
// if (a == 2 && a == 3) {
//   console.log('yeah')
// }

// ? 2. 完成值

// var a, b

// a = eval('if (true) { b = 4 + 38 }')

// console.log('a:', a) // 42
