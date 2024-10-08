# :zzz:

[《你不知道的 JavaScript》](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20%26%20object%20prototypes/apA.md)

# 附录 A：ES6 `class`

如果说本书后半部分（第四到第六章）有什么关键信息，那就是类是一种代码的可选设计模式（不是必要的），而且用像 JS 这样的`[[Prototype]]`语言来实
现它总是很尴尬。

虽然这种尴尬很大一部分关于语法，但*不仅限于此*。第四和第五章审视了相当多的难看语法，从使代码杂乱的`.prototype`引用的繁冗，到*显式假想多态*：
当你在链条的不同层级上给方法相同的命名试图实现从低层方法到高层方法的多态引用。`.constructor`被错误地解释为“被 XX 构建”，这成为了一个不可靠
的定义，也成为了另一个难看的语法。

但关于类的设计的问题要深刻多了。第四章指出在传统的面向类语言中，类实际上发生了从父类向子类，由子类向实例的*拷贝*动作，而在`[[Prototype]]`中，
动作**不是**一个拷贝，而是相反 —— 一个委托链接。

OLOO 风格和行为委托接受了`[[Prototype]]`，而不是将它隐藏起来，当比较它们的简单性时，类在 JS 中的问题就凸显出来。

## class

我们*不必*再次争论这些问题。我在这里简单地重提这些问题仅仅是为了使它们在你的头脑里保持新鲜，以使我们将注意力转向 ES6 的`class`机制。我们将
在这里展示它如何工作，并且看看`class`是否实质上解决了任何这些“类”的问题。

让我们重温第六章的`Widget`和`Button`的例子：

```js
class Widget {
  constructor(width = 50, height = 50) {
    this.width = width
    this.height = height
    this.$elem = null
  }
  render($where) {
    if (this.$elem) {
      this.$elem
        .css({
          width: this.width + 'px',
          height: this.height + 'px',
        })
        .appendTo($where)
    }
  }
}

class Button extends Widget {
  constructor(width, height, label = 'Default') {
    super(width, height)
    this.label = label
    this.$elem = $('<button>').text(this.label)
  }
  render($where) {
    super.render($where)
    this.$elem.click(this.onClick.bind(this))
  }
  onClick(evt) {
    console.log('Button ' + this.label + ' clicked!')
  }
}
```

除了语法上*看起来*更好，ES6 还解决了什么？

1. 不再有（某种意义上的，继续往下看！）指向`.prototype`的引用来弄乱代码。
2. `Button`被声明为直接“继承自”（也就是`extends`）`Widget`，而不是需要用`Object.create(..)`来替换`.prototype`链接的对象，或者用
   `__prototype__`和`Object.setPrototypeOf(..)`来设置它。
3. `super(..)`现在给了我们非常有用的**相对多态**的能力，所以在链条上某一个层级上的任何方法，可以引用链条上相对上一层的同名方法。第四章中
   有一个关于构造器的奇怪现象：构造器不属于它们的类，而且因此与类没有关系。`super(..)`含有一个对此问题的解决方法 —— `super(..)`会在构造器内部
   像如你期望的那样工作。
4. `class`字面语法不能指定属性（只能指定方法）。这看起来限制了某些东西，但是绝大多数情况下期望一个属性（状态）存在于链条末端的“实例”
   以外的地方，这通常是一个错误和令人诧异（因为这个状态被隐含地在所有“实例”中“分享”）的。所以，也可以说`class`语法防止你出现错误。
5. `extends`甚至允许你用非常自然的方式扩展内建的对象（子）类型，比如`Array`或者`RegExp`。在没有`class .. extends`的情况下这样做一直以
   来是一个极端复杂且令人沮丧的任务，只有最熟练的框架作者曾经正确地解决过这个问题。现在，它是小菜一碟！

凭心而论，对多数明显的（语法上的）问题，和经典的原型风格代码使人诧异的地方，这些确实是实质上的解决方案。

## `class`的坑

然而，它不全是优点。在 JS 中将“类”作为一种设计模式，仍然有一些深刻和非常令人烦恼的问题。

首先，`class`语法可能会说服你 JS 在 ES6 中存在一个新的“类”机制，**但不是这样**。`class`很大程度上仅仅是一个既存的`[[Prototype]]`（委托）
机制的语法糖。

这意味着`class`实际上不是像传统面向类的语言那样，在声明时静态地拷贝定义。如果你在“父类”上更改/替换一个方法（有意或无意地），子“类”/实例将会
受到“**影响**”，因为它们在声明时没有得到一份拷贝，它们依然都使用那个基于`[[Prototype]]`的实时委托模型。

