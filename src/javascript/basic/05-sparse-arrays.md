# :zzz:

## empty slots

数组可以包含“空槽（empty slots）”，这与用值`undefined`填充的槽不同。带有空槽的数组称为“稀疏数组（sparse arrays）”。

空槽可以通过以下方式之一创建：

```javascript
// 1. Array构造函数：
const a = new Array(3) // [empty × 3]
// 2. 数组字面量连续逗号：
const b = [1, , ,] // [1, empty × 3]
// 3. 直接给大于数组长度的索引赋值：
const c = [1]
c[3] = 4 // [1, empty × 2, 4]
// 4. 直接设置length属性拉长一个数组：
const d = [1, 2, 3]
d.length = 5 // [1, 2, 3, empty × 2]
// 5. 删除一个数组元素：
const e = [1, 2, 3, 4]
delete e[2] // [1, 2, empty, 4]
```

在某些操作中，空槽的行为就像被填入了`undefined`值：

```javascript
const arr = [1, 2, , , 5]
// 1. 通过索引访问
console.log(arr[2]) // undefined
// 2. For...of
for (const val of arr) {
  console.log(val) // 1, 2, undefined, undefined, 5
}
// 3. 展开运算符
const newArr = [...arr] // newArr 为 [1, 2, undefined, undefined, 5]
```

在某些操作中，特别是数组迭代方法时，空槽会被跳过：

```javascript{14-28}
const arr = [1, 2, , , 5]
const mapped = arr.map(i => i + 1) // [2, 3, empty, empty, 6]
arr.forEach(i => console.log(i)) // 1, 2, 5
const filtered = arr.filter(() => true) // [1, 2, 5]

// 属性迭代
const keys = Object.keys(arr) // ['0', '1', '4']
for (const key in arr) {
  console.log(key) // '0', '1', '4'
}

// A: 在对象中使用展开，使用属性枚举，而不是数组的迭代器
const objectSpread = { ...arr } // { '0': 1, '1': 2, '4': 5 }
/**
 * 注释`A`的描述我没看懂。但是`copilot`告诉我：在JS中，
 *
 * 在对象字面量中使用展开运算符时，是通过枚举（enumeration）来复制对象的属性。
 * 意味着会遍历对象每一个可枚举的属性，将其复制到新对象中。
 *
 * 然而在数组中使用展开运算符时，则是通过迭代器（iterator）来复制数组的元素。
 * 意味着会遍历数组中的每一个元素（包括空槽），将其复制到新数组中。
 *
 * 但是，在对象字面量中对数组使用展开运算符时，JS会将数组视为一个具有数字键的对象。
 * 因此，它会通过枚举来赋值数组的元素，而不是通过迭代器。
 * 意味着空槽将被忽略，因为它们在数组对象中并没有对应的可枚举属性。
 *
 * 简述：在对象字面量中使用展开操作符对数组进行操作时，JS会使用属性枚举，而非数组迭代器。
 */
```
