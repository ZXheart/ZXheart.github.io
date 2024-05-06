# :zzz:

[《你不知道的 JavaScript》](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20%26%20object%20prototypes/ch5.md)

:::warning

所有模拟类拷贝行为的企图，也就是我们在前面第四章描述的内容，称为各种种类的“mixin”，和我们要在本章讲解的`[[Prototype]]`链
机制完全不同。

:::

## `[[Prototype]]`

JS 中的对象有一个内部属性，在语言规范中称为`[[Prototype]]`，它只是一个其他对象的引用。几乎所有的对象的被创建时，它的这个
属性都被赋予了一个非`null`值。

:::

warning 我们马上就会看到，一个对象拥有一个空的`[[Prototype]]`链接是*可能*的，虽然这有些不寻常。

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

这个处理持续进行，知道找到名称匹配的属性，或者`[[Prototype]]`链终结。如果在链条的末尾都没有找到匹配的属性，那
么`[[Get]]`操作的返回结果为`undefined`。

和这种`[[Prototype]]`链查询处理相似，如果你使用`for..in`循环迭代一个对象，所有在它的链条上可以到达的（并且
是`enumerable`）属性都会被枚举。如果你使用`in`操作符来测试一个属性在一个对象上的存在性，`in`将会检查对象的整个链条（主管
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

2. 如果一个`foo`在`[[Prototype]]`链的高层某处被找到，但是它被标记为**只读（writable: false）**，那么设置既存属性和
   在`myObj`上创建遮蔽属性都是**不允许**的。如果代码运行在`strict mode`下，一个错误会被抛出。

::: details

```javascript
const obj = {}
Object.defineProperty(obj, 'foo', {
  value: 2,
  writable: false,
  configurable: true,
  enumerable: true,
})
const obj1 = Object.create(obj)
obj1.foo = 123
console.log(obj1) // {}
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
const obj1 = Object.create(obj)
obj1.foo = 123 // set foo: 123
console.log(obj1) // {}
```

:::
