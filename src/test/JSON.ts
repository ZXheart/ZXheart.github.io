// 1. js中JSON不安全指的是：undefined、函数、Symbol、循环引用
console.log(JSON.stringify(undefined))
console.log(JSON.stringify(() => {}))
console.log(JSON.stringify(Symbol('foo')))

// 1.1 其中前三个返回值都是undefined，循环引用则会报错
const obj: { self: any } = {
  self: null,
}
obj.self = obj
// console.log(JSON.stringify(obj)) //  JSON.stringify cannot serialize cyclic structures.

// 2. 在数组中遇到这样的值（前三个）将其转换为null。循环引用依然会报错
const arr = [undefined, () => {}, Symbol('foo')]
console.log(JSON.stringify(arr)) // [null,null,null,]

// 3. 在对象中遇到这样的值（前三个）则会被忽略。循环引用依然会报错

const obj2 = {
  a: undefined,
  b: () => {},
  c: Symbol('foo'),
}
console.log(JSON.stringify(obj2)) // {}

// 4. JSON.stringify的第二个参数可以是一个数组或函数，用来指定需要序列化的属性

// 4.1 数组 接收一个string类型的数组，指示需要序列化的属性
const obj3 = {
  a: 1,
  b: 2,
  c: [1, 2, 3],
}
const res = JSON.stringify(obj3, ['a', 'b']) // {"a":1,"b":2}
console.log(res)

// 4.2 函数 接收一个函数，用来过滤需要序列化的属性。函数接收两个参数，第一个是属性名，第二个是属性值
// 如果想要跳过某个属性，可以返回undefined，否则返回属性值
// 整个流程是递归的，且第一次会将整个对象丢进函数中，其key为undefined，value为整个对象
// 由于是递归的，所以obj.c数组中的每一个元素同样会被传入函数中，key分别为0、1、2，value分别为1、2、3

const res1 = JSON.stringify(obj3, (k, v) => {
  console.log('k:', k, 'v', v)
  if (k === 'a') {
    return undefined
  }
  return v
})
console.log(res1)

// 5. JSON.stringify的第三个参数可以用来控制缩进，为了是结果对人类友好。接收一个数字或字符串

// 5.1 数字 表示缩进的空格数
console.log(JSON.stringify(obj3, null, 2))

// 5.2 字符串 表示缩进的字符串（若超出10个字符则只取前10个）
console.log(JSON.stringify(obj3, null, '~-~-~-'))

// 6. 如果一个对象中拥有toJSON方法，则JSON.stringify会调用这个方法来序列化对象
const obj4 = {
  a: 1,
  b: 2,
  toJSON() {
    return {
      a: 3,
      b: 4,
    }
  },
}
console.log(JSON.stringify(obj4)) // {"a":3,"b":4}
