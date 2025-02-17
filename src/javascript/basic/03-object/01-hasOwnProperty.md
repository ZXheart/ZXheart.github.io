# :zzz:

## Object#hasOwnProperty()

`hasOwnProperty()`方法返回一个布尔值，表示对象自有属性（而非继承来的属性）中是否具有指定的属性。

> [!NOTE]
> 在支持`Object.hasOwn`的浏览器中，建议使用`Object.hasOwn()`代替`Object#hasOwnProperty()`。原因如下:

#### 1. 使用 hasOwnProperty 作为属性名

```javascript
const foo = {
  hasOwnProperty() {
    return false
  },
  bar: 'Here be dragons',
}

foo.hasOwnProperty('bar') // false
```

- 解决这个问题首推`Object.hasOwn()`

```javascript
Object.hasOwn(foo, 'bar') // true
```

- 也可以使用 Object 原型中的`hasOwnProperty`方法

```javascript
Object#hasOwnProperty.call(foo, 'bar') // true
```

- 也可以使用另一个安全的对象的`hasOwnProperty`方法

```javascript
;({}).hasOwnProperty.call(foo, 'bar') // true
```

#### 2. 由 Object.create(null)创建的对象

使用`Object.create(null)`创建的对象不从`Object.prototype`继承，使得`hasOwnPrototype()`不可访问。

```javascript
const foo = Object.create(null)
foo.bar = 1
foo.hasOwnProperty('bar') // TypeError: foo.hasOwnProperty is not a function
```
