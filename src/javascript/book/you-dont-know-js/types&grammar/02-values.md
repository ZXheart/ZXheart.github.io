# :zzz:

[《你不知道的 JavaScript》](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/types%20%26%20grammar/ch2.md)

# 值

`array`、`string`和`number`是任何程序的最基础构建块，但是 JS 在这些类型上有一些或使你惊喜或使你惊讶的独特性质。

让我们来看几种 JS 内建的值类型，并探讨一下我们如何才能更加安全地理解并正确地利用它们的行为。

## Array

和其他强制类型的语言相比，JS 的`array`只是值的容器，而这些值可以是任何类型：`string`或者`number`或者`object`，甚至是另一个`array`（这
也是你得到多维数组的方法）。

```javascript
var a = [1, '2', [3]]

a.length // 3
a[0] === 1 // true
a[2][0] === 3 // true
```

你不需要预先指定`array`的大小，你可以仅声明它们并加入你觉得合适的值：

```javascript
var a = []

a.length // 0

a[0] = 1
a[1] = '2'
a[2] = [3]

a.length // 3
```

**警告：** 在一个`array`值上使用`delete`将会从这个`array`上移除一个值槽，但就算你移除了最后一个元素，它也**不会**更新`length`属性，
所以要多加小心！我们会在第五章讨论`delete`操作符的更多细节。

y 要小心创建“稀疏”的`array`（留下或创建空的/丢失的槽）：

```javascript
var a = []

a[0] = 1
// 这里没有设置值槽 `a[1]`
a[2] = 3

a[1] // undefined

a.length // 3
```

虽然这可以工作，但你留下的“空槽”可能会导致一些令人困惑的行为。骚然这样的值槽看起来拥有`undefined`值，但是它不会像被明确设置`(a[1] = undefined)`
的值槽那样动作。更多信息可以参见第三章的“Array”。

`array`是被数字索引的（正如你所想的那样），但微妙的是它们也是对象，可以在它们上面添加`string`键/属性（但是这些属性不会计算在`array`的`length`中）：

```javascript
var a = []

a[0] = 1
a['foobar'] = 2

a.length // 1
a['foobar'] // 2
a.foobar // 2
```

然而，一个需要小心的坑是，如果一个可以被强制转换为 10 进制`number`的`string`值被用作键的话，它会认为你想使用`number`索引而不是一个`string`键！

```javascript
var a = []

a['13'] = 42

a.length // 14
```

一般来说，向`array`添加`string`键/属性不是一个好主意。最好使用`object`来持有键/属性形式的值，而将`array`专用于严格地数字索引的值。
