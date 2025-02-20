# :zzz:

### 多个迭代器

从语法使用方面来看就，通过一个迭代器控制生成器的时候，似乎是在控制声明的生成器函数。但是有一个细微之处很容易忽略：每次构建一个*迭代器*，实际
上就隐式构建了一个生成器的一个实例，通过这个*迭代器*来控制的是这个生成器实例。

同一个生成器的多个实例可以同时运行，它们甚至可以彼此交互：

```javascript
var z = 1
function* foo() {
  var x = yield 2
  z++
  var y = yield x * z
  console.log(x, y, z)
}

var it1 = foo()
var it2 = foo()

var val1 = it1.next().value // 2
var val2 = it2.next().value // 2

val1 = it1.next(val2 * 10).value // 40
val2 = it2.next(val1 * 5).value // 600

it1.next(val2 / 2) //
it2.next(val1 / 4) //
```

1. `*foo()`的两个实例同时启动，两个`next()`分别从`yield 2`语句得到值 2。

2. `it1.next(val2 * 10)`，也就是`it1.next(20)`，发送到第一个生成器实例`it1`，`20`会替换上一个`yield`及后面的表达式 —— `var x = 20`，
   同时从下一个`yield`语句得到值`x * z` —— `20 * 2`，将`val1`设置为 40。

3. `it2.next(val1 * 5)`，也就是`it2.next(200)`，发送到第二个生成器实例`it2`，`200`会替换上一个`yield`及后面的表达式 —— `var x = 200`，
   同时从下一个`yield`语句得到值`x * z` —— `200 * 3`，将`val2`设置为 600。

4. `it1.next(val2 / 2)`，也就是`it1.next(600 / 3)`，发送到第一个生成器实例`it1`，`200`会替换上一个`yield`及后面的表达式 —— `var y = 300`，
   然后打印出 x y z 的值分别是 20 300 3。

5. `it2.next(val1 / 4)`，也就是`it2.next(40 / 4)`，发送到第二个生成器实例`it2`，`10`会替换上一个`yield`及后面的表达式 —— `var y = 10`，
   然后打印出 x y z 的值分别是 200 10 3。
