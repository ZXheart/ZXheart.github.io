# :zzz:

## new.target

`new.target` 属性用于检测函数或构造方法是否是通过 `new` 运算符被调用的。在通过 `new` 运算符被初始化的函数或构造方法中
，`new.target` 返回一个指向构造方法或函数的**引用**。在普通函数的调用中，`new.target` 的值为 `undefined`。

通常`new.`的作用是提供属性访问的上下文，但这里`new.`并不是一个真正的对象。不过在构造方法调用中，`new.target`指向
被`new`调用的构造函数，所以`new.`成为了一个虚拟上下文。

`new.target`属性适用于所有函数访问的元属性。在箭头函数中，`new.target`指向最近外层函数的`new.target`。

在普通的函数调用中，`new.target`的值为`undefined`。可用以检测函数是否被`new`调用。

```javascript
function Foo() {
  if (!new.target) throw 'Foo() must be called with new'
  console.log('Foo instantiated with new')
}
Foo() // Error: Foo() must be called with new
new Foo() // Foo instantiated with new
```

在类的构造方法中，`new.target`指向被`new`调用的构造函数。并且在继承中，`new.target`指向最终被实例化的构造函数。

```javascript
class Foo {
  constructor() {
    console.log(new.target.name)
  }
}
class Bar extends Foo {
  constructor() {
    super()
  }
}
const foo = new Foo() // Foo
const bar = new Bar() // Bar
```
