# :zzz:

[《你不知道的 JavaScript》](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20%26%20object%20prototypes/apA.md)

# 附录 A：ES6 `class`

如果说本书后半部分（第四道第六章）有什么关键信息，那就是类是一种代码的可选设计模式（不是必要的），而且用像 JS 这样的`[[Prototype]]`语言来实
现它总是很尴尬。

虽然这种尴尬很大一部分关于语法，但*不仅限于此*。第四和第五章审视了相当多的难看语法，从使代码杂乱的`.prototype`引用的繁冗，到*显式假想多态*：
当你在链条的不同层级上给方法相同的命名试图实现从低层方法到高层方法的多态引用。`.constructor`被错误地解释为“被 XX 构建”，这成为了一个不可靠
的定义，也成为了另一个难看的语法。

但关于类的设计的问题要深刻多了。第四章指出在传统的面向类语言中，类实际上发生了从父类向子类，由子类向实例的*拷贝*动作，而在`[[Prototype]]`中，
动作**不是**一个拷贝，而是相反————一个委托链接。

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
