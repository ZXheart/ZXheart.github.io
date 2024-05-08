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

在面向类的语言中，可以制造一个类的多个**拷贝**（即“实例”），就像从模具中冲压出某些东西一样。我们在第四章看到，这是因为初
始化（或者继承）类的处理意味着，“将行为计划从这个类拷贝到物理对象中”，对于每一个新实例这都会发生。

但是在 JS 中，没有这样的拷贝处理发生。你不会创建类的多个实例。你可以创建多个对象，它们的`[[Prototype]]`连接至一个共通对
象。但默认地，没有拷贝发生，如此这些对象彼此间最终不会完全分离和切断关系，而是**_链接在一起_**。

`new Foo()`得到一个新对象（我们叫他`a`），这个新对象`a`内部地被`[[Prototype]]`链接至`Foo.prototype`对象。

**结果我们得到两个对象，彼此链接。**如是而已。我们没有初始化一个对象。当然我们也没有做任何从一个“类”到一个实体对象的拷贝
。我们只是让两个对象相互链接在一起。

事实上，这个使大多数 JS 开发者无法理解的秘密，是因为`new Foo()`函数调用实际上几乎和建立链接的处理没有任何*直接*关系
。**它是某种偶然的副作用**。`new Foo()`是一个间接的，迂回的方法来得到我们想要的：**一个被链接到另一个对象的对象**。

我们能用更直接的方法得到我们想要的吗？**可以!**这位英雄就是`Object.create(..)`。我们过会儿就会谈它。

#### 名称的意义何在？

在 JS 中，我们不从一个对象（“类”）向另一个对象（“实例”）_拷贝_。我们在对象之间制造*链接*。对于`[[Prototype]]`机制常被称
为“原型继承（prototypal inheritance）”，它经常被说成动态语言版的“类继承”。这种说法试图建立在面向类世界中对“继承”含义的共
识上。但是*弄拧*（**意思是：抹平**）了被理解的语义，来适应动态脚本。

先入为主，“继承”这个词有很强的含义。仅仅在它面前加入“原型”来区别于 JS 中*实际上几乎相反的*行为，使真相在泥泞般的困惑中沉
睡了近二十年。

我想说，将“原型”贴在“继承”之前很大程度上搞反了它的实际意义，就像一只手拿着一个桔子，另一手拿着一个苹果，而坚持说苹果是一
个“红色的桔子”。无论我在它面前放什么令人困惑的标签，那都不会改变一个水果是苹果而另一个是桔子的*事实*。

更好的方法是直白地将苹果称为苹果 —— 使用最准确和最直接的术语。这样能更容易地理解它们的相似之处和**许多不同之处**，因为我
们都对“苹果”的意义有一个简单的，共享的理解。

由于用语的模糊和歧义，我相信，对于解释 JS 机制真正如何工作来说，“原型继承”这个标签（以及试图错误地应用所有面向类的术语，
比如“类”，“构造器”，“实例”，“多态”等）本身带来的**危害比好处多**。

“继承”意味着*拷贝*操作，而 JS 不拷贝对象属性（原生上，默认地）。相反，JS 在两个对象间建立链接，一个对象实质上可以将对属
性/函数的访问*委托*到另一个对象上。对于描述 JS 对象链接机制来说，“委托”是一个准确得多的术语。

另一个有时被扔到 JS 旁边的术语是“差分继承”。它的想法是，我们可以用一个对象与一个更泛化得对象的*不同*来描述一个它的行为。
比如，你要解释汽车是一种载具，与其重新描述组成一个一般载具的所有特点，不如只说它有四个轮子。

如果你试着想象，在 JS 中任何给定的对象都是通过委托可用的所有行为的总和，而且**在你思维中你扁平化**所有的行为到一个有形
的*东西*中，那么你就可以（八九不离十地）看到“差分继承”是如何自圆其说。（tmd，在说些什么啊？）

但正如“原型继承”，“差分继承”假意使你的思维模型比在语言中物理发生的事情更重要。它忽略了这样一个事实：对象`B`实际上不是一
个差异结构，而是由一些定义好的特定性质，与一些没有任何定义的“漏洞”组成的。正是通过这些“漏洞”（缺少定义），委托可以接管并
且动态地用委托行为“填补”它们。（说啥呢？）

对象不是像“差分继承”的思维模型所暗示的那样，原生默认地，**通过拷贝**扁平化到一个单独的差异对象中。因此，对于描述 JS
的`[[Prototype]]`机制如何工作来说，“差分继承”就不是自然合理。

你*可以选择*偏向“差分继承”这个术语和思维模型，这是个人口味问题，但是不能否认这个事实：它*仅仅*符合在你思维中的主观过程，
不是引擎的物理行为。

### “构造器”（constructor）

```javascript
function Foo() {}
const a = new Foo()
```