```javascript
class C {
  constructor() {
    this.num = Math.random()
  }
  rand() {
    console.log('Random: ' + this.num)
  }
}
var c1 = new C()
c1.rand() // Random: 0.4324299...

C.prototype.rand = function () {
  console.log('Random: ' + Math.round(this.num * 1000))
}

var c2 = new C()
c2.rand() // Random: 867

c1.rand() // Random: 432
```

这种行为只有在*你已经知道了*关于委托的性质，而不是期待从“真的类”中*拷贝*时，才看起来合理。那么你要问自己的问题是，为什么你为了根本上就和类
不同的东西选择`class`语法？

ES6 的`class`语法不是使观察和理解传统的类和委托对象间的不同**变得更困难**了吗？

`class`语法*没有*提供声明类的属性成员的方法（仅对方法有，ES2022 引入了类字段声明语法）。所以如果你需要跟踪对象间分享的状态，那么最终会回到
难看的`.prototype`语法，像这样：

```javascript
class C {
  constructor() {
    // 确保修改的是共享状态
    // 不是设置实例上的遮蔽属性
    C.prototype.count++

    // 这里，`this.count`通过委托如我们期望的那样工作
    console.log('Hello: ' + this.count)
  }
}

// 直接在原型对象上添加一个共享属性
C.prototype.count = 0

var c1 = new C() // Hello: 1

var c2 = new C() // Hello: 2

c1.count === 2 // true
c1.count === c2.count // true
```

这里最大的问题是，由于它将`.prototype`作为实现细节暴露（泄露！）出来，而背叛了`class`语法的初衷。

而且，我们还依然面临着那个令人诧异的陷阱：`this.count++`将会隐含地在`c1`和`c2`两个对象上创建一个分离的遮蔽属性`.count`，而不是更新共享
状态。`class`没有在这个问题上给我们什么安慰，除了（大概是）通过缺少语法支持来暗示你*根本*就不该这么做。

另外，无意地遮蔽依然是个灾难：

```javascript
class C {
  constructor(id) {
    // 噢，一个坑，我们用实例上的属性值遮蔽了`id()`方法
    this.id = id
  }
  id() {
    console.log('Id: ' + this.id)
  }
}
var c1 = new C('c1')
c1.id() // TypeError: c1.id is not a function -- `c1.id`现在是字符串'c1'
```

还有一些关`super`如何工作的微妙问题。你可能会假设`super`将会以一种类似与`this`得到绑定的方式（见第二章）来被绑定，也就是`super`总是会绑定
到当前方法在`[[Prototype]]`链的位置的更高一层。

然而，因为性能问题（`this`绑定已经很耗费性能了），`super`不是动态绑定的。它在声明时，被有些“静态的”绑定。不是什么大事儿，对吧？

嗯... 可能是，可能不是。如果你像大多数 JS 开发者那样，开始把函数以各种不同的方式赋值给不同的（来自于`class`定义的）对象，你可能不会意识到在
所有这些情况下，底层的`super`机制会不得不每次都重新绑定。

而且根据你每次赋值采取的语法方式不同，很有可能在某些情况下`super`不能被正确地绑定（至少不会像你期望的那样），所以你可能（在写作这里时，TC39）
正在讨论这个问题，会不得不用`toMethod(..)`来手动绑定`super`（有点儿像你不得不用`bind(..)`绑定`this` —— 见第二章）。

你曾经可以给不同的对象赋予方法，来通过*隐式绑定*规则（见第二章），自动地利用`this`的动态性。但对于使用`super`的方法，同样的事情很可能不会发生。

考虑这里`super`应当怎样动作（对`D`和`E`）：

```javascript
class P {
  foo() {
    console.log('P.foo')
  }
}
class C extends P {
  foo() {
    // 现在这种写法会报错，SyntaxError: 'super' keyword unexpected here
    // 作者写的时候可以的，可能是 TC39 在这个问题上做了一些调整
    // super()

    // 现在（2024/08/04）super关键字用于访问对象字面量或类的原型`[[Prototype]]`上的属性，或调用父类的构造函数。
    super.foo()
  }
}

var c1 = new C()
c1.foo() // P.foo

var D = {
  foo: function () {
    console.log('D.foo')
  },
}

var E = {
  foo: C.prototype.foo,
}

// E 链接到 D 来进行委托
Object.setPrototypeOf(E, D)

E.foo() // P.foo
```

