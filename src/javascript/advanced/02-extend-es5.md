## new

new 时候构造函数内部发生了什么

- 创建一个空对象 A
- 如果构造函数的`prototype`属性是一个对象，则将 A 的`__proto__`属性指向构造函数的`prototype`属性；否则，A 的`__proto__`属性指向`Object.prototype`
- 构造函数中的所有 this 引用指向 A，并使用给定参数执行构造函数
- 如果构造函数返回非原始值（非 null 对象），则返回值成为整个`new`表达式的结果。否则，如果构造函数没有返回值或者返回值是原始值，则返回 A
  （构造函数返回了非 null 对象，实例则为该非 null 对象。若是返回了原始值/非没有返回任何值，实例则为 A）

## 原型链继承（继承属性方法）

```javascript
function SuperType() {
  this.name = 'superType'
}
SuperType.prototype.sayName = function () {
  console.log(`using SuperType.prototype.sayName: ${this.name}`)
}

function subType() {
  this.name = 'subType'
}
subType.prototype.sayName = function () {
  console.log(`using subType.prototype.sayName: ${this.name}`)
}

subType.prototype = new SuperType()
const subInstance = new subType()

console.log(subType.prototype.constructor === SuperType) // true
console.log(subInstance.constructor === SuperType) // true
subInstance.sayName() // using SuperType.prototype.sayName: subType

// subType.prototype.sayName() 永远也不会被调用，因为subType.prototype已经被SuperType实例替换了，所以subInstance寻找sayName
// 时，会先在subInstance上找，找不到再去subType.prototype上找，找不到再去SuperType.prototype上找

// 但如果在替换subType.prototype之后，再给subType.prototype添加方法，那么subType.prototype.sayName()就会被调用
```

缺点：若父类原型上有引用类型的属性，子类实例会共享这个引用类型的属性

```javascript
function
```
