# :zzz:

[《你不知道的 JavaScript》](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20%26%20object%20prototypes/ch5.md)

:::warning

所有模拟类拷贝行为的企图，也就是我们在前面第四章描述的内容，称为各种种类的“mixin”，和我们要在本章讲解的`[[Prototype]]`链
机制完全不同。

:::

## `[[Prototype]]`

JS 中的对象有一个内部属性，在语言规范中称为`[[Prototype]]`，它只是一个其他对象的引用。几乎所有的对象的被创建时，它的这个
属性都被赋予了一个非`null`值。

:::warning

我们马上就会看到，一个对象拥有一个空的`[[Prototype]]`链接是*可能*的，虽然这有些不寻常。

:::

```javascript
const obj = { a: 2 }

console.log(obj.a) // 2
```

`[[Prototype]]`引用有什么用？在第三章中，我们讲解了`[[Get]]`操作，它会在你引用一个对象上的属性时被调用，比如`obj.a`。对
于默认的`[[Get]]`操作来说，第一步就是检查对象本身是否拥有一个`a`属性，如果有，那就是用它。

:::warning

ES6 的代理（Proxy）超出了我们要在本书内讨论的范围，但是如果加入`Proxy`，我们在这里讨论的关于普通`[[Get]]`和`[[Put]]`的行
为都是不被采用的。

:::

但是如果`obj`上**不**存在`a`属性时，我们就将注意力转向对象的`[[Prototype]]`链。

如果默认的`[[Get]]`操作不能直接在对象上找到被请求的属性，那么它会沿着对象的`[[Prototype]]`**链**继续处理。

```javascript
const anotherObj = { a: 2 }
const myObj = Object.create(anotherObj)

console.log(myObj.a) // 2
```

我们现在让`myObj` `[[Prototype]]`链到了`anotherObj`。虽然很明显`myObj.a`实际上不存在，但是无论如何属性访问成功了（
在`anotherObj`中找到了），而且确实找到了值`2`。

但是，如果在`anotherObj`上也没有找到`a`，而且如果它的`[[Prototype]]`链不为空，就会沿着它继续查找。

这个处理持续进行，直到找到名称匹配的属性，或者`[[Prototype]]`链终结。如果在链条的末尾都没有找到匹配的属性，那
么`[[Get]]`操作的返回结果为`undefined`。

和这种`[[Prototype]]`链查询处理相似，如果你使用`for..in`循环迭代一个对象，所有在它的链条上可以到达的（并且
是`enumerable`）属性都会被枚举。如果你使用`in`操作符来测试一个属性在一个对象上的存在性，`in`将会检查对象的整个链条（不管
可枚举性）。

```javascript
const anotherObj = { a: 2 }
const myObj = Object.create(anotherObj)

for (const k in myObj) {
  console.log(`found: ${k}`)
} // found: a

console.log('a' in myObj) // true
```

所以，当你以各种方式进行属性查询时，`[[Prototype]]`链就会一个链接另一个链接地被查询。一旦找到属性或者链条终结，这种查询
就会停止。

### `Object.prototype`

但是`[[Prototype]]`链到底在*哪里*“终结”？

每个*普通*的`[[Prototype]]`链的最顶端，是内建的`Object.prototype`。这个对象包含各种在整个 JS 中被使用的共通工具，因为 JS
中所有普通（内建，而非宿主环境扩展）的对象都“衍生自”（也就是，使它们的`[[Prototype]]`顶端为）`Object.prototype`对象。

你会在这里发现一些你可能很熟悉的工具，比如`.toString()`和`.valueOf()`。在第三章中，我们介绍了另一个
：`.hasOwnProperty(..)`。还有另一个将在这一章讨论的`Object.prototype`上的`isPrototypeOf(..)`。

### 设置与遮蔽属性

回到第三章，我们提到过在对象上设计属性要比仅仅在对象上添加新属性或改变既存属性的值更加微妙。我们现在将更完整的重温这个话
题。

```javascript
myObj.foo = 'bar'
```