如果你（十分合理地！）认为`super`将会在调用时自动绑定，你可能会期望`super()`将会自动地认识到`E`委托至`D`，所以使用`super()`的`E.foo()`
应当调用`D.foo()`。

**不是这样**。由于实用主义的性能原因，`super`不像`this`那样*延迟绑定*（也就是动态绑定）。相反它从调用时`[[HomeObject]].[[Prototype]]`
派生出来，而`[[Prototype]]`是在声明时静态绑定的。

在这个特定的例子中，`super()`依然解析为`P.foo()`，因为方法的`[[HomeObject]]`仍然是`C`而且`C.[[Prototype]]`是`P`。

*可能*会有方法手动地解决这样的陷阱。在这个场景中使用`toMethod(..)`来绑定/重绑定方法的`[[HomeObject]]`（设置这个对象的`[[Prototype]]`）
一起！）似乎会管用：

```javascript
var D = {
  foo: function () {
    console.log('D.foo')
  },
}

// E 链接到 D 来进行委托
var E = Object.create(D)

// 手动绑定 `foo` 的 `[[HomeObject]]` 到
// `E`, 因为 `E.[[Prototype]]` 是 `D`，所以
// `super()` 是 `D.foo()`
E.foo = C.prototype.foo.toMethod(E, 'foo') // 这本书写的是真早啊，toMethod 这个方法仅是实验性的，并没有进入标准。

E.foo() // "D.foo"
```

> [!NOTE]
>
> `toMethod()`克隆这个方法，然后将它的第一个参数作为`homeObject`（这就是为什么我们传入`E`），第二个参数（可选）用来设置新方法的`name`（
> 保持“foo”不变）。

除了这种场景以外，是否还有其他的极端情况会使开发者落入陷阱还有待观察。无论如何，你将不得不费心保持清醒：在哪里引擎自动为你确定`super`，和
在哪里你不得不手动处理它。_噢_！

（现在这些问题可能已经被解决了，但是这里的例子仍然有助于你理解`super`的工作原理）

# 静态优于动态？

但是关于 ES6 的最大问题是，所有这些种种陷阱意味着`class`有点儿将你带入一种语法，它看起来暗示着（像传统的类那样）一旦你声明一个`class`，它是
一个东西的静态定义（将来会实例化）。使你完全忘记了这个事实：`C`是一个对象，一个你可以直接互动的具体的东西。

在传统面向类的语言中，你从不会在晚些时候调整类的定义，所以类设计模式不提供这样的能力。但是 JS 的**一个最强大的部分**就是它*是*动态的，而且
任何对象的定义都是（除非你将它设定为不可变）不固定的可变的*东西*。

`class`看起来在暗示你不应该做这样的事情，通过强制你使用`.prototype`语法才能做到，或强制你考虑`super`的陷阱，等等。而且它对这种动态机制可能
带来的一切陷阱*几乎不*提供任何支持。

换句话说，`class`好像在告诉你：“动态太坏了，所以这可能不是一个好主意。这里有看似静态语法，把你的东西静态编码。”

关于 JS 的评论是多么悲伤啊：**动态太难了，让我们假装成（但实际上不是！）静态吧。**

这些就是为什么 ES6`class`语法看似解决了语法上的痛点，但是它实际上把水搅得更浑，而且更不容易对 JS 形成清晰简明的认识。

> [!NOTE]
> 如果你使用`bind(..)`工具制作一个硬绑定函数（见第二章），那么这个函数是不能像普通函数那样用 ES6 的`extends`扩展的.

## 复习

`class`在假装修复 JS 中的类/继承设计模式的问题上做得很好。但它实际上做的却正好相反：**它隐藏了许多问题，而且引入了其他微妙而且危险的东西**。

`class`为折磨了 JS 语言将近二十年的“类”的困扰做出了新的贡献。在某些方面，它提出的问题比它解决的多，而且在`[[Prototype]]`机制的优雅和简单
之上，它整体上感觉像是一个非常不自然的匹配。

总结：如果 ES6`class`使稳健地利用`[[Prototype]]`变得困难，而且隐藏了 JS 对象机制最重要的性质 —— **对象间的事实委托链接** —— 我们不应该
认为`class`产生的麻烦比它解决的更多，并且将它贬低为一种反模式吗？

我真的不能帮你回答这个问题。但我希望这本书已经在你为经历过的深度上完全地探索了这个问题，而且已经给出了*你自己回答这个问题*所需的信息。
