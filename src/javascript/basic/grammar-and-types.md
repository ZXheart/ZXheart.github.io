# Grammar and types

## Comments

```javascript
// 单行注释

/* 多行注释 */

#! shebang注释

```

:::tip
备注: 一般情况下，**`#!` 用于指定脚本的解释程序**，如 `#!/usr/bin/env node`，这种注释称为 `shebang / ʃɪˈbæŋ` 注释。
`shebang` 注释是一种特殊的注释语法，其行为与 `//` 完全一样，但
-  **只在脚本或模块最开始处有效**
-  `#!` 标志之前不能有任何空白字符
-  `#!` 标志之后所有字符组成直到第一行末尾
-  只允许有一条这样的注释
-  只能用以指定JS解释器，其他所有情况都应使用 `//` 或 `/* */`
:::

## Declarations (*/ ˌdekləˈreɪʃn*)

### Variables
一个Javascript标识符(变量名)必须以字母、下划线（_）或美元符号（$）开头，后面可以跟字母、数字、下划线或美元符号。

### Initialization (*/ ɪˌnɪʃəlaɪˈzeɪʃn*)
`var` 和 `let` 声明的变量可以不初始化，默认为 `undefined`。`const` 声明的变量必须初始化，否则会报错。