如果`myObj`对象已经直接拥有了普通的名为`foo`的数据访问器属性，那么这个赋值和改变既存属性的值一样简单。

如果`foo`还没有直接存在于`myObj`，`[[Prototype]]`就会被遍历，就像`[[Get]]`操作那样。如果在链条的任何地方都没有找
到`foo`，那么它就会像我们期望的那样，属性`foo`就以指定的值被直接添加到`myObj`上。

然而，如果`foo`已经存在于链条更高层的某处，`myObj.foo = 'bar'`赋值就可能会发生微妙的（也许令人诧异的）行为。

如果属性名`foo`同时存在于`myObj`本身和从`myObj`开始的`[[Prototype]]`链的更高层，这样的情况称为*遮蔽*。直接存在
于`myObj`上的`foo`属性会*遮蔽*任何出现在链条高层的`foo`属性，因为`myObj.foo`查询总是在寻找链条最底层的`foo`属性。

正如我们被暗示的那样，在`myObj`上的`foo`遮蔽没有看起来那么简单。我们现在来考察`myObj.foo = 'bar'`赋值的三种场景，
当`foo`**不直接存在**于 `myObj`，但**存在**于`myObj`的`[[Prototype]]`链的更高层时：

1. 如果一个普通的名为`foo`的数据访问属性在`[[Prototype]]`链的高层某处被找到，**而且没有被标记为只读（也就是 writable:
   true）**，那么一个名为`foo`的新属性就直接添加到`myObj`上，形成一个**遮蔽属性**。

::: details

```javascript
const obj = { foo: 2 }
const myObj = Object.create(obj)
myObj.foo = 123
console.log(myObj.foo, obj.foo) // 123 2
```

:::

2. 如果一个`foo`在`[[Prototype]]`链的高层某处被找到，但是它被标记为**只读（writable: false）**，那么设置既存属性和
   在`myObj`上创建遮蔽属性都是**不允许**的。如果代码运行在`strict mode`下，一个错误会被抛出。否则，这个设置属性值的操作
   会被无声地忽略。不论怎样，**没有发生遮蔽**。

::: details

```javascript
const obj = {}
Object.defineProperty(obj, 'foo', {
  value: 2,
  writable: false,
  configurable: true,
  enumerable: true,
})
const myObj = Object.create(obj)
myObj.foo = 123
console.log(myObj, obj) // {} { foo: 2}
```

:::

3. 如果一个`foo`在`[[Prototype]]`链的高层某处被找到，而且它是一个 setter，那么这个 setter 总是被调用。没有`foo`会被添加
   到（也就是遮蔽在）`myObj`上，这个`foo`setter 也不会被重定义。

::: details

```javascript
const obj = {
  set foo(value) {
    console.log('set foo:', value)
  },
}
const myObj = Object.create(obj)
myObj.foo = 123 // set foo: 123
console.log(myObj) // {}
```

:::

大多数开发者认为，如果一个属性已经存在于`[[Prototype]]`链的高层，那么对它的赋值（`[[Put]]`）将总是造成遮蔽。但如你所见，
这仅在刚才描述的三种场景中的一种（第一种）是对的。

如果你想在第二和第三种情况中遮蔽`foo`，那你就不能使用`=`赋值，而必须使用`Object.defineProperty(..)`将`foo`添加
到`myObj`。

:::warning

第二种情况可能是三种情况中最让人诧异的了。*只读*属性的存在会阻止同名属性在`[[Prototype]]`链的低层被创建。这个限制的主要
原因是为了增强类继承属性的幻觉。如果你想象位于链条高层的`foo`被继承（拷贝）至`myObj`，那么在`myObj`上强制`foo`属性不可写
就有道理。但如果你将幻觉和现实分开，而且认识到*实际上*没有这样的继承拷贝发生（第四、五章），那么仅因为某些其他的对象上拥
有不可写的`foo`，而导致`myObj`不能拥有`foo`属性就有些不自然。而且更奇怪的是，这个限制仅限于`=`赋值，当使
用`Object.defineProperty(..)`时不被强制。

