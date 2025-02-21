# :zzz:

## 表达式

```javascript
// prettier-ignore
for(初始化; 条件判断; 更新){
    // 循环体
}
```

### 1. 初始化（initialization）

- 只有循环开始时执行一次，用于定义和初始化循环变量

- 示例：

  ```javascript
  for (let i = 0; i < 3; i++) {
    console.log(i)
  }
  ```

- 可以省略：如果变量在`for`外已经定义，就可以省略：

  ```javascript
  let i = 0
  for (; i < 3; i++) {
    console.log(i)
  }
  ```

### 2. 条件判断（condition）

- 在**每次循环迭代开始前**都会执行，返回`true`继续循环，`false`终止循环。

- 示例：

  ```javascript
  for (let i = 0; i < 3; i++) {
    console.log(i)
  }
  ```

- 可以省略：如果省略，默认**永远为`true`**，相当于`while(true)`（会变成死循环）：

  ```javascript
  for (let i = 0; ; i++) {
    console.log(i)
    if (i === 2) break // 如果没有break，会变成死循环
  }
  ```

### 3. 更新（update）

- **每次循环执行完毕后**执行一次，通常用于更新循环变量。

- 示例：

  ```javascript
  for (let i = 0; i < 3; i++) {
    console.log(i)
  }
  ```

- 可以省略：如果逻辑在`for`体内实现，也可以省略：

  ```javascript
  for (let i = 0; i < 3; ) {
    console.log(i)
    i++
  }
  ```

## 完全省略所有部分

如果所有部分都省略，`for`依然是合法的，会变成*无限循环*（和`while (true)`一样）：

```javascript
for (;;) {
  console.log('looping')
}
```

这种写法通常需要`break`语句手动跳出循环，否则会卡死：

```javascript
for (;;) {
  console.log('looping')
  if (Math.random() > 0.5) break
}
```