```javascript
const obj = {}
Object.defineProperty(obj, 'foo', {
  value: 2,
  writable: false,
  configurable: true,
  enumerable: true,
})
const myObj = Object.create(obj)
Object.defineProperty(myObj, 'foo', {
  value: 123,
  writable: true,
  configurable: true,
  enumerable: true,
})
console.log(myObj, obj) // {foo: 123} { foo: 2}
```

:::

如果你需要在方法间进行委托，**方法**的遮蔽会导致难看的*显式假想多态*（第四章）。一般来说，遮蔽与它带来的好处相比太过复杂
和微妙了，**所以你应当尽量避免它**。在第六章介绍一种设计模式，它提倡干净而且不鼓励遮蔽。

遮蔽甚至会以微妙的方式隐含发生，所以想要避免它必须小心。

```javascript
const obj = { a: 2 }

const myObj = Object.create(obj)

console.log(obj.a) // 2
console.log(myObj.a) // 2

console.log(obj.hasOwnProperty('a')) // true
console.log(myObj.hasOwnProperty('a')) // false

myObj.a++ // 隐含遮蔽！

console.log(obj.a) // 2
console.log(myObj.a) // 3

console.log(myObj.hasOwnProperty('a')) // true
```

虽然看起来`myObj.a++`应当（通过委托）查询并*原地*递增`obj.a`属性，但是`++`操作符相当于`myObj.a = myObj.a + 1`。结果就是
在`[[Prototype]]`上进行`a`的`[[Get]]`查询，从`obj.a`得到当前值`2`，将这个值递增 1，然后将值`3`用`[[Put]]`赋值到`myObj`上
的新遮蔽属性`a`上。噢!

修改你的委托属性时要非常小心。如果你想递增`obj.a`，那么唯一正确的方法是`obj.a++`。

## 类

现在你可能会想知道：“*为什么*一个对象需要链到另一个对象？”“真正的好处是什么？”这是一个很恰当的问题，但是我们能够完全理解
和体味它是什么和何用之有前，我们必须首先理解`[[Prototype]]`**不是**什么。

正如第四章讲解的，在 JS 中，对于对象来说没有抽象模式/蓝图，即没有面向类的语言中那样的称为类的东西。JS**只有**对象。

实际上，在所有语言中，JS**几乎是独一无二的**，也许是唯一的可以被称为“面向对象”的语言，因为可以跟白没有类而直接创建对象的
语言很少，而 JS 就是其中之一。

在 JS 中，类不能（因为根本不存在）描述对象可以做什么。对象直接定义它自己的行为。**这里*仅有*对象**。

### “类”函数

在 JS 中有一种奇异的行为被无耻地滥用了许多年来*山寨*成某些*看起来*像“类”的东西。我们来仔细看看就这种方式。

“某种程度的类”这种奇特的行为取决于函数的一个奇怪的性质：所有的函数默认都会得到一个公有的，不可枚举的属性，称
为`prototype`，它可以**指向任意**的对象。

```javascript
function Foo() {}

Foo.prototype // { constructor: ... }
```

这个对象经常被称为`Foo的原型`，因为我们通过一个不幸地被命名为`Foo.prototype`的属性引用来访问它。然而，我们马上就会看到，
这个术语命中注定地将我们搞糊涂。为了取代它，我将称它为“以前被称为是 Foo 的原型的对象”。只是开个玩笑。“一个被随意标记为
‘Foo 点原型’的对象”，怎么样？

不管如何称呼它，这个对象到底是什么？

解释它的最直接的方法是，每个由调用`new Foo()`而创建的对象将最终（有些随意的）被`[[Prototype]]`链接到这个“Food 点原型”对
象。

```javascript
function Foo() {}

const f = new Foo()
console.log(Object.getPrototypeOf(f) === Foo.prototype) // true
```

当通过调用`new Foo`创建`a`时，会发生的事情之一是，`a`得到一个内部`[[Prototype]]`链接，此链接链到`Foo.prototype`所指向的
对象。
